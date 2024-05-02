using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMCore.Application.Dto.Users
{
    public class UserVM
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int RoleId { get; set; }
        public int? TenantId { get; set; }
    }
}
