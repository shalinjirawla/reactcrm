using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.Leads;
using CRMCore.Application.Dto.Opportunities;
using CRMCore.Application.Interface.Opportunities;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Opportunities
{
    [Route("api/[controller]")]
    [ApiController]
    public class OpportunityController : ControllerBase
    {
        private readonly IOpportunityRepository IOpportunity;
        private readonly CRMCoreDbContext db;

        public OpportunityController(IOpportunityRepository opportunity, CRMCoreDbContext context)
        {
            IOpportunity = opportunity;
            db = context;
        }

        [HttpGet]
        [Route("GetOpportunities")]
        public IActionResult Index()
        {
            var opportunity = IOpportunity.GetOpportunities().ToList();
            return Ok(opportunity);
        }

        [HttpGet]
        [Route("GetOpportunitiesByTenant")]
        public IActionResult GetOpportunitiesByTenantId([Required] int tenantId)
        {
            var tenant = IOpportunity.GetOpportunitiesByTenant(tenantId).ToList();
            return Ok(tenant);
        }

        [HttpGet]
        [Route("GetOpportunitiesByTenantAdmin")]
        public IActionResult GetOpportunitiesByTenantAdminId([Required] int tenantId)
        {
            var tenantAdmin = IOpportunity.GetOpportunitiesByTenantAdmin(tenantId).ToList();
            return Ok(tenantAdmin);
        }

        [HttpGet]
        [Route("GetOpportunitiesByUser")]
        public IActionResult GetOpportunitiesByUserId([Required] int userId)
        {
            var user = IOpportunity.GetOpportunitiesByUser(userId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddOpportunity")]
        public IActionResult Create(OpportunityVM opportunity)
        {
            var add = IOpportunity.AddOpportunity(opportunity);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateOpportunity")]
        public IActionResult Edit(OpportunityVM opportunity)
        {
            var list = db.Opportunities.Where(a => a.Id == opportunity.Id).ToList();
            if (list.Count != 0)
            {
                IOpportunity.UpdateOpportunity(opportunity);
                return Ok(opportunity);
            }
            return Ok(new { Message = "Opportunity is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteOpportunity")]
        public bool Delete([Required] int id)
        {
            var opportunity = db.Opportunities.Where(a => a.Id == id).ToList();
            if (opportunity.Count != 0)
            {
                IOpportunity.DeleteOpportunity(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByOpportunity")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            IEnumerable<OpportunityVM> opportunity;

            if (tenantId != null)
            {
                opportunity = IOpportunity.GetOpportunitiesByTenant(tenantId.Value).ToList();
            }
            else if (tenantAdminId != null)
            {
                opportunity = IOpportunity.GetOpportunitiesByTenantAdmin(tenantAdminId.Value).ToList();
            }
            else if (userId != null)
            {
                opportunity = IOpportunity.GetOpportunitiesByUser(userId.Value).ToList();
            }
            else
            {
                opportunity = IOpportunity.GetOpportunities().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Opportunities");

                sheet.Cell(1, 1).Value = "   " + "Name";
                sheet.Cell(1, 2).Value = "   " + "Contact";
                sheet.Cell(1, 3).Value = "   " + "Account";
                sheet.Cell(1, 4).Value = "   " + "Stage";
                sheet.Cell(1, 5).Value = "   " + "Sales channel";
                sheet.Cell(1, 6).Value = "   " + "Total contract value";
                sheet.Cell(1, 7).Value = "   " + "Expected close date";

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
                foreach (var employee in opportunity)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.Name;
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                    sheet.Cell(rowIndex, 3).Value = "   " + employee.Account;
                    sheet.Cell(rowIndex, 4).Value = "   " + employee.OpportunityStages?.Stage;
                    sheet.Cell(rowIndex, 5).Value = "   " + employee.OpportunitySalesChannels?.SalesChannel;
                    sheet.Cell(rowIndex, 6).Value = "   " + employee.ContractValue;
                    sheet.Cell(rowIndex, 7).Value = "   " + employee.CloseDate;
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
                Message = "Opportunity File has been Exported !!!",
                FileName = "Opportunities.xlsx",
                Data = base64String
            });
        }

        [HttpGet("GetOpportunityByTimePeriod")]
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

            IEnumerable<OpportunityVM> filteredData;

            if (tenantId != null)
            {
                filteredData = IOpportunity.GetOpportunitiesByTenant(tenantId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else if (tenantAdminId != null)
            {
                filteredData = IOpportunity.GetOpportunitiesByTenantAdmin(tenantAdminId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else if (userId != null)
            {
                filteredData = IOpportunity.GetOpportunitiesByUser(userId.Value).Where(d => d.CreatedOn >= startDate).ToList();
            }
            else
            {
                filteredData = IOpportunity.GetOpportunities().Where(d => d.CreatedOn >= startDate).ToList();
            }

            return Ok(filteredData);
        }
    }
}