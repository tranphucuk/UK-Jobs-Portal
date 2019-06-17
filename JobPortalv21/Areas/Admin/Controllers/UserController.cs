using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels;
using JobPortal.Data.Entities;
using JobPortalv21.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class UserController : BaseController
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserService _userService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public UserController(SignInManager<AppUser> signInManager, IAuthorizationService authorizationService,
            UserManager<AppUser> userManager, IUserService userService, IHostingEnvironment hostingEnvironment)
        {
            this._signInManager = signInManager;
            this._authorizationService = authorizationService;
            this._userManager = userManager;
            this._userService = userService;
            this._hostingEnvironment = hostingEnvironment;
        }

        public async Task<IActionResult> Index()
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, "USER", Operations.Read);
            if (!authorizationResult.Succeeded)
            {
                return new RedirectResult("/Admin/Error/Index");
            }
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(int page, int pageSize, string keyword)
        {
            var userVms = _userService.GetAllPaging(page, pageSize, keyword);
            return new OkObjectResult(userVms);
        }

        [HttpPost]
        public async Task<IActionResult> SaveUserAsync(AppUserViewModel appUserViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            if (Request.Form.Files.Count() > 0)
            {
                var file = Request.Form.Files[0];
                var imgPathPhysical = $@"{_hostingEnvironment.WebRootPath}\admin-side\images\user\{file.FileName}";
                using (var fs = System.IO.File.Create(imgPathPhysical))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
            }

            if (appUserViewModel.Id != new Guid())
            {
                var result = await _userService.UpdateUserAsync(appUserViewModel);
                return new OkObjectResult(result);
            }
            else
            {
                var result = await _userService.CreateUserAsync(appUserViewModel);
                return new OkObjectResult(result);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserDetailAsync(string id)
        {
            var userVm = await _userService.GetUserDetailAsync(new Guid(id));
            return new OkObjectResult(userVm);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            var result = await _userService.DeleteUserAsync(new Guid(id));
            return new OkObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> SignOut()
        {
            await _signInManager.SignOutAsync();
            foreach (var key in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(key);
            }
            return RedirectToAction("Index", "Login");
        }
    }
}