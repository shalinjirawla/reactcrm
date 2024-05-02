using CRMCore.EntityFrameWorkCore.Model.Opportunities;

namespace CRMCore.Application.Dto.Opportunities
{
    public class OpportunityVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Contact { get; set; }
        public string? Account { get; set; }
        public int? ContractValue { get; set; }
        public DateTime? CloseDate { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int StageId { get; set; }
        public virtual OpportunityStage? OpportunityStages { get; set; }

        public int? SalesChannelId { get; set; }
        public virtual OpportunitySalesChannel? OpportunitySalesChannels { get; set; }

        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }
    }
}
