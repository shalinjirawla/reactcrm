using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.Users;
using CRMCore.Application.Interface.Users;
using CRMCore.EntityFrameWorkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CRMCore.Web.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository IUser;
        private readonly CRMCoreDbContext db;

        public UserController(IUserRepository user, CRMCoreDbContext context)
        {
            IUser = user;
            db = context;
        }

        [HttpGet]
        [Route("GetUsers")]
        public IActionResult Index()
        {
            var user = IUser.GetUsers().ToList();
            return Ok(user);
        }

        [HttpGet]
        [Route("GetUsersByTenant")]
        public IActionResult GetUsersByTenantId([Required] int tenantId)
        {
            var user = IUser.GetUsersByTenant(tenantId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddUser")]
        public IActionResult Create(UserVM user)
        {
            var add = IUser.AddUser(user);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateUser")]
        public IActionResult Edit(UserVM user)
        {
            var list = db.Users.Where(a => a.Id == user.Id).ToList();
            if (list.Count != 0)
            {
                IUser.UpdateUser(user);
                return Ok(user);
            }
            return Ok(new { Message = "User is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public bool Delete([Required] int id)
        {
            var user = db.Users.Where(a => a.Id == id).ToList();
            if (user.Count != 0)
            {
                IUser.DeleteUser(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByUser")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null)
        {
            IEnumerable<UserVM> user;

            if (tenantId != null)
            {
                user = IUser.GetUsersByTenant(tenantId.Value).ToList();
            } else {
                user = IUser.GetUsers().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Users");

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
                foreach (var employee in user)
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
                Message = "User File has been Exported !!!",
                FileName = "Users.xlsx",
                Data = base64String
            });
        }
    }
}
