using CRMCore.Application.Interface.EmailVerification;
using CRMCore.EntityFrameWorkCore.Model.EmailVerification;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace CRMCore.Application.Repository.EmailVerification
{
    public class EmailRepository : IEmailRepository
    {
        private readonly MailSettings _mailSettings;

        public EmailRepository(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            //email.Subject = mailRequest.Subject;
            email.Subject = "Verify Email Address";
            var builder = new BodyBuilder();
            if (mailRequest.Attachments != null)
            {
                byte[] fileBytes;
                foreach (var file in mailRequest.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                    }
                }
            }

            //var request = _httpContextAccessor.HttpContext.Request;
            //var confirmationLink = $"{request.Scheme}://{request.Host}/api/account/confirmEmail?email={mailRequest.ToEmail}";

            //builder.HtmlBody = $@"<p>Please click the following link to verify your email:</p>
            //                  <p><a href=""{confirmationLink}"">{confirmationLink}</a></p>
            //                  <p>If you did not request this, please ignore this email.</p>";


            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }
    }
}
