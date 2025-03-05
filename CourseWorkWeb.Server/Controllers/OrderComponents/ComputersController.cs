using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseWorkWeb.Server.Model;

namespace CourseWorkWeb.Server.Controllers.OrderComponents
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComputersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ComputersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Computer>>> GetComputers()
        {
            return await _context.Computers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Computer>> GetComputerById(Guid id)
        {
            var computer = await _context.Computers.FindAsync(id);

            if (computer == null)
            {
                return NotFound();
            }

            return computer;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComputer(Guid id)
        {
            var computer = await _context.Computers.FindAsync(id);
            if (computer == null)
            {
                return NotFound();
            }

            _context.Computers.Remove(computer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Computer>> AddComputer([FromBody] Computer newComputer)
        {
            if (newComputer == null)
            {
                return BadRequest("Невірний формат даних.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Computers.Add(newComputer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComputerById), new { id = newComputer.ID }, newComputer);
        }

        [HttpPost("ids")]
        public async Task<ActionResult<IEnumerable<Computer>>> GetComputersByIds([FromBody] IdListRequest request)
        {
            var computers = await _context.Computers
                .Where(c => request.Ids.Contains(c.ID))
                .ToListAsync();

            if (computers == null || computers.Count == 0)
            {
                return NotFound("Комп'ютери не знайдені.");
            }

            return Ok(computers);

        }
    }
}