using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Controllers
{
    public class OurTeamController : Controller
    {
        [Route("our-team.html")]
        public IActionResult Index()
        {
            return View();
        }
    }
}