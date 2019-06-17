using JobPortal.Application.ViewModels;
using JobPortal.Utilities.Dtos;

namespace JobPortalv21.Models.Job
{
    public class JobByCompanyModel
    {
        public string SearchKeyword { get; set; }

        public PaginationResult<JobViewModel> JobViewModels { get; set; }

        public string Title { get; set; }

        public string Keyword { get; set; }

        public string Description { get; set; }
    }
}