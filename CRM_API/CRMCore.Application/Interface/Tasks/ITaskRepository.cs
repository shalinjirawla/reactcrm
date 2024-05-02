using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Tasks;
using Task = CRMCore.EntityFrameWorkCore.Model.Tasks.Task;

namespace CRMCore.Application.Interface.Tasks
{
    public interface ITaskRepository
    {
        IEnumerable<TaskVM> GetTasks();
        IEnumerable<TaskVM> GetTasksByTenant(int tenantId);
        IEnumerable<TaskVM> GetTasksByTenantAdmin(int tenantId);
        IEnumerable<TaskVM> GetTasksByUser(int userId);
        Task AddTask(TaskVM task);
        Task UpdateTask(TaskVM task);
        Task DeleteTask(int TaskId);
        Task AddTaskImportData(ImportExcel model, List<String> rowData);
        IEnumerable<TaskVM> GetSampleDataByTask(XLWorkbook wb);
    }
}
