using AutoMapper;
using CRMCore.Application.Dto.Tenants;
using CRMCore.Application.Interface.EmailVerification;
using CRMCore.Application.Interface.Tenants;
using CRMCore.EntityFrameWorkCore.Model.EmailVerification;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using CRMCore.Application.Interface.Generic;

namespace CRMCore.Application.Repository.Tenants
{
    public class TenantRegisterRepository : ITenantRegisterRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Tenant> IGeneric;
        private readonly IEmailRepository emailRepository;
        private readonly IHttpContextAccessor httpContextAccessor;

        public TenantRegisterRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Tenant> generic, IEmailRepository _emailRepository, IHttpContextAccessor _httpContextAccessor)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
            emailRepository = _emailRepository;
            httpContextAccessor = _httpContextAccessor;
        }

        public Tenant RegisterTenant(TenantVerificationVM tenant)
        {
            var map = mapper.Map<Tenant>(tenant);
            map.IsActive = true;
            map.IsEmailVerified = false;
            IGeneric.Create(map);

            var verificationToken = Guid.NewGuid().ToString();
            var request = httpContextAccessor.HttpContext.Request;
            var verificationLink = $"{request.Scheme}://{request.Host}/api/TenantRegister/VerifyEmail?id={map.Id}";

            SendVerificationEmailAsync(tenant, verificationLink);

            return map;
        }

        public async Task SendVerificationEmailAsync(TenantVerificationVM tenant, string verificationLink)
        {
            var mailRequest = new MailRequest
            {
                ToEmail = tenant.Email,
                Subject = "Verify Your Email",
                Body = $@"<h3>Hello {tenant.Name}</h3>
                        <p>Please click the following link to verify your email:</p>
                        <p><a href=""{verificationLink}"">{verificationLink}</a></p>"
            };
            await emailRepository.SendEmailAsync(mailRequest);
        }

        public async Task<bool> VerifyEmailAsync(int TntId)
        {
            var tenant = await db.Tenants.FirstOrDefaultAsync(t => t.Id == TntId);
            if (tenant != null)
            {
                tenant.IsEmailVerified = true;
                //tenant.VerificationToken = null;
                IGeneric.Update(tenant);
                return true;
            }
            return false;
        }
    }
}
