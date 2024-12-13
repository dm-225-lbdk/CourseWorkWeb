using System.ComponentModel.DataAnnotations;

namespace CourseWorkWeb.Server.Model
{
    public class Order
    {
        [Key]
        public Guid OrderID { get; set; }

        [Required]
        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime DeliveryTime { get; set; } = DateTime.UtcNow.AddDays(7);

        [Required]
        public Guid UserID { get; set; }
        public List<Guid> ComputersID { get; set; } = [];

        [Required]
        public Guid DeliveryID { get; set; }
    }

}