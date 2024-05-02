using CRMCore.EntityFrameWorkCore.Model.EmailVerification;

namespace CRMCore.Application.Interface.EmailVerification
{
    public interface IEmailRepository
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}
