using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRMCore.EntityFrameWorkCore.Model.Opportunities
{
    public class Opportunity
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Contact { get; set; }
        public string? Account { get; set; }
        public int? ContractValue { get; set; }
        public DateTime? CloseDate { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int StageId { get; set; }

        [ForeignKey("StageId")]
        public virtual OpportunityStage OpportunityStages { get; set; }


        public virtual int? SalesChannelId { get; set; }

        [ForeignKey("SalesChannelId")]
        public virtual OpportunitySalesChannel OpportunitySalesChannels { get; set; }


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
