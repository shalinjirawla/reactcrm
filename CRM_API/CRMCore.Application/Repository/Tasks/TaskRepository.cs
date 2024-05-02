using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Tasks;
using CRMCore.Application.Enums;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Interface.Tasks;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Tasks;
using Task = CRMCore.EntityFrameWorkCore.Model.Tasks.Task;
using TaskStatus = CRMCore.EntityFrameWorkCore.Model.Tasks.TaskStatus;

namespace CRMCore.Application.Repository.Tasks
{
    public class TaskRepository : ITaskRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Task> IGeneric;

        public TaskRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Task> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<TaskVM> GetTasks()
        {
            var taskList = IGeneric.GetAll(a => a.TaskCategories, a => a.TaskStatuses).Where(a => a.RoleId == (int)Role.HostAdmin || a.RoleId == (int)Role.HostUser).ToList();
            return MapAndAssignTaskList(taskList);
        }

        public IEnumerable<TaskVM> GetTasksByTenant(int tenantId)
        {
            var tenantList = IGeneric.GetAll(a => a.TaskCategories, a => a.TaskStatuses).Where(a => a.TenantId == tenantId).ToList();
            return MapAndAssignTaskList(tenantList);
        }

        public IEnumerable<TaskVM> GetTasksByTenantAdmin(int tenantId)
        {
            var tenantAdminList = IGeneric.GetAll(a => a.TaskCategories, a => a.TaskStatuses).Where(a => a.TenantId == tenantId && (a.RoleId == (int)Role.Admin || a.RoleId == (int)Role.User)).ToList();
            return MapAndAssignTaskList(tenantAdminList);
        }

        public IEnumerable<TaskVM> GetTasksByUser(int userId)
        {
            var userList = IGeneric.GetAll(a => a.TaskCategories, a => a.TaskStatuses).Where(a => a.UserId == userId).ToList();
            return MapAndAssignTaskList(userList);
        }

        public Task AddTask(TaskVM task)
        {
            var map = mapper.Map<Task>(task);
            IGeneric.Create(map);
            return map;
        }

        public Task UpdateTask(TaskVM task)
        {
            var map = mapper.Map<Task>(task);
            var date = db.Tasks.Where(a => a.Id == task.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Task DeleteTask(int TaskId)
        {
            IGeneric.Delete(TaskId);
            return null;
        }

        public Task AddTaskImportData(ImportExcel model, List<String> rowData)
        {
            string categoryValue = rowData[5].Trim();
            string statusValue = rowData[6].Trim();

            var categoryId = db.TaskCategories.Where(x => x.Category == categoryValue).FirstOrDefault();
            var statusId = db.TaskStatuses.Where(x => x.Status == statusValue).FirstOrDefault();

            rowData[5] = categoryId != null ? Convert.ToString(categoryId.Id) : null;
            rowData[6] = statusId != null ? Convert.ToString(statusId.Id) : null;

            var entity = new Task
            {
                Subject = rowData[0].Trim(),
                Owner = rowData[1].Trim(),
                Account = rowData[2].Trim(),
                StartDate = Convert.ToDateTime(rowData[3].Trim()),
                EndDate = Convert.ToDateTime(rowData[4].Trim()),
                CategoryId = rowData[5] != null ? Convert.ToInt32(rowData[5]) : 2,
                StatusId = rowData[6] != null ? Convert.ToInt32(rowData[6]) : 1,
                CreatedOn = DateTime.Now,
                RoleId = model.RoleId,
                UserId = model.UserId,
                TenantId = model.TenantId
            };
            if (entity.RoleId == 0) entity.RoleId = null;
            if (entity.UserId == 0) entity.UserId = null;
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Tasks.Add(entity);

            return entity;
        }

        public IEnumerable<TaskVM> GetSampleDataByTask(XLWorkbook wb)
        {
            var sampleTasks = new List<TaskVM>
            {
                new TaskVM { Subject = "Call customer", Owner = "Alex Hales", Account = "Ncoresoft Technologies", StartDate = DateTime.Parse("2024-05-01"), EndDate = DateTime.Parse("2024-05-10"), TaskCategories = new TaskCategory { Id = 1, Category = "Call" }, TaskStatuses = new TaskStatus { Id = 1, Status = "Not started" } },
                new TaskVM { Subject = "Meeting with client", Owner = "Colin Munro", StartDate = DateTime.Parse("2024-05-25"), EndDate = DateTime.Parse("2024-06-15"), TaskCategories = new TaskCategory { Id = 2, Category = "Email" }, TaskStatuses = new TaskStatus { Id = 2, Status = "In progress" } }
            };

            var sheet = wb.Worksheets.Add("Tasks");

            sheet.Cell(1, 1).Value = "   " + "* Subject";
            sheet.Cell(1, 2).Value = "   " + "* Owner";
            sheet.Cell(1, 3).Value = "   " + "Account";
            sheet.Cell(1, 4).Value = "   " + "* Start Date";
            sheet.Cell(1, 5).Value = "   " + "* Due Date";
            sheet.Cell(1, 6).Value = "   " + "* Category";
            sheet.Cell(1, 7).Value = "   " + "* Status";

            var headerRange = sheet.Range("A1:G1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

            sheet.Column(1).Width = 50;
            sheet.Column(2).Width = 35;
            sheet.Column(3).Width = 35;
            sheet.Column(4).Width = 25;
            sheet.Column(5).Width = 25;
            sheet.Column(6).Width = 25;
            sheet.Column(7).Width = 25;

            int rowIndex = 2;
            foreach (var employee in sampleTasks)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + employee.Subject;
                sheet.Cell(rowIndex, 2).Value = "   " + employee.Owner;
                sheet.Cell(rowIndex, 3).Value = "   " + employee.Account;
                sheet.Cell(rowIndex, 4).Value = "   " + employee.StartDate;
                sheet.Cell(rowIndex, 5).Value = "   " + employee.EndDate;
                sheet.Cell(rowIndex, 6).Value = "   " + employee.TaskCategories?.Category;
                sheet.Cell(rowIndex, 7).Value = "   " + employee.TaskStatuses?.Status;
                rowIndex++;
            }

            return null;
        }

        private IEnumerable<TaskVM> MapAndAssignTaskList(IEnumerable<Task> taskList)
        {
            List<TaskVM> map = mapper.Map<List<TaskVM>>(taskList);
            return map.OrderByDescending(a => a.Id);
        }
    }
}
