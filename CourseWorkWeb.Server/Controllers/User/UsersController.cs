using CourseWorkWeb.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CourseWorkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("roles")] 
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var usersWithRoles = await _context.Users
                .Select(user => new
                {
                    user.ID,
                    user.Username,
                    user.Roles
                })
                .ToListAsync();

            if (usersWithRoles.Count == 0)
            {
                return NotFound("No users found.");
            }
            return Ok(usersWithRoles);
        }
    }
}