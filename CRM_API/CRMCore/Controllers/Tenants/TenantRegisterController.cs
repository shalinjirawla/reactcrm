using CRMCore.Application.Dto.Tenants;
using CRMCore.Application.Interface.Tenants;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CRMCore.Web.Controllers.Tenants
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantRegisterController : ControllerBase
    {
        private readonly ITenantRegisterRepository ITenantRegister;

        public TenantRegisterController(ITenantRegisterRepository tenantRegister)
        {
            ITenantRegister = tenantRegister;
        }

        [HttpPost]
        [Route("RegisterTenant")]
        public IActionResult Register(TenantVerificationVM tenant)
        {
            var register = ITenantRegister.RegisterTenant(tenant);
            return Ok(register);
        }

        [HttpPost("VerifyEmail")]
        public async Task<IActionResult> VerifyEmail(int id)
        {
            var isVerified = await ITenantRegister.VerifyEmailAsync(id);
            if (isVerified)
            {
                return Ok("Email verified successfully!");
            }
            else
            {
                return BadRequest("Invalid verify Tenant.");
            }
        }
    }
}
