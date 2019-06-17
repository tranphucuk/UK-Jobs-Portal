using JobPortal.Application.Interfaces;
using JobPortal.Utilities.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalv21.Authorization
{
    public class BaseAuthorizationCrudHandler : AuthorizationHandler<OperationAuthorizationRequirement, string>
    {
        private readonly IRoleService _roleService;
        private readonly IPermissionService _permissionService;
        public BaseAuthorizationCrudHandler(IRoleService roleService, IPermissionService permissionService)
        {
            this._roleService = roleService;
            this._permissionService = permissionService;
        }

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, string resource)
        {
            var roles = ((ClaimsIdentity)context.User.Identity).Claims.FirstOrDefault(x => x.Type == CommonConstants.UserClaims.Roles);
            if (roles != null)
            {
                var listRoles = roles.Value.Split(";");
                var hasPermission = await _permissionService.CheckPermission(resource, requirement.Name, listRoles);
                if (hasPermission || listRoles.Contains(CommonConstants.AppRole.AdminRole))
                {
                    context.Succeed(requirement);
                }
                else
                {
                    context.Fail();
                }
            }
            else
            {
                context.Fail();
            }
        }
    }
}
