using AutoMapper;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.Leads;
using CRMCore.Application.Dto.Login;
using CRMCore.Application.Dto.Opportunities;
using CRMCore.Application.Dto.Tasks;
using CRMCore.Application.Dto.Tenants;
using CRMCore.Application.Dto.Users;
using CRMCore.EntityFrameWorkCore.Model.Accounts;
using CRMCore.EntityFrameWorkCore.Model.Contacts;
using CRMCore.EntityFrameWorkCore.Model.Leads;
using CRMCore.EntityFrameWorkCore.Model.Opportunities;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using Task = CRMCore.EntityFrameWorkCore.Model.Tasks.Task;

namespace CRMCore.Application.Dto
{
    public class CRMCoreCustomMapper : Profile
    {
        public CRMCoreCustomMapper()
        {
            CreateMap<User, UserVM>().ReverseMap();
            CreateMap<User, UserVM>().ReverseMap();
            CreateMap<UserRole, UserRoleVM>().ReverseMap();
            CreateMap<Tenant, TenantVM>().ReverseMap();
            CreateMap<Tenant, TenantVerificationVM>().ReverseMap();

            CreateMap<Contact, ContactVM>().ReverseMap();
            CreateMap<Task, TaskVM>().ReverseMap();
            CreateMap<Opportunity, OpportunityVM>().ReverseMap();
            CreateMap<Lead, LeadVM>().ReverseMap();
            CreateMap<Account, AccountVM>().ReverseMap();

            CreateMap<User, LoginVM>().ReverseMap();
            //CreateMap<Tenant, LoginVM>().ReverseMap();
        }
    }
}
