using CRMCore.Application.Dto.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Tenants;

namespace CRMCore.Application.Interface.Tenants
{
    public interface ITenantRegisterRepository
    {
        Tenant RegisterTenant(TenantVerificationVM tenant);
        //Task<bool> VerifyEmailAsync(string verificationToken);
        Task<bool> VerifyEmailAsync(int TntId);
    }
}
