using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class HomeController : BaseController
    {
        public HomeController()
        {
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}