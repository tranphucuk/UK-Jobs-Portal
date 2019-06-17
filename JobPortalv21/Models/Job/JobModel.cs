using JobPortalv21.Models.Home;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Models.Job
{
    public class JobModel : HomeModel
    {
        public string Title { get; set; }

        public string Keyword { get; set; }

        public string Description { get; set; }

        public string Town { get; set; }
    }
}
