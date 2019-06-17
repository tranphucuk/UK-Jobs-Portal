using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class CityController : BaseController
    {
        private readonly IVisitorReportService _visitorReportService;

        public CityController(IVisitorReportService visitorReportService)
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
            var visitorReport = _visitorReportService.GetAllCityVisitorPaging(sortType, keyword, pageSize, page);
            return new OkObjectResult(visitorReport);
        }
    }
}