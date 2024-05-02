using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Accounts
{
    public class AccoutIndustry
    {
        [Key]
        public int Id { get; set; }
        public string Industry { get; set; }
    }
}
