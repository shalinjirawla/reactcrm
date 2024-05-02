using CRMCore.EntityFrameWorkCore.Model.Leads;

namespace CRMCore.Application.Dto.Leads
{
    public class LeadVM
    {
        public int Id { get; set; }
        public string Contact { get; set; }
        public string? Account { get; set; }
        public string? Comments { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int CustomerNeedId { get; set; }
        public virtual LeadCustomerNeed? LeadCustomerNeeds { get; set; }

        public int? StatusId { get; set; }
        public virtual LeadStatus? LeadStatuses { get; set; }

        public int? TypeId { get; set; }
        public virtual LeadType? LeadTypes { get; set; }

        public int? StageId { get; set; }
        public virtual LeadStage? LeadStages { get; set; }

        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }
    }
}
