using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels;
using JobPortal.Utilities.Dtos;
using JobPortalv21.Authorization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class RoleController : BaseController
    {
        private readonly IRoleService _roleService;
        private readonly IFunctionService _functionService;
        private readonly IPermissionService _permissionService;
        private readonly IAuthorizationService _authorizationService;

        public RoleController(IRoleService roleService, IFunctionService functionService,
            IPermissionService permissionService, IAuthorizationService authorizationService)
        {
            this._roleService = roleService;
            this._functionService = functionService;
            this._permissionService = permissionService;
            this._authorizationService = authorizationService;
        }

        public async Task<IActionResult> Index()
        {
            var isSuccess = await _authorizationService.AuthorizeAsync(User, "ROLE", Operations.Read);
            if (!isSuccess.Succeeded)
            {
                return new RedirectResult("/Admin/Error/Index");
            }
            return View();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var roleVm = _roleService.GetAll();
            return new OkObjectResult(roleVm);
        }

        [HttpGet]
        public async Task<IActionResult> GetRoleDetail(Guid id)
        {
            var roleVm = await _roleService.GetRoleDetail(id);
            return new OkObjectResult(roleVm);
        }

        [HttpPost]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var result = await _roleService.Delete(id);
            return new OkObjectResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> SaveRole(AppRoleViewModel appRoleViewModel)
        {
            GenericResult roleVm;
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            if (appRoleViewModel.Id == Guid.Empty)
            {
                roleVm = await _roleService.Add(appRoleViewModel);
            }
            else
            {
                roleVm = await _roleService.Update(appRoleViewModel);
            }

            return new OkObjectResult(new GenericResult(roleVm));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFunction()
        {
            var functionVms = await _functionService.GetAll();

            var sortedFunctions = new List<FunctionViewModel>();
            foreach (var item in functionVms.Where(x => x.ParentId == null))
            {
                sortedFunctions.Add(item);
                sortedFunctions.AddRange(functionVms.Where(x => x.ParentId == item.Id).OrderBy(x => x.SortOrder));
            }

            return new OkObjectResult(sortedFunctions);
        }

        [HttpPost]
        public IActionResult SavePermission(List<PermissionViewModel> permissionViewModels, string roleId)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }
            _permissionService.SavePermission(permissionViewModels, new Guid(roleId));

            _permissionService.Save();
            return new OkResult();
        }

        [HttpGet]
        public IActionResult LoadPermissionByRoleId(string guidId)
        {
            var id = new Guid(guidId);
            var permissionVms = _permissionService.GetPermissionByRoleId(id);
            return new OkObjectResult(permissionVms);
        }
    }
}