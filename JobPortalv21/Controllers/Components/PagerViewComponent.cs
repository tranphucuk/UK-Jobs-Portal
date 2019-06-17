using JobPortal.Utilities.Dtos;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace JobPortalv21.Controllers.Components
{
    public class PagerViewComponent : ViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(PageResultBase pageResultBase)
        {
            return Task.FromResult((IViewComponentResult)View("Default", pageResultBase));
        }
    }
}