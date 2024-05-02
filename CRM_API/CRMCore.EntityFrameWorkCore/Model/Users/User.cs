using CRMCore.EntityFrameWorkCore.Model.Contacts;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMCore.EntityFrameWorkCore.Model.Users
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public DateTime? CreatedOn { get; set; }


        public virtual int RoleId { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role Roles { get; set; }


        [ForeignKey("TenantId")]
        public virtual int? TenantId { get; set; }
        public virtual Tenant Tenants { get; set; }
    }
}
