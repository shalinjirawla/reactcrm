using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMCore.EntityFrameWorkCore.Model.Tasks
{
    public class Task
    {
        [Key]
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Owner { get; set; }
        public string? Account { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public virtual TaskCategory TaskCategories { get; set; }


        public virtual int StatusId { get; set; }

        [ForeignKey("StatusId")]
        public virtual TaskStatus TaskStatuses { get; set; }


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
