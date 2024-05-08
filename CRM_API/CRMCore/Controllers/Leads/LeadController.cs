using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.Leads;
using CRMCore.Application.Dto.Opportunities;
using CRMCore.Application.Interface.Leads;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Opportunities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Leads
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadController : ControllerBase
    {
        private readonly ILeadRepository ILead;
        private readonly CRMCoreDbContext db;

        public LeadController(ILeadRepository lead, CRMCoreDbContext context)
        {
            ILead = lead;
            db = context;
        }

        [HttpGet]
        [Route("GetLeads")]
        public IActionResult Index()
        {
            var lead = ILead.GetLeads().ToList();
            return Ok(lead);
        }

        [HttpGet]
        [Route("GetLeadsByTenant")]
        public IActionResult GetLeadsByTenantId([Required] int tenantId)
        {
            var tenant = ILead.GetLeadsByTenant(tenantId).ToList();
            return Ok(tenant);
        }

        [HttpGet]
        [Route("GetLeadsByTenantAdmin")]
        public IActionResult GetLeadsByTenantAdminId([Required] int tenantId)
        {
            var tenantAdmin = ILead.GetLeadsByTenantAdmin(tenantId).ToList();
            return Ok(tenantAdmin);
        }

        [HttpGet]
        [Route("GetLeadsByUser")]
        public IActionResult GetLeadsByUserId([Required] int userId)
        {
            var user = ILead.GetLeadsByUser(userId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddLead")]
        public IActionResult Create(LeadVM lead)
        {
            var add = ILead.AddLead(lead);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateLead")]
        public IActionResult Edit(LeadVM lead)
        {
            var list = db.Leads.Where(a => a.Id == lead.Id).ToList();
            if (list.Count != 0)
            {
                ILead.UpdateLead(lead);
                return Ok(lead);
            }
            return Ok(new { Message = "Lead is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteLead")]
        public bool Delete([Required] int id)
        {
            var lead = db.Leads.Where(a => a.Id == id).ToList();
            if (lead.Count != 0)
            {
                ILead.DeleteLead(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByLead")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            IEnumerable<LeadVM> lead;

            if (tenantId != null)
            {
                lead = ILead.GetLeadsByTenant(tenantId.Value).ToList();
            }
            else if (tenantAdminId != null)
            {
                lead = ILead.GetLeadsByTenantAdmin(tenantAdminId.Value).ToList();
            }
            else if (userId != null)
            {
                lead = ILead.GetLeadsByUser(userId.Value).ToList();
            }
            else
            {
                lead = ILead.GetLeads().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Leads");

                sheet.Cell(1, 1).Value = "   " + "Name";
                sheet.Cell(1, 2).Value = "   " + "Contact";
                sheet.Cell(1, 3).Value = "   " + "Account";
                sheet.Cell(1, 4).Value = "   " + "Status";
                sheet.Cell(1, 5).Value = "   " + "Lead type";
                sheet.Cell(1, 6).Value = "   " + "Stage";
                sheet.Cell(1, 7).Value = "   " + "Created on";

                var headerRange = sheet.Range("A1:G1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

                sheet.Column(1).Width = 55;
                sheet.Column(2).Width = 35;
                sheet.Column(3).Width = 35;
                sheet.Column(4).Width = 25;
                sheet.Column(5).Width = 25;
                sheet.Column(6).Width = 25;
                sheet.Column(7).Width = 25;

                int rowIndex = 2;
                foreach (var employee in lead)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.LeadCustomerNeeds?.CustomerNeed + " / " + employee.Contact + (employee.Account != "" ? (", " + employee.Account) : "");
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                    sheet.Cell(rowIndex, 3).Value = "   " + employee.Account;
                    sheet.Cell(rowIndex, 4).Value = "   " + employee.LeadStatuses?.Status;
                    sheet.Cell(rowIndex, 5).Value = "   " + employee.LeadTypes?.Type;
                    sheet.Cell(rowIndex, 6).Value = "   " + employee.LeadStages?.Stage;
                    sheet.Cell(rowIndex, 7).Value = "   " + employee.CreatedOn;
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
                Message = "Lead File has been Exported !!!",
                FileName = "Leads.xlsx",
                Data = base64String
            });
        }

        [HttpGet("GetLeadByTimePeriod")]
        public IActionResult GetDataByTimePeriod(string timePeriod, int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            DateTime startDate;
            switch (timePeriod)
            {
                case "today":
                    startDate = DateTime.Today;
                    break;
                case "days_7":
                    startDate = DateTime.Today.AddDays(-6);
                    break;
                case "days_14":
                    startDate = DateTime.Today.AddDays(-13);
                    break;
                case "days_30":
                    startDate = DateTime.Today.AddDays(-29);
                    break;
                case "days_60":
                    startDate = DateTime.Today.AddDays(-59);
                    break;
                case "days_90":
                    startDate = DateTime.Today.AddDays(-89);
                    break;
                case "days_365":
                    startDate = DateTime.Today.AddDays(-364);
                    break;
                default:
                    return BadRequest("Invalid time period.");
            }

            IEnumerable<LeadVM> filteredData;

            if (tenantId != null)
            {
                filteredData = ILead.GetLeadsByTenant(tenantId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else if (tenantAdminId != null)
            {
                filteredData = ILead.GetLeadsByTenantAdmin(tenantAdminId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else if (userId != null)
            {
                filteredData = ILead.GetLeadsByUser(userId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else
            {
                filteredData = ILead.GetLeads().Where(d => d.CreatedOn >= startDate).ToList();
            }

            return Ok(filteredData);
        }
    }
}
