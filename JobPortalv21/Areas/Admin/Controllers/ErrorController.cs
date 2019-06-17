using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class ErrorController : BaseController
    {
        private readonly ILogger<ErrorController> _logger;
        public ErrorController(ILogger<ErrorController> logger)
        {
            this._logger = logger;
        }
        public IActionResult Index()
        {
            //if (statusCode == 404)
            //{
            //    var statusFeature = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            //    if (statusFeature != null)
            //    {
            //        _logger.LogWarning("handled 404 for url: {OriginalPath}", statusFeature.OriginalPath);
            //    }

            //}
            return View();
        }
    }
}