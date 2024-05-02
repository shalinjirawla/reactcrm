using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.Tasks;
using CRMCore.Application.Interface.Contacts;
using CRMCore.Application.Interface.Tasks;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Tasks
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskRepository ITask;
        private readonly CRMCoreDbContext db;

        public TaskController(ITaskRepository task, CRMCoreDbContext context)
        {
            ITask = task;
            db = context;
        }

        [HttpGet]
        [Route("GetTasks")]
        public IActionResult Index()
        {
            var task = ITask.GetTasks().ToList();
            return Ok(task);
        }

        [HttpGet]
        [Route("GetTasksByTenant")]
        public IActionResult GetTasksByTenantId([Required] int tenantId)
        {
            var tenant = ITask.GetTasksByTenant(tenantId).ToList();
            return Ok(tenant);
        }

        [HttpGet]
        [Route("GetTasksByTenantAdmin")]
        public IActionResult GetTasksByTenantAdminId([Required] int tenantId)
        {
            var tenantAdmin = ITask.GetTasksByTenantAdmin(tenantId).ToList();
            return Ok(tenantAdmin);
        }

        [HttpGet]
        [Route("GetTasksByUser")]
        public IActionResult GetTasksByUserId([Required] int userId)
        {
            var user = ITask.GetTasksByUser(userId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddTask")]
        public IActionResult Create(TaskVM task)
        {
            var add = ITask.AddTask(task);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateTask")]
        public IActionResult Edit(TaskVM task)
        {
            var list = db.Tasks.Where(a => a.Id == task.Id).ToList();
            if (list.Count != 0)
            {
                ITask.UpdateTask(task);
                return Ok(task);
            }
            return Ok(new { Message = "Task is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteTask")]
        public bool Delete([Required] int id)
        {
            var task = db.Tasks.Where(a => a.Id == id).ToList();
            if (task.Count != 0)
            {
                ITask.DeleteTask(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByTask")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            IEnumerable<TaskVM> task;

            if (tenantId != null)
            {
                task = ITask.GetTasksByTenant(tenantId.Value).ToList();
            }
            else if (tenantAdminId != null)
            {
                task = ITask.GetTasksByTenantAdmin(tenantAdminId.Value).ToList();
            }
            else if (userId != null)
            {
                task = ITask.GetTasksByUser(userId.Value).ToList();
            }
            else
            {
                task = ITask.GetTasks().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Tasks");

                sheet.Cell(1, 1).Value = "   " + "Subject";
                sheet.Cell(1, 2).Value = "   " + "Owner";
                sheet.Cell(1, 3).Value = "   " + "Account";
                sheet.Cell(1, 4).Value = "   " + "Start Date";
                sheet.Cell(1, 5).Value = "   " + "Due Date";
                sheet.Cell(1, 6).Value = "   " + "Category";
                sheet.Cell(1, 7).Value = "   " + "Status";

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
                foreach (var employee in task)
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

                using (var ms = new MemoryStream())
                {
                    wb.SaveAs(ms);
                    base64String = Convert.ToBase64String(ms.ToArray());
                }
            }

            return new CreatedResult(string.Empty, new
            {
                Code = 200,
                Status = true,
                Message = "Task File has been Exported !!!",
                FileName = "Tasks.xlsx",
                Data = base64String
            });
        }
    }
}