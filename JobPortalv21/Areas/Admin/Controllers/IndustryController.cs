using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class IndustryController : BaseController
    {
        private readonly IVisitorReportService _visitorReportService;

        public IndustryController(IVisitorReportService visitorReportService)
        {
            this._visitorReportService = visitorReportService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(int sortType, string keyword, int pageSize, int page)
        {
            var visitorReport = _visitorReportService.GetAllJobVisitorPaging(sortType, keyword, pageSize, page);
            return new OkObjectResult(visitorReport);
        }
    }
}