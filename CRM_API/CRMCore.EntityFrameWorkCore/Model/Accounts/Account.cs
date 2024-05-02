using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMCore.EntityFrameWorkCore.Model.Accounts
{
    public class Account
    {
        [Key]
        public int Id { get; set; }
        public string AccountName { get; set; }
        public string? Contact { get; set; }
        public string? Web { get; set; }
        public string? MobileNumber { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int? TypeId { get; set; }

        [ForeignKey("TypeId")]
        public virtual AccountType AccountTypes { get; set; }


        public virtual int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual AccountCategory AccountCategories { get; set; }


        public virtual int? IndustryId { get; set; }

        [ForeignKey("IndustryId")]
        public virtual AccoutIndustry AccoutIndustries { get; set; }


        [ForeignKey("RoleId")]
        public virtual int? RoleId { get; set; }
        public virtual Role Roles { get; set; }


        [ForeignKey("UserId")]
        public virtual int? UserId { get; set; }
        public virtual User Users { get; set; }


        [ForeignKey("TenantId")]
        public virtual int? TenantId { get; set; }
        public virtual Tenant Tenants { get; set; }
    }
}
