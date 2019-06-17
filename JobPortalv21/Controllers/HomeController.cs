using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.EmailSubscriber;
using JobPortalv21.Models;
using JobPortalv21.Models.Home;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static JobPortal.Utilities.Constants.CommonConstants;

namespace JobPortalv21.Controllers
{
    public class HomeController : Controller
    {
        private readonly IJobService _jobService;
        private readonly IIndustryService _industryService;
        private readonly IConfiguration _configuration;
        private readonly IWishlistService _wishlistService;
        private readonly IUserService _userService;
        private readonly IEmailSubscriberService _emailSubscriberService;

        public HomeController(IJobService jobService, IIndustryService industryService,
            IConfiguration configuration, IWishlistService wishlistService, IUserService userService,
            IEmailSubscriberService emailSubscriberService)
        {
            this._jobService = jobService;
            this._industryService = industryService;
            this._configuration = configuration;
            this._wishlistService = wishlistService;
            this._userService = userService;
            this._emailSubscriberService = emailSubscriberService;
        }

        public async Task<IActionResult> Index(string town, string industry, string tier, int? pageSize, int page = 1)
        {
            var home = new HomeModel();
            if (User.Identity.IsAuthenticated)
            {
                var name = User.Identity.Name;
                var user = await _userService.GetUserByName(name);
                home.wishlistViewModels = _wishlistService.GetAll(user.Id.ToString());
            }

            if (pageSize == null)
            {
                pageSize = _configuration.GetValue<int>("PageSizeJob");
            }

            ViewData["Keyword"] = HomeSeo.Keyword + $" {page}";
            ViewData["Description"] = HomeSeo.Description;
            home.JobViewModels = _jobService.GetAllPagingClient(town, industry, tier, pageSize.Value, page);
            return View(home);
        }

        #region Ajax

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult SubscribeEmail(EmailSubscriberViewModel emailSub)
        {
            if (!ModelState.IsValid)
            {
                return new OkObjectResult(false);
            }
            try
            {
                _emailSubscriberService.Add(emailSub);
                _emailSubscriberService.Save();
                Thread.Sleep(1000);
                return new OkObjectResult(true);
            }
            catch (Exception)
            {
                return new OkObjectResult(false);
                throw;
            }
        }

        #endregion Ajax

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}