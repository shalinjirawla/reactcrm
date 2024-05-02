using System.ComponentModel.DataAnnotations;

namespace CRMCore.EntityFrameWorkCore.Model.Tenants
{
    public class Tenant
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsEmailVerified { get; set; }
        public DateTime? CreatedOn { get; set; }
        //public string? VerificationToken { get; set; }

        //public virtual int RoleId { get; set; }

        //[ForeignKey("RoleId")]
        //public virtual Role Roles { get; set; }
    }
}
