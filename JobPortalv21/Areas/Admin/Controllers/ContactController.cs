using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPortal.Application.Interfaces;
using JobPortal.Application.ViewModels.ContactUs;
using Microsoft.AspNetCore.Mvc;

namespace JobPortalv21.Areas.Admin.Controllers
{
    public class ContactController : BaseController
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            this._contactService = contactService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult GetAllPaging(string keyword, int pageSize, int page = 1)
        {
            var contactVms = _contactService.GetAllPaging(keyword, pageSize, page);
            return new OkObjectResult(contactVms);
        }

        [HttpGet]
        public IActionResult GetContactDetails(int contactId)
        {
            var contact = _contactService.GetContactById(contactId);
            return new OkObjectResult(contact);
        }

        [HttpPost]
        public IActionResult SaveContact(ContactViewModel contactVm)
        {
            _contactService.UpdateContact(contactVm);
            _contactService.Save();
            return new OkResult();
        }

        [HttpPost]
        public IActionResult Delete(int contactId)
        {
            _contactService.Remove(contactId);
            _contactService.Save();
            return new OkResult();
        }
    }
}