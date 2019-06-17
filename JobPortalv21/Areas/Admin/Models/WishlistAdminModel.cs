using JobPortal.Application.ViewModels;
using JobPortal.Application.ViewModels.Wishlist;

namespace JobPortalv21.Areas.Admin.Models
{
    public class WishlistAdminModel
    {
        public AppUserViewModel User { get; set; }

        public WishlistViewModel Job { get; set; }
    }
}