using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels;
using JobPortal.Data.Enum;
using JobPortal.Utilities.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class JobController : BaseController
    {
        private readonly IJobService _jobService;
        private readonly IHostingEnvironment _hostingEnvironment;

        public JobController(IJobService jobService, IHostingEnvironment hostingEnvironment)
        {
            this._jobService = jobService;
            this._hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var JobViewModels = _jobService.GetAll();
            return new OkObjectResult(JobViewModels);
        }

        [HttpGet]
        public IActionResult GetAllPaging(int? tier, int page, int pageSize, string keyword)
        {
            var jobVms = _jobService.GetAllPaging(tier, page, pageSize, keyword);
            return new OkObjectResult(jobVms);
        }

        [HttpPost]
        public IActionResult ImportJob(List<IFormFile> files)
        {
            var fileJob = files[0];
            var filePath = $@"{_hostingEnvironment.WebRootPath}\upload\{fileJob.FileName}";

            using (var fs = System.IO.File.Create(filePath))
            {
                fileJob.CopyTo(fs);
                fs.Flush();
            }
            _jobService.ImportJobs(filePath);
            _jobService.Save();

            return new OkResult();
        }

        [HttpGet]
        public IActionResult ParseEnum()
        {
            var arr = Enum.GetNames(typeof(Tier));
            var listValueEnum = EnumExtension.GetValueAndIndex(arr);

            return new OkObjectResult(listValueEnum);
        }

        [HttpGet]
        public IActionResult GetTags()
        {
            var tagVms = _jobService.GetTags();
            var listTagIds = tagVms.Select(x => x.Id);
            return new OkObjectResult(listTagIds);
        }

        [HttpPost]
        public IActionResult SaveJob(JobViewModel jobViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new BadRequestObjectResult(ModelState);
            }

            if (jobViewModel.Id != 0)
            {
                _jobService.Update(jobViewModel);
            }
            else
            {
                _jobService.Add(jobViewModel);
            }

            _jobService.Save();
            return new OkResult();
        }

        [HttpGet]
        public IActionResult GetJobDetail(int id)
        {
            var jobViewModel = _jobService.GetJobDetail(id);
            return new OkObjectResult(jobViewModel);
        }

        [HttpPost]
        public IActionResult DeleteJob(int id)
        {
            _jobService.DeleteJob(id);
            _jobService.Save();
            return new OkResult();
        }
    }
}