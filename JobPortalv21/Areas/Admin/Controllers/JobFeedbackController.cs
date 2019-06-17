using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.Job;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class JobFeedbackController : BaseController
    {
        private readonly IJobService _jobService;

        public JobFeedbackController(IJobService jobService)
        {
            this._jobService = jobService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetJobFeedbackPaging(int page, int pageSize, string keyword)
        {
            var jobReview = _jobService.GetJobFeedbackPaging(page, pageSize, keyword);
            return new OkObjectResult(jobReview);
        }

        [HttpGet]
        public IActionResult GetReview(int reviewId)
        {
            var jobReview = _jobService.GetJobFeedbackById(reviewId);
            return new OkObjectResult(jobReview);
        }

        [HttpPost]
        public IActionResult UpdateReview(JobReviewViewModel jobReview)
        {
            if (!ModelState.IsValid)
            {
                return new OkObjectResult(false);
            }

            _jobService.UpdateJobReview(jobReview);
            _jobService.Save();

            return new OkObjectResult(true);
        }
    }
}