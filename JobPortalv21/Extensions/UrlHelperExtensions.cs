using JobPortalv21.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;

namespace JobPortalv21.Extensions
{
    public static class UrlHelperExtensions
    {
        public static string EmailConfirmationLink(this IUrlHelper urlHelper, Guid userId, string code, string scheme)
        {
            return urlHelper.Action(
                action: nameof(AccountController.ConfirmEmail),
                controller: "Account",
                values: new { userId, code },
                protocol: scheme);
        }

        public static string ResetPasswordCallbackLink(this IUrlHelper urlHelper, Guid userId, string code, string scheme)
        {
            return urlHelper.Action(
                action: nameof(AccountController.ResetPassword),
                controller: "Account",
                values: new { userId, code },
                protocol: scheme);
        }

        public static string RequestRelativePath(ControllerBase controllerBase, string absolutePath)
        {
            var redundantPath = $"{controllerBase.Request.Scheme}://{controllerBase.Request.Host}/";
            var returnPath = absolutePath.Substring(redundantPath.Length);
            return returnPath;
        }
    }
}