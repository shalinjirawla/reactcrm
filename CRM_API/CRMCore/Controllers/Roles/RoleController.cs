using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.Users;
using CRMCore.Application.Interface.Roles;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Roles
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository IRole;
        private readonly CRMCoreDbContext db;

        public RoleController(IRoleRepository role, CRMCoreDbContext context)
        {
            IRole = role;
            db = context;
        }

        [HttpGet]
        [Route("GetRoles")]
        public IActionResult Index()
        {
            var role = IRole.GetRoles().ToList();
            return Ok(role);
        }

        [HttpPost]
        [Route("AddRole")]
        public IActionResult Create(UserRoleVM role)
        {
            var add = IRole.AddRole(role);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateRole")]
        public IActionResult Edit(UserRoleVM role)
        {
            var list = db.UserRoles.Where(a => a.Id == role.Id).ToList();
            if (list.Count != 0)
            {
                IRole.UpdateRole(role);
                return Ok(role);
            }
            return Ok(new { Message = "Role is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteRole")]
        public bool Delete([Required] int id)
        {
            var role = db.UserRoles.Where(a => a.Id == id).ToList();
            if (role.Count != 0)
            {
                IRole.DeleteRole(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByRole")]
        public async Task<ActionResult> GetExcelFile()
        {
            IEnumerable<UserRoleVM> role = IRole.GetRoles().ToList();

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Roles");

                sheet.Cell(1, 1).Value = "   " + "Name";
                sheet.Cell(1, 2).Value = "   " + "Status";

                var headerRange = sheet.Range("A1:B1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

                sheet.Column(1).Width = 45;
                sheet.Column(2).Width = 35;

                int rowIndex = 2;
                foreach (var employee in role)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.Name;
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Status;
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
                Message = "Role File has been Exported !!!",
                FileName = "Roles.xlsx",
                Data = base64String
            });
        }
    }
}
