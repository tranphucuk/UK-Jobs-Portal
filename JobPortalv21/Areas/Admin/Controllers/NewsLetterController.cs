using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.Newsletter;
using JobPortal.Utilities.Constants;
using JobPortalv21.Service;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class NewsLetterController : BaseController
    {
        private readonly INewsletterService _newsLetterService;
        private readonly IEmailSender _emailSender;

        public NewsLetterController(INewsletterService newsLetterService, IEmailSender emailSender)
        {
            this._newsLetterService = newsLetterService;
            this._emailSender = emailSender;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int page, int pageSize)
        {
            var newsletter = _newsLetterService.GetAllPaging(keyword, page, pageSize);
            return new OkObjectResult(newsletter);
        }

        [HttpGet]
        public IActionResult GetDetail(int id)
        {
            var newsletter = _newsLetterService.GetDetailById(id);
            return new OkObjectResult(newsletter);
        }

        [HttpPost]
        public IActionResult SaveNewsLetter(NewsLetterViewModel newsLetterVm)
        {
            if (!ModelState.IsValid)
            {
                return new OkObjectResult(false);
            }

            if (newsLetterVm.Id != 0)
            {
                _newsLetterService.UpdateNewsLetter(newsLetterVm);
            }
            else
            {
                _newsLetterService.AddNewsLetter(newsLetterVm);
            }

            _newsLetterService.Save();
            return new OkObjectResult(true);
        }

        [HttpPost]
        public async Task<IActionResult> SendNews(int newsId)
        {
            var isAlreadySent = _newsLetterService.isSentToUsers(newsId);
            if (isAlreadySent == true)
            {
                return new OkObjectResult(false);
            }

            var emailList = _newsLetterService.GetAllEmail();

            var newsletter = _newsLetterService.GetDetailById(newsId);

            var emails = string.Empty;
            foreach (var email in emailList)
            {
                emails += $"{email.Email},";
            }

            try
            {
                await _emailSender.SendEmailAsync(CommonConstants.MailAdmin, $"Newsletter: {newsletter.Title}", newsletter.Content);
                await _emailSender.SendEmailAsync(emails, $"Newsletter: {newsletter.Title}", newsletter.Content);

            }
            catch (System.Exception ex)
            {
                return new OkObjectResult(false);
            }

            _newsLetterService.UpdateStatusSent(newsId, emailList.Count);
            _newsLetterService.Save();
            return new OkObjectResult(true);
        }
    }
}