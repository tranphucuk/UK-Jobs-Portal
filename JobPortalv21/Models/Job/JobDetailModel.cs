using JobPortal.Application.ViewModels;
using System.Collections.Generic;

namespace JobPortalv21.Models.Job
{
    public class JobDetailModel
    {
        public JobViewModel Job { get; set; }

        public List<TagViewModel> Tags { get; set; }

        public bool IsInWishlist { get; set; }
    }
}