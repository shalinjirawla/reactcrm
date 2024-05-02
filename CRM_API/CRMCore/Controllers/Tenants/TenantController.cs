using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.Tenants;
using CRMCore.Application.Dto.Users;
using CRMCore.Application.Interface.Tenants;
using CRMCore.Application.Interface.Users;
using CRMCore.Application.Repository.Tenants;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.EmailVerification;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IEmailRepository = CRMCore.Application.Interface.EmailVerification.IEmailRepository;

namespace CRMCore.Web.Controllers.Tenants
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantController : ControllerBase
    {
        private readonly ITenantRepository ITenant;
        private readonly CRMCoreDbContext db;
        private readonly IConfiguration configuration;

        public TenantController(ITenantRepository tenant, CRMCoreDbContext context, IConfiguration _configuration)
        {
            ITenant = tenant;
            db = context;
            configuration = _configuration;
        }

        [HttpGet]
        [Route("GetTenants")]
        public IActionResult Index()
        {
            var tenant = ITenant.GetTenants().ToList();
            return Ok(tenant);
        }

        [HttpPost]
        [Route("AddTenant")]
        public IActionResult Create(TenantVM tenant)
        {
            var add = ITenant.AddTenant(tenant);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateTenant")]
        public IActionResult Edit(TenantVM tenant)
        {
            var list = db.Tenants.Where(a => a.Id == tenant.Id).ToList();
            if (list.Count != 0)
            {
                ITenant.UpdateTenant(tenant);
                return Ok(tenant);
            }
            return NotFound(new { Message = "Tenant is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteTenant")]
        public bool Delete([Required] int id)
        {
            var tenant = db.Tenants.Where(a => a.Id == id).ToList();
            if (tenant.Count != 0)
            {
                ITenant.DeleteTenant(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByTenant")]
        public async Task<ActionResult> GetExcelFile()
        {
            IEnumerable<TenantVM> tenant = ITenant.GetTenants().ToList();

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Tenants");

                sheet.Cell(1, 1).Value = "   " + "Name";
                sheet.Cell(1, 2).Value = "   " + "Password";
                sheet.Cell(1, 3).Value = "   " + "Email";
                sheet.Cell(1, 4).Value = "   " + "Mobile number";

                var headerRange = sheet.Range("A1:D1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

                sheet.Column(1).Width = 45;
                sheet.Column(2).Width = 35;
                sheet.Column(3).Width = 25;
                sheet.Column(4).Width = 25;

                int rowIndex = 2;
                foreach (var employee in tenant)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.Name;
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Password;
                    sheet.Cell(rowIndex, 3).Value = "   " + employee.Email;
                    sheet.Cell(rowIndex, 4).Value = "   " + employee.MobileNumber;
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
                Message = "Tenant File has been Exported !!!",
                FileName = "Tenants.xlsx",
                Data = base64String
            });
        }
    }
}
