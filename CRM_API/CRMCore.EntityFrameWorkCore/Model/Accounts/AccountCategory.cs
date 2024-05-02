using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Accounts
{
    public class AccountCategory
    {
        [Key]
        public int Id { get; set; }
        public string Category { get; set; }
    }
}
