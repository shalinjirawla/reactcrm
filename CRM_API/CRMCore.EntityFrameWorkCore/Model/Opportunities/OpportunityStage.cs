using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Opportunities
{
    public class OpportunityStage
    {
        [Key]
        public int Id { get; set; }
        public string Stage { get; set; }
    }
}
