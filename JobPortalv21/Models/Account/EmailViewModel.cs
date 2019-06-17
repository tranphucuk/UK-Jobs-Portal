using System.ComponentModel.DataAnnotations;

namespace JobPortalv21.Models.Account
{
    public class EmailViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}