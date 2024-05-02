using CRMCore.Application.Interface.EmailVerification;
using CRMCore.EntityFrameWorkCore.Model.EmailVerification;
using MailKit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMCore.Web.Controllers.EmailVerification
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailRepository ImailService;

        public EmailController(IEmailRepository mailService)
        {
            ImailService = mailService;
        }

        [HttpPost("Send")]
        public async Task<IActionResult> Send([FromForm] MailRequest request)
        {
            try
            {
                await ImailService.SendEmailAsync(request);
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
