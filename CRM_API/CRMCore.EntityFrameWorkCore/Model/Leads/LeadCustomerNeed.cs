using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMCore.EntityFrameWorkCore.Model.Leads
{
    public class LeadCustomerNeed
    {
        [Key]
        public int Id { get; set; }
        public string CustomerNeed { get; set; }
    }
}
