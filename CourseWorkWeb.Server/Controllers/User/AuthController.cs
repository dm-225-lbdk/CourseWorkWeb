using CourseWorkWeb.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseWorkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                return BadRequest("User with this email already exists.");

            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Wallet = userDto.Wallet,
                Address = userDto.Address,
                Password = userDto.Password,
                Roles = userDto.Roles
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Registration successful.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == userDto.Email);

            if (user == null || user.Password != userDto.Password)
                return Unauthorized("Invalid credentials.");

            return Ok(new { user.ID, user.Username, user.Email, user.Address, user.Wallet, user.Roles });
        }
    }

    public class UserLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
