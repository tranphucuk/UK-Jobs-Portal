using JobPortalv21.Models.Home;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Models.Job
{
    public class JobTagModel : HomeModel
    {
        public string Title { get; set; }

        public string Keyword { get; set; }

        public string Description { get; set; }

        public string TagId { get; set; }
    }
}
