using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.Wishlist;
using JobPortal.Utilities.Dtos;
using JobPortalv21.Models.Wishlist;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace JobPortalv21.Controllers
{
    public class WishlistController : Controller
    {
        private readonly IWishlistService _wishlistService;
        private readonly IConfiguration _configuration;
        private readonly ITagService _tagService;
        private readonly IUserService _userService;
        private readonly IJobService _jobService;

        public WishlistController(IWishlistService wishlistService, IConfiguration configuration,
            ITagService tagService, IUserService userService, IJobService jobService)
        {
            this._wishlistService = wishlistService;
            this._configuration = configuration;
            this._tagService = tagService;
            this._userService = userService;
            this._jobService = jobService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [Route("/my-wishlist.html")]
        public async Task<IActionResult> Wishlist(int pageSize, int page = 1)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);

            pageSize = _configuration.GetValue<int>("PageSizeWishlist");
            var wishlist = new WishlistModel();
            wishlist.Wishlist = _wishlistService.GetAllPaging(user.Id.ToString(), pageSize, page);
            wishlist.Tags = _tagService.GetAllJobTag().OrderBy(x => Guid.NewGuid()).Take(10).ToList();
            wishlist.User = user;

            return View(wishlist);
        }

        [HttpGet]
        [Route("/my-job/{jobId}.html")]
        public async Task<IActionResult> UserJob(int jobId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);

            var userJob = new UserJobModel();
            userJob.UserJobViewModel = _wishlistService.GetWishlistJobByJobId(jobId, user.Id.ToString());
            userJob.Tags = _tagService.GetAllJobTag().OrderBy(x => Guid.NewGuid()).Take(15).ToList();
            userJob.User = user;

            return View(userJob);
        }

        #region Ajax

        [HttpPost]
        public async Task<IActionResult> AddToWishlist(int jobId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }

            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);
            var job = _jobService.GetJobDetail(jobId);
            if (job != null)
            {
                var wishlistJob = new WishlistViewModel()
                {
                    AppUser = user,
                    JobId = jobId,
                    UserId = user.Id,
                    Job = job,
                };

                try
                {
                    _wishlistService.Add(wishlistJob);
                    _wishlistService.Save();
                    return new OkObjectResult(true);
                }
                catch (Exception)
                {
                    return new OkObjectResult(false);
                }
            }
            return new OkObjectResult(false);
        }

        [HttpPost]
        public async Task<IActionResult> RemoveJob(int jobId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }

            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);

            var isRemoved = _wishlistService.Remove(jobId, user.Id.ToString());
            if (isRemoved == false)
            {
                return new OkObjectResult(false);
            }
            _wishlistService.Save();
            return new OkObjectResult(true);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SaveNote(UserJobViewModel jobVm)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }

            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);
            jobVm.UserId = user.Id;

            if (!ModelState.IsValid)
            {
                return new OkObjectResult(new GenericResult(false, "**Content is maximum length of 2000 characters"));
            }

            var isSuccess = _wishlistService.SaveNote(jobVm);
            if (isSuccess)
            {
                _wishlistService.Save();
                return new OkObjectResult(new GenericResult(true));
            }
            return new OkObjectResult(new GenericResult(false, "**Content is maximum length of 2000 characters"));
        }
        #endregion
    }
}