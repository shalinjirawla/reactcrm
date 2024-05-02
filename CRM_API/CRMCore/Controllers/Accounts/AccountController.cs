using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Interface.Accounts;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Accounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository IAccount;
        private readonly CRMCoreDbContext db;

        public AccountController(IAccountRepository account, CRMCoreDbContext context)
        {
            IAccount = account;
            db = context;
        }

        [HttpGet]
        [Route("GetAccounts")]
        public IActionResult Index()
        {
            var account = IAccount.GetAccounts().ToList();
            return Ok(account);
        }

        [HttpGet]
        [Route("GetAccountsByTenant")]
        public IActionResult GetAccountsByTenantId([Required] int tenantId)
        {
            var tenant = IAccount.GetAccountsByTenant(tenantId).ToList();
            return Ok(tenant);
        }

        [HttpGet]
        [Route("GetAccountsByTenantAdmin")]
        public IActionResult GetAccountsByTenantAdminId([Required] int tenantId)
        {
            var tenantAdmin = IAccount.GetAccountsByTenantAdmin(tenantId).ToList();
            return Ok(tenantAdmin);
        }

        [HttpGet]
        [Route("GetAccountsByUser")]
        public IActionResult GetAccountsByUserId([Required] int userId)
        {
            var user = IAccount.GetAccountsByUser(userId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddAccount")]
        public IActionResult Create(AccountVM account)
        {
            var add = IAccount.AddAccount(account);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateAccount")]
        public IActionResult Edit(AccountVM account)
        {
            var list = db.Accounts.Where(a => a.Id == account.Id).ToList();
            if (list.Count != 0)
            {
                IAccount.UpdateAccount(account);
                return Ok(account);
            }
            return Ok(new { Message = "Account is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteAccount")]
        public bool Delete([Required] int id)
        {
            var account = db.Accounts.Where(a => a.Id == id).ToList();
            if (account.Count != 0)
            {
                IAccount.DeleteAccount(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByAccount")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            IEnumerable<AccountVM> account;

            if (tenantId != null)
            {
                account = IAccount.GetAccountsByTenant(tenantId.Value).ToList();
            }
            else if (tenantAdminId != null)
            {
                account = IAccount.GetAccountsByTenantAdmin(tenantAdminId.Value).ToList();
            }
            else if (userId != null)
            {
                account = IAccount.GetAccountsByUser(userId.Value).ToList();
            }
            else
            {
                account = IAccount.GetAccounts().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Accounts");

                sheet.Cell(1, 1).Value = "   " + "Name";
                sheet.Cell(1, 2).Value = "   " + "Primary contact";
                sheet.Cell(1, 3).Value = "   " + "Type";
                sheet.Cell(1, 4).Value = "   " + "Category";
                sheet.Cell(1, 5).Value = "   " + "Industry";
                sheet.Cell(1, 6).Value = "   " + "Web";
                sheet.Cell(1, 7).Value = "   " + "Country";
                sheet.Cell(1, 8).Value = "   " + "Created on";

                var headerRange = sheet.Range("A1:H1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

                sheet.Column(1).Width = 45;
                sheet.Column(2).Width = 35;
                sheet.Column(3).Width = 25;
                sheet.Column(4).Width = 25;
                sheet.Column(5).Width = 35;
                sheet.Column(6).Width = 50;
                sheet.Column(7).Width = 35;
                sheet.Column(8).Width = 25;

                int rowIndex = 2;
                foreach (var employee in account)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.AccountName;
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                    sheet.Cell(rowIndex, 3).Value = "   " + employee.AccountTypes?.Type;
                    sheet.Cell(rowIndex, 4).Value = "   " + employee.AccountCategories?.Category;
                    sheet.Cell(rowIndex, 5).Value = "   " + employee.AccoutIndustries?.Industry;
                    sheet.Cell(rowIndex, 6).Value = "   " + employee.Web;
                    sheet.Cell(rowIndex, 7).Value = "   " + employee.Country;
                    sheet.Cell(rowIndex, 8).Value = "   " + employee.CreatedOn;
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
                Message = "Account File has been Exported !!!",
                FileName = "Accounts.xlsx",
                Data = base64String
            });
        }
    }
}
