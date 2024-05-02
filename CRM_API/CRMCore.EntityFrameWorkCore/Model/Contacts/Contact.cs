using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;

namespace CRMCore.EntityFrameWorkCore.Model.Contacts
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }
        public string ContactName { get; set; }
        public string? Account { get; set; }
        public string? JobTitle { get; set; }
        public string Email { get; set; }
        public string? MobileNumber { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int? TypeId { get; set; }

        [ForeignKey("TypeId")]
        public virtual ContactType ContactTypes { get; set; }


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
