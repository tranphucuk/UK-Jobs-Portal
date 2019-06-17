using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.ContactUs;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Controllers
{
    public class ContactUsController : Controller
    {
        private readonly IContactService _contactService;
        public ContactUsController(IContactService contactService)
        {
            this._contactService = contactService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("/contact-us.html")]
        public IActionResult EmailUs()
        {
            return View();
        }

        [HttpPost]
        [Route("/contact-us.html")]
        public IActionResult EmailUs(ContactViewModel contact)
        {
            if (!ModelState.IsValid)
            {
                return View();
            }
            _contactService.Add(contact);
            _contactService.Save();

            return RedirectToAction(nameof(ContactUsController.EmailSent), new { id = DateTime.Now.Ticks });
        }

        [HttpGet]
        [Route("/email-sent-{id}.html")]
        public IActionResult EmailSent()
        {
            return View();
        }
    }
}