using CRMCore.EntityFrameWorkCore.Model.Accounts;

namespace CRMCore.Application.Dto.Accounts
{
    public class AccountVM
    {
        public int Id { get; set; }
        public string AccountName { get; set; }
        public string? Contact { get; set; }
        public string? Web { get; set; }
        public string? MobileNumber { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int? TypeId { get; set; }
        public virtual AccountType? AccountTypes { get; set; }

        public int? CategoryId { get; set; }
        public virtual AccountCategory? AccountCategories { get; set; }

        public int? IndustryId { get; set; }
        public virtual AccoutIndustry? AccoutIndustries { get; set; }

        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }   
    }
}
