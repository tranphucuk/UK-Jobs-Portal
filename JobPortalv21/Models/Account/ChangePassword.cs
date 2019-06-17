using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Models.Account
{
    public class ChangePassword : Dashboard
    {
        [Required]
        [StringLength(maximumLength: 30, ErrorMessage = "Fullname is max 20 characters long.")]
        [Display(Name = "Fullname")]
        public string FullName { get; set; }

        [MaxLength(250)]
        [Required]
        public string Address { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Old Password")]
        public string OldPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "New Password")]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
        public string NewPassword { get; set; }
    }
}
