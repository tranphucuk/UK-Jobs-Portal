using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.Job;
using JobPortal.Application.ViewModels.Report;
using JobPortal.Utilities.Constants;
using JobPortalv21.Models.Job;
using JobPortalv21.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace JobPortalv21.Controllers
{
    public class JobController : Controller
    {
        private readonly IJobService _jobService;
        private readonly IIndustryService _industryService;
        private readonly ITagService _tagService;
        private readonly IConfiguration _configuration;
        private readonly IWishlistService _wishlistService;
        private readonly IUserService _userService;
        private readonly IVisitorReportService _visitorReportService;
        private readonly IEmailSender _emailSender;

        public JobController(IJobService jobService, IIndustryService industryService,
            IConfiguration configuration, ITagService tagService, IWishlistService wishlistService,
            IUserService userService, IVisitorReportService visitorReportService, IEmailSender emailSender)
        {
            this._tagService = tagService;
            this._jobService = jobService;
            this._industryService = industryService;
            this._configuration = configuration;
            this._wishlistService = wishlistService;
            this._userService = userService;
            this._visitorReportService = visitorReportService;
            this._emailSender = emailSender;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Route("/search.html")]
        public async Task<IActionResult> Search(string town, string industry, string tier, int? pageSize, int page = 1)
        {
            if (page == 0) page = 1;

            var jobVm = new JobModel();
            if (User.Identity.IsAuthenticated)
            {
                var name = User.Identity.Name;
                var user = await _userService.GetUserByName(name);
                jobVm.wishlistViewModels = _wishlistService.GetAll(user.Id.ToString());
            }

            jobVm.Title = industry;
            jobVm.Keyword = industry + $" page {page}";
            jobVm.Description = industry + $": company, website, rating, review, social networks information....";
            jobVm.Town = town;
            if (pageSize == null)
            {
                pageSize = _configuration.GetValue<int>("PageSizeJob");
            }

            jobVm.JobViewModels = _jobService.GetAllPagingClient(town, industry, tier, pageSize.Value, page);

            if (industry != "Industry" && industry != null)
            {
                // Check today view existed
                var jobVisitorToday = _visitorReportService.GetJobViewByDateAndIndustry(industry, DateTime.Now.ToShortDateString());
                // Add - Update job View
                if (jobVisitorToday != null)
                {
                    _visitorReportService.UpdateJobView(jobVisitorToday);
                }
                else
                {
                    _visitorReportService.AddNewJobView(new JobVisitorReportViewModel()
                    {
                        DateView = DateTime.Now,
                        Industry = industry,
                        SearchCount = 1
                    });
                }
            }
            if (!string.IsNullOrEmpty(town) && jobVm.JobViewModels.Total > 0)
            {
                var cityVisitorToday = _visitorReportService.GetCityViewByDateAndCityName(town, DateTime.Now.ToShortDateString());

                // Add - Update city View
                if (cityVisitorToday != null)
                {
                    _visitorReportService.UpdateCityView(cityVisitorToday);
                }
                else
                {
                    _visitorReportService.AddNewCityView(new CityVisitorReportViewModel()
                    {
                        DateView = DateTime.Now,
                        City = town,
                        SearchCount = 1
                    });
                }
            }

            _visitorReportService.Save();
            return View(jobVm);
        }

        [Route("/{alias}-{id}.html")]
        public async Task<IActionResult> JobDetail(int id)
        {
            var job = _jobService.GetJobDetail(id);

            var jobDetail = new JobDetailModel();
            jobDetail.Job = job;

            var tags = _jobService.GetTags();
            jobDetail.Tags = tags.OrderBy(x => Guid.NewGuid()).Take(8).ToList();

            if (User.Identity.IsAuthenticated)
            {
                var name = User.Identity.Name;
                var user = await _userService.GetUserByName(name);
                jobDetail.IsInWishlist = _wishlistService.IsInWishlist(id, user.Id.ToString());
            }
            return View(jobDetail);
        }

        [Route("/tags/{tagId}.html")]
        public IActionResult GetJobByTag(string tagId, string tier, int? pageSize, int page = 1)
        {
            if (pageSize == null)
            {
                pageSize = _configuration.GetValue<int>("PageSizeJob");
            }
            var jobByTag = _jobService.GetJobByTag(tagId, tier, pageSize.Value, page);

            var jobTags = new JobTagModel();
            jobTags.JobViewModels = jobByTag;

            var industry = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(_tagService.GetTagById(tagId).Name.ToLower());
            var tagName = industry;
            jobTags.Title = "Jobs in " + tagName;
            jobTags.Description = "All sponsor companies, website, networks, rating information related to " + tagName;
            jobTags.Keyword = tagName;
            jobTags.TagId = tagId;

            return View(jobTags);
        }

        [HttpGet]
        [Route("/search-company.html")]
        public IActionResult SearchCompany(string company, int? pageSize, int page = 1)
        {
            if (pageSize == null)
            {
                pageSize = _configuration.GetValue<int>("PageSizeJob");
            }
            var jobsbByCompany = _jobService.GetJobByCompany(company, pageSize.Value, page);

            var jobs = new JobByCompanyModel();
            jobs.SearchKeyword = company;
            jobs.JobViewModels = jobsbByCompany;
            jobs.Keyword = company;
            jobs.Title = $"Search company: {company}";
            jobs.Description = $"All sponsor jobs by company name '{company}'";

            return View(jobs);
        }

        #region Ajax

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SendFeedback(int jobId, JobReviewViewModel jobReviewVm)
        {
            if (!ModelState.IsValid)
            {
                return new OkObjectResult(false);
            }

            _jobService.SendReview(jobId, jobReviewVm);
            _jobService.Save();

            await _emailSender.SendEmailAsync(CommonConstants.MailAdmin, $"Job-Feedback: {jobReviewVm.Name}", jobReviewVm.Review);
            return new OkObjectResult(true);
        }

        #endregion Ajax
    }
}