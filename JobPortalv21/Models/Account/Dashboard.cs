using JobPortal.Application.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static JobPortal.Utilities.Constants.CommonConstants;

namespace JobPortalv21.Models.Account
{
    public class Dashboard
    {
        public AppUserViewModel User { get; set; }

        public List<DashboardUrls> Urls { get; } = new List<DashboardUrls>
        {
            new DashboardUrls(){Value = "/account-dashboard.html", Name="Account Information"},
            new DashboardUrls(){Value = "/my-wishlist.html", Name="Wishlist"},
        };

        public List<TagViewModel> Tags { get; set; }

        public bool isSubscribed { get; set; }
    }
}
