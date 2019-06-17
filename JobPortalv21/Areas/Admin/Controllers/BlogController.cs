using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.Blog;
using JobPortal.Utilities.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class BlogController : BaseController
    {
        private readonly IBlogService _blogService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public BlogController(IBlogService blogService, IHostingEnvironment hostingEnvironment)
        {
            this._blogService = blogService;
            this._hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(int sortType, string keyword, int pageSize, int page = 1)
        {
            var blogVms = _blogService.GetAllPaging(sortType, keyword, pageSize, page);
            return new OkObjectResult(blogVms);
        }

        [HttpPost]
        public async Task<IActionResult> SaveBlog(BlogViewModel blogViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            if (Request.Form.Files != null && Request.Form.Files.Count > 0)
            {
                var file = Request.Form.Files[0];
                var imagePhysicalPath = $@"{_hostingEnvironment.WebRootPath}\client-side\images\blog\{file.FileName}";

                using (FileStream fs = System.IO.File.Create(imagePhysicalPath))
                {
                    await file.CopyToAsync(fs);
                    await fs.FlushAsync();
                }
            }

            blogViewModel.SeoAlias = TextHelper.ToUnsignString(blogViewModel.Name);
            blogViewModel.SeoDescription = blogViewModel.Description;
            blogViewModel.SeoKeyword = $"Blog: {blogViewModel.Name} - {DateTime.Now}";
            blogViewModel.SeoPageTitle = $"Blog: {blogViewModel.Name}";

            if (blogViewModel.Id != 0)
            {
                _blogService.Update(blogViewModel);
            }
            else
            {
                _blogService.Add(blogViewModel);
            }

            _blogService.Save();
            return new OkResult();
        }

        [HttpGet]
        public IActionResult GetBlogDetails(int blogId)
        {
            var blogVm = _blogService.GetBlogById(blogId);
            if (blogVm != null)
            {
                return new OkObjectResult(blogVm);
            }
            return new BadRequestResult();
        }

        [HttpPost]
        public IActionResult RemoveBlog(int blogId)
        {
            _blogService.Delete(blogId);
            _blogService.Save();
            return new OkResult();
        }
    }
}