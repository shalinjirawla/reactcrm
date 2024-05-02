using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMCore.EntityFrameWorkCore.Model.Leads
{
    public class Lead
    {
        [Key]
        public int Id { get; set; }
        public string Contact { get; set; }
        public string? Account { get; set; }
        public string? Comments { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int CustomerNeedId { get; set; }

        [ForeignKey("CustomerNeedId")]
        public virtual LeadCustomerNeed LeadCustomerNeeds { get; set; }


        public virtual int? StatusId { get; set; }

        [ForeignKey("StatusId")]
        public virtual LeadStatus LeadStatuses { get; set; }


        public virtual int? TypeId { get; set; }

        [ForeignKey("TypeId")]
        public virtual LeadType LeadTypes { get; set; }


        public virtual int? StageId { get; set; }

        [ForeignKey("StageId")]
        public virtual LeadStage LeadStages { get; set; }


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
