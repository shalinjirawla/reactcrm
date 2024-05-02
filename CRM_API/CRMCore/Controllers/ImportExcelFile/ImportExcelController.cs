using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Interface.Accounts;
using CRMCore.Application.Interface.Contacts;
using CRMCore.Application.Interface.Leads;
using CRMCore.Application.Interface.Opportunities;
using CRMCore.Application.Interface.Roles;
using CRMCore.Application.Interface.Tasks;
using CRMCore.Application.Interface.Tenants;
using CRMCore.Application.Interface.Users;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace CRMCore.Web.Controllers.ImportExcelFile
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImportExcelController : ControllerBase
    {
        private readonly CRMCoreDbContext db;
        private readonly IContactRepository IContact;
        private readonly IAccountRepository IAccount;
        private readonly ITaskRepository ITask;
        private readonly ILeadRepository ILead;
        private readonly IOpportunityRepository IOpportunity;
        private readonly IUserRepository IUser;
        private readonly ITenantRepository ITenant;
        private readonly IRoleRepository IRole;

        public ImportExcelController(CRMCoreDbContext context, IContactRepository contact, IAccountRepository account, ITaskRepository task, ILeadRepository lead, IOpportunityRepository opportunity, IUserRepository user, ITenantRepository tenant, IRoleRepository role)
        {
            db = context;
            IContact = contact;
            IAccount = account;
            ITask = task;
            ILead = lead;
            IOpportunity = opportunity;
            IUser = user;
            ITenant = tenant;
            IRole = role;
        }

        [HttpPost("ImportExcelData")]
        public async Task<IActionResult> ImportExcel([FromForm] ImportExcel model)
        {
            try
            {
                if (model == null || model.File.Length == 0)
                    return BadRequest("No file uploaded.");

                if (!Path.GetExtension(model.File.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Invalid file format. Please upload an Excel (.xlsx) file.");

                using (var stream = new MemoryStream())
                {
                    await model.File.CopyToAsync(stream);

                    using (var package = new ExcelPackage(stream))
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets.FirstOrDefault();

                        if (worksheet == null)
                            return BadRequest("No worksheet found in the Excel file.");

                        int rowCount = worksheet.Dimension.Rows;
                        int columnCount = worksheet.Dimension.Columns;

                        var importedData = new List<List<string>>();

                        for (int row = 2; row <= rowCount; row++)
                        {
                            var rowData = new List<string>();
                            for (int col = 1; col <= columnCount; col++)
                            {
                                var cellValue = worksheet.Cells[row, col].Value?.ToString() ?? string.Empty;
                                rowData.Add(cellValue);
                            }
                            importedData.Add(rowData);
                        }

                        foreach (var rowData in importedData)
                        {
                            if (model.Module == "Contact") IContact.AddContactImportData(model, rowData);
                            else if (model.Module == "Account") IAccount.AddAccountImportData(model, rowData);
                            else if (model.Module == "Task") ITask.AddTaskImportData(model, rowData);
                            else if (model.Module == "Lead") ILead.AddLeadImportData(model, rowData);
                            else if (model.Module == "Opportunity") IOpportunity.AddOpportunityImportData(model, rowData);
                            else if (model.Module == "User") IUser.AddUserImportData(model, rowData);
                            else if (model.Module == "Tenant") ITenant.AddTenantImportData(model, rowData);
                            else if (model.Module == "Role") IRole.AddUserRoleImportData(model, rowData);
                            else return BadRequest("Invalid Module !!!");
                        }
                        db.SaveChanges();

                        return new CreatedResult(string.Empty, new
                        {
                            Code = 200,
                            Status = true,
                            Message = $"{model.File.FileName} File has been Imported !!!",
                            FileName = model.File.FileName
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while importing the Excel file: {ex.Message}");
            }
        }

        [HttpGet("GetSampleData")]
        public async Task<ActionResult> GetSampleData(string Module)
        {
            string base64String;
            using (var wb = new XLWorkbook())
            {
                if (Module == "Contact") IContact.GetSampleDataByContact(wb);
                else if (Module == "Account") IAccount.GetSampleDataByAccount(wb);
                else if (Module == "Task") ITask.GetSampleDataByTask(wb);
                else if (Module == "Lead") ILead.GetSampleDataByLead(wb);
                else if (Module == "Opportunity") IOpportunity.GetSampleDataByOpportunity(wb);
                else if (Module == "User") IUser.GetSampleDataByUser(wb);
                else if (Module == "Tenant") ITenant.GetSampleDataByTenant(wb);
                else if (Module == "Role") IRole.GetSampleDataByUserRole(wb);
                else return BadRequest("Invalid Module !!!");

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
                Message = $"Sample {Module} data has been downloaded !!!",
                FileName = $"{Module}.xlsx",
                Data = base64String
            });
        }
    }
}
