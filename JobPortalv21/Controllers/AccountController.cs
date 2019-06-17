using JobPortal.Application.Interfaces;
using JobPortal.Data.Entities;
using JobPortal.Data.Enum;
using JobPortal.Utilities.Constants;
using JobPortalv21.Extensions;
using JobPortalv21.Models.Account;
using JobPortalv21.Service;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalv21.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserService _userService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly IEmailSender _emailSender;

        public AccountController(UserManager<AppUser> userManager, IEmailSender emailSender, IUserService userService, SignInManager<AppUser> signInManager,
             ILogger<AccountController> logger)
        {
            this._userManager = userManager;
            this._userService = userService;
            this._signInManager = signInManager;
            this._logger = logger;
            this._emailSender = emailSender;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/register.html")]
        public IActionResult Register(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateRecaptcha]
        [ValidateAntiForgeryToken]
        [Route("register.html")]
        public async Task<IActionResult> Register(RegisterViewModel userInfo)
        {
            if (!ModelState.IsValid)
            {
                return View(userInfo);
            }
            var user = new AppUser()
            {
                UserName = userInfo.Email,
                Email = userInfo.Email,
                Fullname = userInfo.FullName,
                CreatedDate = DateTime.Now,
                Status = Status.Inactive
            };

            var result = await _userManager.CreateAsync(user, userInfo.Password);
            if (result.Succeeded)
            {
                var isSuccess = await _userManager.AddToRoleAsync(user, CommonConstants.AppRole.CustomerRole);
                if (!isSuccess.Succeeded)
                {
                    _logger.LogError("Add user to role 'Customer' error", new object[] { user.UserName, user.Id, user.Email, user.CreatedDate });
                }
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var callbackUrl = Url.EmailConfirmationLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailConfirmationAsync(user.Email, callbackUrl);
            }
            else
            {
                ModelState.AddModelError(result.Errors.First().Code, result.Errors.First().Description);
                return View();
            }
            return View("ConfirmEmail");
        }

        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return RedirectToAction(nameof(AccountController.Index), "Account");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{userId}'.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (!result.Succeeded)
            {
                return View("ErrorConfirmEmail");
            }

            // change user status to Active if email is confirmed
            var userInfo = await _userManager.FindByIdAsync(userId);
            if (userInfo != null)
            {
                userInfo.Status = Status.Active;
                var updateSuccess = await _userManager.UpdateAsync(userInfo);
                if (!updateSuccess.Succeeded)
                {
                    return View("ErrorConfirmEmail");
                }
            }
            return View("ConfirmedEmail");
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/login.html")]
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            if (returnUrl == null)
            {
                ViewData["ReturnUrl"] = Request.Headers["Referer"].ToString();
            }
            else
            {
                ViewData["ReturnUrl"] = returnUrl;
            }
            await AuthenticationHttpContextExtensions.SignOutAsync(HttpContext, IdentityConstants.ExternalScheme);
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [Route("/login.html")]
        public async Task<IActionResult> Login(LoginModel login, string returnUrl = null)
        {
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var userStatus = await _userManager.FindByNameAsync(login.Email);
                if (userStatus != null && userStatus.Status == Status.Inactive)
                {
                    ViewData["ReturnUrl"] = "/login.html";
                    ModelState.AddModelError(string.Empty, "Your account is not verified. Plese confirm your email.");
                    return View();
                }
                var result = await _signInManager.PasswordSignInAsync(login.Email, login.Password, isPersistent: true, lockoutOnFailure: true);
                if (result.Succeeded && userStatus.Status == Status.Active)
                {
                    if (returnUrl == null || returnUrl.Contains("login") || returnUrl.Contains("ResetPasswordConfirmation") || returnUrl.Contains("ConfirmEmail"))
                    {
                        return RedirectToAction(nameof(HomeController.Index), "Home");
                    }
                    // Convert returnUrl
                    if (!Url.IsLocalUrl(returnUrl))
                    {
                        var redundantPath = $"{Request.Scheme}://{Request.Host}";
                        var returnPath = returnUrl.Substring(redundantPath.Length);
                        returnUrl = returnPath;
                    }
                    return LocalRedirect(returnUrl);
                }

                if (result.IsLockedOut)
                {
                    var endTime = await _userManager.GetLockoutEndDateAsync(userStatus);
                    return View("LockoutAccount", endTime);
                }
                else
                {
                    ViewData["ReturnUrl"] = "/login.html";
                    if (userStatus != null)
                    {
                        ModelState.AddModelError(string.Empty, $"Invalid login credentials. Attempts remain: {5 - userStatus.AccessFailedCount}");
                        return View();
                    }
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    return View();
                }
            }
            // If we got this far, something failed, redisplay form
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout(string returnUrl = null)
        {
            await _signInManager.SignOutAsync();
            var cookies = HttpContext.Request.Cookies;
            if (cookies.Count() > 0)
            {
                foreach (var cookie in cookies)
                {
                    Response.Cookies.Delete(cookie.Key);
                }
            }
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public IActionResult ExternalLogin(string provider)
        {
            // Request a redirect to the external login provider.
            var redirectUrl = Url.Action(nameof(ExternalLoginCallback), "Account");
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return Challenge(properties, provider);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ExternalLoginCallback(string remoteError = null)
        {
            if (remoteError != null)
            {
                return RedirectToAction(nameof(Login));
            }

            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return RedirectToAction(nameof(Login));
            }
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var name = info.Principal.FindFirstValue(ClaimTypes.Name);

            var isUserExisted = await _userManager.FindByEmailAsync(email);
            if (isUserExisted != null && isUserExisted.Status == Status.Active)
            {
                await _signInManager.SignInAsync(isUserExisted, null);
                return RedirectToAction("Index", "Home");
            }

            // Sign in the user with this external login provider if the user already has a login.
            var isSignedSuccess = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
            if (isSignedSuccess.Succeeded)
            {
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
            if (isSignedSuccess.IsLockedOut)
            {
                var userLocked = await _userManager.FindByEmailAsync(email);
                var endTime = await _userManager.GetLockoutEndDateAsync(userLocked);
                return View("LockoutAccount", endTime);
            }

            // create new user if not exist
            var user = new AppUser
            {
                UserName = email,
                Email = email,
                Fullname = name,
                Status = Status.Active,
                CreatedDate = DateTime.Now,
            };
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                result = await _userManager.AddLoginAsync(user, info);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction(nameof(HomeController.Index), "Home");
                }
            }
            else
            {
                foreach (var item in result.Errors)
                {
                    ModelState.AddModelError(item.Code, item.Description);
                }
            }
            return RedirectToAction(nameof(AccountController.Login));
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("forgot-password.html", Name = "Forgot Password")]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateRecaptcha]
        [ValidateAntiForgeryToken]
        [Route("forgot-password.html", Name = "Forgot Password")]
        public async Task<IActionResult> ForgotPassword(EmailViewModel emailAddress)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(emailAddress.Email);
                if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                {
                    // Don't reveal that the user does not exist or is not confirmed
                    ModelState.AddModelError(string.Empty, "Email is not existed");
                    return View();
                }

                // For more information on how to enable account confirmation and password reset please
                // visit https://go.microsoft.com/fwlink/?LinkID=532713
                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = Url.ResetPasswordCallbackLink(user.Id, code, Request.Scheme);
                await _emailSender.SendEmailResetPasswordAsync(emailAddress.Email, callbackUrl);

                return View("ResetPasswordEmail");
            }
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("reset-password.html", Name = "Reset Password")]
        public IActionResult ResetPassword(string code = null)
        {
            if (code == null)
            {
                return View("UserNotFound");
            }
            else
            {
                var ResetPassword = new ResetPasswordModel
                {
                    Code = code
                };
                return View(ResetPassword);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateRecaptcha]
        [ValidateAntiForgeryToken]
        [Route("reset-password.html", Name = "Reset Password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel resetPassword, string userId = null)
        {
            if (!ModelState.IsValid)
            {
                return View(resetPassword);
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToAction(nameof(ResetPasswordConfirmation));
            }

            var result = await _userManager.ResetPasswordAsync(user, resetPassword.Code, resetPassword.Password);
            if (result.Succeeded)
            {
                return RedirectToAction(nameof(ResetPasswordConfirmation));
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPasswordConfirmation()
        {
            return View("ResetPasswordConfirmed");
        }
    }
}