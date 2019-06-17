using JobPortal.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JobPortalv21.Claims
{
    public class CustomClaimFactory : UserClaimsPrincipalFactory<AppUser, AppRole>
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;

        public CustomClaimFactory(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager,
            IOptions<IdentityOptions> options) : base(userManager, roleManager, options)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
        }

        public async override Task<ClaimsPrincipal> CreateAsync(AppUser user)
        {
            var principal = await base.CreateAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            ((ClaimsIdentity)principal.Identity).AddClaims(new[] {
                new Claim("Email", user.Email),
                new Claim("Fullname", user.Fullname),
                new Claim("Avatar", user.Avatar ?? string.Empty),
                new Claim("Roles", string.Join(";",roles))
            });

            return principal;
        }
    }
}