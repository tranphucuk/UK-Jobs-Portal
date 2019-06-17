using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels;
using JobPortal.Utilities.Constants;
using JobPortalv21.Extensions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalv21.Areas.Admin.Components
{
    public class SideBarViewComponent : ViewComponent
    {
        private readonly IFunctionService _functionService;

        public SideBarViewComponent(IFunctionService functionService)
        {
            this._functionService = functionService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var roles = ((ClaimsPrincipal)User).GetClaim("Roles");

            if (roles.Split(";").Contains(CommonConstants.Admin))
            {
                var functionViewModel = await _functionService.GetAll();
                return View(functionViewModel);
            }
            else
            {
                //TODO: Get by permission
                var func = new List<FunctionViewModel>();
                return View(func);
            }
        }

    }
}
