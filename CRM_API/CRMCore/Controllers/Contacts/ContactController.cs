using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Interface.Contacts;
using CRMCore.Application.Repository.Contacts;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Contacts;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;

namespace CRMCore.Web.Controllers.Contacts
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IContactRepository IContact;
        private readonly CRMCoreDbContext db;

        public ContactController(IContactRepository contact, CRMCoreDbContext context)
        {
            IContact = contact;
            db = context;
        }

        [HttpGet]
        [Route("GetContacts")]
        public IActionResult Index()
        {
            var conatct = IContact.GetContacts().ToList();
            return Ok(conatct);
        }

        [HttpGet]
        [Route("GetContactsByTenant")]
        public IActionResult GetContactsByTenantId([Required] int tenantId)
        {
            var tenant = IContact.GetContactsByTenant(tenantId).ToList();
            return Ok(tenant);
        }

        [HttpGet]
        [Route("GetContactsByTenantAdmin")]
        public IActionResult GetContactsByTenantAdminId([Required] int tenantId)
        {
            var tenantAdmin = IContact.GetContactsByTenantAdmin(tenantId).ToList();
            return Ok(tenantAdmin);
        }

        [HttpGet]
        [Route("GetContactsByUser")]
        public IActionResult GetContactsByUserId([Required] int userId)
        {
            var user = IContact.GetContactsByUser(userId).ToList();
            return Ok(user);
        }

        [HttpPost]
        [Route("AddContact")]
        public IActionResult Create(ContactVM contact)
        {
            var add = IContact.AddContact(contact);
            return Ok(add);
        }

        [HttpPut]
        [Route("UpdateContact")]
        public IActionResult Edit(ContactVM contact)
        {
            var list = db.Contacts.Where(a => a.Id == contact.Id).ToList();
            if (list.Count != 0)
            {
                IContact.UpdateContact(contact);
                return Ok(contact);
            }
            return Ok(new { Message = "Contact is not available !!!" });
        }

        [HttpDelete]
        [Route("DeleteContact")]
        public bool Delete([Required] int id)
        {
            var contact = db.Contacts.Where(a => a.Id == id).ToList();
            if (contact.Count != 0)
            {
                IContact.DeleteContact(id);
                return true;
            }
            return false;
        }

        [HttpGet("GetExportExcelByContact")]
        public async Task<ActionResult> GetExcelFile(int? tenantId = null, int? tenantAdminId = null, int? userId = null)
        {
            IEnumerable<ContactVM> contact;

            if (tenantId != null)
            {
                contact = IContact.GetContactsByTenant(tenantId.Value).ToList();
            }
            else if (tenantAdminId != null)
            {
                contact = IContact.GetContactsByTenantAdmin(tenantAdminId.Value).ToList();
            }
            else if (userId != null)
            {
                contact = IContact.GetContactsByUser(userId.Value).ToList();
            }
            else
            {
                contact = IContact.GetContacts().ToList();
            }

            string base64String;
            using (var wb = new XLWorkbook())
            {
                var sheet = wb.Worksheets.Add("Contacts");

                sheet.Cell(1, 1).Value = "   " + "Full name";
                sheet.Cell(1, 2).Value = "   " + "Account";
                sheet.Cell(1, 3).Value = "   " + "Type";
                sheet.Cell(1, 4).Value = "   " + "Email";
                sheet.Cell(1, 5).Value = "   " + "Mobile number";
                sheet.Cell(1, 6).Value = "   " + "Country";

                var headerRange = sheet.Range("A1:F1");
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.FontColor = XLColor.White;
                headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

                sheet.Column(1).Width = 45;
                sheet.Column(2).Width = 35;
                sheet.Column(3).Width = 25;
                sheet.Column(4).Width = 25;
                sheet.Column(5).Width = 25;
                sheet.Column(6).Width = 35;

                //sheet.Columns().AdjustToContents();

                int rowIndex = 2;
                foreach (var employee in contact)
                {
                    sheet.Cell(rowIndex, 1).Value = "   " + employee.ContactName;
                    sheet.Cell(rowIndex, 2).Value = "   " + employee.Account;
                    sheet.Cell(rowIndex, 3).Value = "   " + employee.ContactTypes?.Type;
                    sheet.Cell(rowIndex, 4).Value = "   " + employee.Email;
                    sheet.Cell(rowIndex, 5).Value = "   " + employee.MobileNumber;
                    sheet.Cell(rowIndex, 6).Value = "   " + employee.Country;
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
                Message = "Contact File has been Exported !!!",
                FileName = "Contacts.xlsx",
                Data = base64String
            });
        }
    }
}
