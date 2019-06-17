using JobPortal.Application.ViewModels;
using JobPortal.Application.ViewModels.Wishlist;
using JobPortal.Utilities.Dtos;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Models.Home
{
    public class HomeModel
    {
        public PaginationResult<JobViewModel> JobViewModels { get; set; }

        public string Industry { get; set; }
        public List<SelectListItem> Industries { get; } = new List<SelectListItem>
        {
            new SelectListItem(){Value = "Industry", Text="Industry"},
            new SelectListItem(){Value = "Administrative and Support", Text="Administrative and Support"},
            new SelectListItem(){Value = "Transportation,Storage", Text="Transportation & Storage"},
            new SelectListItem(){Value = "Social Work", Text="Social Work"},
            new SelectListItem(){Value = "Real Estate", Text="Real Estate"},
            new SelectListItem(){Value = "Public Administration,Government", Text="Public Administration,Government"},
            new SelectListItem(){Value = "Others", Text="Others"},
            new SelectListItem(){Value = "Mining and Quarrying", Text="Mining and Quarrying"},
            new SelectListItem(){Value = "Manufacturing", Text="Manufacturing"},
            new SelectListItem(){Value = "Management", Text="Management"},
            new SelectListItem(){Value = "IT,Telecommunication", Text="IT & Telecommunication"},
            new SelectListItem(){Value = "Houselhold", Text="Houselhold"},
            new SelectListItem(){Value = "Food,Accomodation", Text="Food & Accomodation"},
            new SelectListItem(){Value = "Finance,Insurance", Text="Finance,Insurance"},
            new SelectListItem(){Value = "Electricity,Gas,Steam,Air", Text="Electricity,Gas,Steam,Air"},
            new SelectListItem(){Value = "Education", Text="Education"},
            new SelectListItem(){Value = "Construction", Text="Construction"},
            new SelectListItem(){Value = "Arts,Entertainment", Text="Arts & Entertainment"},
            new SelectListItem(){Value = "Agriculture", Text="Agriculture"},
            new SelectListItem(){Value = "Water,Waste Management", Text="Water and Waste Management"},
            new SelectListItem(){Value = "Wholesale,Retail", Text="Wholesale & Retail"},
        };

        public string Tier { get; set; }
        public List<SelectListItem> Tiers { get; } = new List<SelectListItem>
        {
            new SelectListItem(){Value = "Tier", Text="Tier"},
            new SelectListItem(){Value = "Tier2", Text="Tier 2"},
            new SelectListItem(){Value = "Tier5TW", Text="Tier 5(TW)"},
            new SelectListItem(){Value = "Both", Text="Both"},
        };

        public List<WishlistViewModel> wishlistViewModels { get; set; }
    }
}
