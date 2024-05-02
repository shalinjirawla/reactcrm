using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRMCore.EntityFrameWorkCore.Model.Tasks
{
    public class TaskCategory
    {
        [Key]
        public int Id { get; set; }
        public string Category { get; set; }
    }
}
