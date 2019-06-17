using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels;
using JobPortal.Data.Entities;
using JobPortal.Data.Enum;
using JobPortal.Utilities.Constants;
using JobPortal.Utilities.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace JobPortalv21.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class LoginController : Controller
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger<LoginController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserService _userService;

        public LoginController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ILogger<LoginController> logger, IUserService userService)
        {
            this._signInManager = signInManager;
            this._logger = logger;
            this._userService = userService;
            this._userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Signin(LoginViewModel Model)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(new GenericResult(false, ModelState));
            }

            var userInfo = await _userManager.FindByNameAsync(Model.Username);
            if (userInfo == null)
            {
                return new OkObjectResult(new GenericResult(false, "Login failed. Please try again"));
            }
            var userRole = await _userManager.GetRolesAsync(userInfo);
            if (userInfo == null
                || userInfo.Status == Status.Inactive
                || (!userRole.Contains(CommonConstants.AppRole.StaffRole)
                && !userRole.Contains(CommonConstants.AppRole.AdminRole)))
            {
                return new OkObjectResult(new GenericResult(false, "Login failed. Please try again"));
            }

            var result = await _signInManager.PasswordSignInAsync(Model.Username, Model.Password, Model.Rememberme, lockoutOnFailure: true);
            if (result.Succeeded)
            {
                _logger.LogInformation("User logged in");
                return new OkObjectResult(new GenericResult(true, "User logged in"));
            }
            if (result.IsLockedOut)
            {
                _logger.LogWarning("User account locked out.");
                return new OkObjectResult(new GenericResult(false, "Your account has been blocked."));
            }
            else
            {
                return new OkObjectResult(new GenericResult(false, "Wrong username or password."));
            }
            //return new OkResult();
        }
    }
}