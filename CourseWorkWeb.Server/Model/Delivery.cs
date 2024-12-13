using System.ComponentModel.DataAnnotations;

namespace CourseWorkWeb.Server.Model
{
    public class Delivery
    {
        [Key]
        public Guid ID { get; set; }

        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Address { get; set; }
        [Required]
        public string? PhoneNumber { get; set; }
    }
}