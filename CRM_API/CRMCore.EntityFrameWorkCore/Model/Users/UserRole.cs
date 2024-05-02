using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Users
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedOn { get; set; }
    }
}
