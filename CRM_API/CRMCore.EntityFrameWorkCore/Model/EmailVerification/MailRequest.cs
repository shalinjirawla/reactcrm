using Microsoft.AspNetCore.Http;

namespace CRMCore.EntityFrameWorkCore.Model.EmailVerification
{
    public class MailRequest
    {
        public string ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}
