using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using WorldCitiesApi.Data;
using WorldCitiesApi.Data.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.MSSqlServer(
        connectionString: ctx.Configuration.GetConnectionString("ConnectionWorldCitiesDB"),
        restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information,
        sinkOptions: new Serilog.Sinks.MSSqlServer.MSSqlServerSinkOptions
        {
            TableName = "LogEvents",
            AutoCreateSqlTable = true
        })
    .WriteTo.Console() // Log to the console
);

// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder
            .AllowAnyOrigin() // Permite qualquer origem
            .AllowAnyMethod() // Permite qualquer m�todo (GET, POST, etc.)
            .AllowAnyHeader(); // Permite qualquer cabe�alho
    });
});

// Add ApplicationDbContext and SQL Server support
builder.Services.AddDbContext<ApplicationDbContext>(options => 
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("ConnectionWorldCitiesDB")
        )
);

// Add ASP.NET Core Identity support
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true; 
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add Authentication services & middlewares
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecurityKey"]))
    };
});

builder.Services.AddCors(options => 
    options.AddPolicy(name: "AngularPolicy",
        cfg =>
        {
            cfg.AllowAnyHeader();
            cfg.AllowAnyMethod();
            cfg.WithOrigins(builder.Configuration["AllowedCORS"]);
        }
));

builder.Services.AddScoped<JwtHandler>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowAllOrigins");
}

app.UseSerilogRequestLogging();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AngularPolicy");

app.MapControllers();

app.MapMethods("/api/heartbeat", new[] { "HEAD" },
    () => Results.Ok());

app.Run();
