using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Opportunities
{
    public class OpportunitySalesChannel
    {
        [Key]
        public int Id { get; set; }
        public string SalesChannel { get; set; }
    }
}
