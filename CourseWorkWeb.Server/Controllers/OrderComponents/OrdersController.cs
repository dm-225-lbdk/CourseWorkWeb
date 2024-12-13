using CourseWorkWeb.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseWorkWeb.Server.Controllers.OrderComponents
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            if (order.ComputersID == null || order.ComputersID.Count == 0)
            {
                return BadRequest("Необхідно вказати комп'ютери для замовлення.");
            }

            var user = await _context.Users.FindAsync(order.UserID);
            var delivery = await _context.Deliveries.FindAsync(order.DeliveryID);

            if (user == null)
            {
                return NotFound("Користувача з таким ID не знайдено.");
            }

            if (delivery == null)
            {
                return NotFound("Доставки з таким ID не знайдено.");
            }

            float totalCost = 0;

            var computersToUpdate = await _context.Computers
                .Where(c => order.ComputersID.Contains(c.ID))
                .ToListAsync();

            if (computersToUpdate.Count != order.ComputersID.Distinct().Count())
            {
                return BadRequest("Деякі комп'ютери не знайдені.");
            }

            var computersGrouped = order.ComputersID
                .GroupBy(id => id)
                .ToList();

            foreach (var group in computersGrouped)
            {
                var computer = computersToUpdate.FirstOrDefault(c => c.ID == group.Key);
                if (computer == null)
                {
                    return NotFound($"Комп'ютер з ID {group.Key} не знайдено.");
                }

                int quantityToOrder = group.Count();

                if (computer.Quantity < quantityToOrder)
                {
                    return BadRequest($"Немає в наявності достатньо комп'ютерів {computer.Name}. Тільки {computer.Quantity} одиниць доступно.");
                }

                computer.Quantity -= quantityToOrder;
                totalCost += computer.Price * quantityToOrder;
            }

            if (user.Wallet < totalCost)
            {
                return BadRequest("На рахунку користувача недостатньо коштів для оформлення замовлення.");
            }

            user.Wallet -= totalCost;

            _context.Orders.Add(order);

            _context.Computers.UpdateRange(computersToUpdate);
            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderID }, order);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(Guid id)
        {
            var order = await _context.Orders
                .Include(o => o.ComputersID)
                .FirstOrDefaultAsync(o => o.OrderID == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(Guid userId)
        {
            var orders = await _context.Orders
                .Where(order => order.UserID == userId)
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound("Замовлення не знайдені.");
            }

            var orderResponses = new List<object>();

            foreach (var order in orders)
            {
                var orderResponse = new
                {
                    order.OrderID,
                    order.StartDate,
                    order.DeliveryTime,
                    order.UserID,
                    order.DeliveryID,
                    order.ComputersID,
                };

                orderResponses.Add(orderResponse);
            }

            return Ok(orderResponses);
        }
    }
}
