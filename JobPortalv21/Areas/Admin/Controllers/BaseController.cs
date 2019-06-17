using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize]
    public class BaseController : Controller
    {
    }
}