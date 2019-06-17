using JobPortal.Application.ViewModels.Wishlist;
using JobPortal.Utilities.Dtos;
using JobPortalv21.Models.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Models.Wishlist
{
    public class WishlistModel : Dashboard
    {
        public PaginationResult<WishlistViewModel> Wishlist { get; set; }
    }
}
