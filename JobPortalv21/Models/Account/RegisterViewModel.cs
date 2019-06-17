using JobPortal.Data.Enum;
using JobPortal.Data.Interfaces;
using System;
using System.ComponentModel.DataAnnotations;

namespace JobPortalv21.Models.Account
{
    public class RegisterViewModel : IDateTracking, ISwitchable
    {
        [Required]
        [EmailAddress]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(maximumLength: 30, ErrorMessage = "Fullname is max 20 characters long.")]
        [Display(Name = "Fullname")]
        public string FullName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public Status Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}