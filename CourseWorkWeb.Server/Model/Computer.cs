using System.ComponentModel.DataAnnotations;

namespace CourseWorkWeb.Server.Model
{
    public class Computer
    {
        [Key]
        public Guid ID { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        public float Price { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
