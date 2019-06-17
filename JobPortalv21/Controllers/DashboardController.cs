using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Data.Entities;
using JobPortalv21.Models.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace JobPortalv21.Controllers
{
    public class DashboardController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserService _userService;
        private readonly ITagService _tagService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailSubscriberService _emailSubscriberService;

        private IMemoryCache _cache;

        public DashboardController(UserManager<AppUser> userManager, IUserService userService,
            ITagService tagService, SignInManager<AppUser> signInManager, IMemoryCache cache,
            IEmailSubscriberService emailSubscriberService)
        {
            this._userManager = userManager;
            this._userService = userService;
            this._tagService = tagService;
            this._signInManager = signInManager;
            this._emailSubscriberService = emailSubscriberService;
            this._cache = cache;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/account-dashboard.html")]
        public async Task<IActionResult> AccountDashboard()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Login", "Account");
            }
            var name = User.Identity.Name;
            var user = await _userService.GetUserByName(name);
            var dashBoard = new Dashboard();
            dashBoard.User = user;
            dashBoard.isSubscribed = _emailSubscriberService.isSubscribed(user.Email);
            var tags = _tagService.GetAllJobTag().OrderBy(x => Guid.NewGuid()).Take(11).ToList();
            dashBoard.Tags = tags;
            return View(dashBoard);
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        [Route("/account-dashboard.html")]
        public async Task<IActionResult> AccountDashboard(ChangePassword userInfo)
        {
            if (!ModelState.IsValid)
            {
                ModelState.AddModelError(string.Empty, string.Empty);
                return RedirectToAction(nameof(DashboardController.AccountDashboard));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return RedirectToAction(nameof(AccountController.Login));
            }

            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user != null)
            {
                var isExisted = await _signInManager.PasswordSignInAsync(user, userInfo.OldPassword, isPersistent: false, lockoutOnFailure: false);
                if (isExisted.Succeeded)
                {
                    user.Fullname = userInfo.FullName;
                    user.Address = userInfo.Address;
                    var IsUpdated = await _userManager.UpdateAsync(user);
                    if (!IsUpdated.Succeeded)
                    {
                        ModelState.AddModelError(string.Empty, string.Empty);
                        return View(userInfo);
                    }

                    if (!string.IsNullOrEmpty(userInfo.NewPassword))
                    {
                        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                        var result = await _userManager.ResetPasswordAsync(user, token, userInfo.NewPassword);
                        if (result.Succeeded)
                        {
                            userInfo.Tags = _tagService.GetAllJobTag().OrderBy(x => Guid.NewGuid()).Take(11).ToList();
                            return View("ChangePasswordSuccess", userInfo);
                        }
                        else
                        {
                            ModelState.AddModelError(string.Empty, string.Empty);
                            return View(userInfo);
                        }
                    }
                    return RedirectToAction(nameof(DashboardController.AccountDashboard));
                }
            }
            return RedirectToAction(nameof(AccountController.Login));
        }
    }
}