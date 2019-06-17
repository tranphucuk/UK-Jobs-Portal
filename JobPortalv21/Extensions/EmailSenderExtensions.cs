using JobPortalv21.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace JobPortalv21.Extensions
{
    public static class EmailSenderExtensions
    {
        public static Task SendEmailConfirmationAsync(this IEmailSender emailSender, string email, string link)
        {
            return emailSender.SendEmailAsync(email, "Confirm your email",
                $"Thank you for signing up at Jobportal. " +
                $"Please confirm your account: <a href='{HtmlEncoder.Default.Encode(link)}'>here</a><br /><br />" +
                $"Thank you!<br />" +
                $"Jobportal team");
        }

        public static Task SendEmailResetPasswordAsync(this IEmailSender emailSender, string email, string link)
        {
            return emailSender.SendEmailAsync(email, "Recovery Password",
                $"Hello,<br />" +
                $"A request to reset the password has been submitted. " +
                $"Please reset your password <a href='{HtmlEncoder.Default.Encode(link)}'>here</a>.<br /><br />" +
                $"Thank you!<br />" +
                $"Jobportal  team.");
        }
    }
}
