using Microsoft.EntityFrameworkCore;

namespace CourseWorkWeb.Server.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User>? Users { get; set; }
        public DbSet<Computer>? Computers { get; set; }
        public DbSet<Delivery>? Deliveries { get; set; }
        public DbSet<Order>? Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
