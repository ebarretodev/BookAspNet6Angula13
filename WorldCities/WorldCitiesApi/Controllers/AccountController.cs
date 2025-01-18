using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WorldCitiesApi.Data;
using WorldCitiesApi.Data.Models;

namespace WorldCitiesApi.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtHandler _jwtHandler;

        public AccountController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            JwtHandler jwtHandler)
        {
            _context = context;
            _userManager = userManager;
            _jwtHandler = jwtHandler;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            var user = await _userManager.FindByNameAsync(loginRequest.Email);
            if (user == null)
                user = await _userManager.FindByEmailAsync(loginRequest.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginRequest.Password))
                return Unauthorized(new LoginResult() {
                    Success = false,
                    Message = "Invalid Authentication"
                });

            var secToken = await _jwtHandler.GetTokenAsync(user);
            var jwt = new JwtSecurityTokenHandler().WriteToken(secToken);
            return Ok(new LoginResult()
            {
                Success = true,
                Message = "Login successful",
                Token = jwt
            });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterRequest registerRequest)
        {
            var checkUsername = await _userManager.FindByNameAsync(registerRequest.Username);
            var checkEmail = await _userManager.FindByEmailAsync(registerRequest.Email);
            if (checkUsername != null || checkEmail != null)
                return Conflict(new { message = "Usuário ou email já existe!" });

            var newUser = new ApplicationUser()
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = registerRequest.Username,
                Email = registerRequest.Email
            };
            // insert the standard user into the DB
            await _userManager.CreateAsync(newUser, registerRequest.Password);
            // assign the "RegisteredUser" role
            await _userManager.AddToRoleAsync(newUser, "RegisteredUser");
            // confirm the e-mail and remove lockout
            newUser.EmailConfirmed = true;
            newUser.LockoutEnabled = false;
            await _context.SaveChangesAsync();

            var user = await _userManager.FindByNameAsync(registerRequest.Username);

            var secToken = await _jwtHandler.GetTokenAsync(user);
            var jwt = new JwtSecurityTokenHandler().WriteToken(secToken);

            return Ok(new LoginResult()
            {
                Success = true,
                Message = "Login successful",
                Token = jwt
            });
        }
    }
}
