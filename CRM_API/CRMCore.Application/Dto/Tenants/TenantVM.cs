using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMCore.Application.Dto.Tenants
{
    public class TenantVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public bool? IsActive { get; set; }
        //public bool? IsEmailVerified { get; set; }
        public DateTime? CreatedOn { get; set; }
        //public string? VerificationToken { get; set; }
    }
}
