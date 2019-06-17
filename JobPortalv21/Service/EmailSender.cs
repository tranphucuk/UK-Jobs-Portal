using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace JobPortalv21.Service
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration)
        {
            this._configuration = configuration;
        }

        public Task SendEmailAsync(string email, string subject, string message)
        {
            SmtpClient client = new SmtpClient(_configuration["MailSettings:Server"])
            {
                UseDefaultCredentials = false,
                Port = int.Parse(_configuration["MailSettings:Port"]),
                EnableSsl = bool.Parse(_configuration["MailSettings:EnableSsl"]),
                Credentials = new NetworkCredential(_configuration["MailSettings:UserName"],
                                                    _configuration["MailSettings:Password"])
            };

            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["MailSettings:FromEmail"], _configuration["MailSettings:FromName"])
            };

            var listMailAddress = email.Split(',');
            foreach (var item in listMailAddress)
            {
                if (string.IsNullOrEmpty(item)) continue;
                mailMessage.To.Add(new MailAddress(item));
            }

            // mailMessage.To.Add(email);
            mailMessage.Body = message;
            mailMessage.Subject = subject;
            mailMessage.IsBodyHtml = true;
            client.Send(mailMessage);

            return Task.CompletedTask;
        }
    }
}
