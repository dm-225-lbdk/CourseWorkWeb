using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseWorkWeb.Server.Model;

namespace CourseWorkWeb.Server.Controllers.OrderComponents
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeliveriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDeliveries()
        {
            var deliveries = await _context.Deliveries.ToListAsync();
            if (deliveries == null || deliveries.Count == 0)
            {
                return NotFound("No deliveries found");
            }

            return Ok(deliveries);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDelivery([FromBody] Delivery delivery)
        {
            if (delivery == null)
            {
                return BadRequest("Delivery data is null");
            }

            if (string.IsNullOrEmpty(delivery.Name) || string.IsNullOrEmpty(delivery.Address) || string.IsNullOrEmpty(delivery.PhoneNumber))
            {
                return BadRequest("All fields are required");
            }

            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateDelivery), new { id = delivery.ID }, delivery);
        }

        [HttpPost("ids")]
        public async Task<ActionResult<IEnumerable<Delivery>>> GetDeliveriesByIds([FromBody] IdListRequest request)
        {
            var deliveries = await _context.Deliveries
                .Where(d => request.Ids.Contains(d.ID))
                .ToListAsync();

            if (deliveries == null || deliveries.Count == 0)
            {
                return NotFound("Доставки не знайдені.");
            }

            return Ok(deliveries);
        }
    }
}
