using HealthCheckAPI;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHealthChecks()
    .AddCheck("ICM_01",
    new ICMPHealthCheck("www.ryadel.com", 100))
    .AddCheck("ICM_02",
    new ICMPHealthCheck("www.google.com", 100))
    .AddCheck("ICM_01P",
    new ICMPHealthCheck($"www.{Guid.NewGuid():N}.com", 100));
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

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowAllOrigins");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseHealthChecks(new PathString("/api/health"),
    new CustomHealthCheckOptions());

app.MapHub<HealthCheckHub>("/api/health-hub");

app.MapGet("/api/broadcast/update", async(IHubContext<HealthCheckHub> hub) =>{
    await hub.Clients.All.SendAsync("Update", "test");
    return Results.Text("Update message sent");
});

app.MapControllers();

app.Run();
