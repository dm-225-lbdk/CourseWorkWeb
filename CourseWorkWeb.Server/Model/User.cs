using System.ComponentModel.DataAnnotations;

namespace CourseWorkWeb.Server.Model
{
    public class User
    {
        [Key]
        public Guid ID { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(20)]
        public string? Username { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(6)]
        public string? Password { get; set; }

        [Required]
        public string? Address { get; set; }

        [Required]
        public float? Wallet {  get; set; }

        public List<string> Roles { get; set; } = ["Customer"];
    }

    
}
