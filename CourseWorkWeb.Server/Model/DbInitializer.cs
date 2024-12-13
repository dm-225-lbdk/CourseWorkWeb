
namespace CourseWorkWeb.Server.Model
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider, AppDbContext context)
        {
            if (context.Users.Any() || 
                context.Computers.Any() || 
                context.Deliveries.Any() || 
                context.Orders.Any())
            {
                return;
            }

            var users = new List<User>
            {
                new() {
                    Username = "john_doe",
                    Email = "john@example.com",
                    Password = "password1",
                    Wallet = 120000.00f,
                    Address = "123 Main St",
                    Roles = ["Customer", "Admin"]
                },
                new() {
                    Username = "jane_doe",
                    Email = "jane@example.com",
                    Password = "password2",
                    Wallet = 290000.00f,
                    Address = "456 Oak St",
                    Roles = ["Customer", "Deliverer"]
                }
            };
            context.Users.AddRange(users);
            context.SaveChanges();

            var computers = new List<Computer>
            {
                new() { 
                    Name = "Dell XPS 13", 
                    Price = 1200.00f, 
                    Description = "Потужний ноутбук.", 
                    Quantity = 100 },
                new() { 
                    Name = "MacBook Pro", 
                    Price = 1500.00f, Description = "Ноутбук Apple з ретиновим дисплеєм.", 
                    Quantity = 45 },
                new() { Name = "HP Spectre x360", 
                    Price = 1400.00f, 
                    Description = "Конвертований ультрабук з сенсорним екраном.", 
                    Quantity = 70 }
            };
            context.Computers.AddRange(computers);
            context.SaveChanges();

            var deliveries = new List<Delivery>
            {
                new() { 
                    Name = "Швидкий кур'єр", 
                    Address = "789 Pine St", 
                    PhoneNumber = "123456789" 
                },
                new() { 
                    Name = "Стандартна доставка", 
                    Address = "101 Maple St", 
                    PhoneNumber = "987654321" }
            };
            context.Deliveries.AddRange(deliveries);
            context.SaveChanges();

            var orders = new List<Order>
            {
                new() {
                    UserID = users[0].ID,
                    DeliveryID = deliveries[0].ID,
                    StartDate = DateTime.UtcNow,
                    DeliveryTime = DateTime.UtcNow.AddDays(3),
                    ComputersID = [computers[0].ID, computers[1].ID]
                },
                new() {
                    UserID = users[1].ID,
                    DeliveryID = deliveries[1].ID,
                    StartDate = DateTime.UtcNow,
                    DeliveryTime = DateTime.UtcNow.AddDays(5),
                    ComputersID = [computers[2].ID]
                }
            };
            context.Orders.AddRange(orders);
            context.SaveChanges();
        }
    }
}
