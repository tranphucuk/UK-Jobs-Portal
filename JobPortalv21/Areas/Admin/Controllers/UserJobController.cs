using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class UserJobController : BaseController
    {
        private readonly IWishlistService _wishlistService;

        public UserJobController(IWishlistService wishlistService)
        {
            this._wishlistService = wishlistService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int pageSize, int page = 1)
        {
            var wishlist = _wishlistService.GetAllPagingAdmin(keyword, pageSize, page);
            return new OkObjectResult(wishlist);
        }

        [HttpGet]
        public IActionResult GetWishlistDetail(string userId, int jobId)
        {
            var wishlistDetal = _wishlistService.GetWishlistJobByJobId(jobId, userId);
            return new OkObjectResult(wishlistDetal);
        }
    }
}