using CRMCore.EntityFrameWorkCore.Model.Tasks;
using TaskStatus = CRMCore.EntityFrameWorkCore.Model.Tasks.TaskStatus;

namespace CRMCore.Application.Dto.Tasks
{
    public class TaskVM
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Owner { get; set; }
        public string? Account { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int CategoryId { get; set; }
        public virtual TaskCategory? TaskCategories { get; set; }

        public int StatusId { get; set; }
        public virtual TaskStatus? TaskStatuses { get; set; }

        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }
    }
}
