using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Accounts
{
    public class AccountType
    {
        [Key]
        public int Id { get; set; }
        public string Type { get; set; }
    }
}
