using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Enums;
using CRMCore.Application.Interface.Contacts;
using CRMCore.Application.Interface.Generic;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Contacts;

namespace CRMCore.Application.Repository.Contacts
{
    public class ContactRepository : IContactRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Contact> IGeneric;

        public ContactRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Contact> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<ContactVM> GetContacts()
        {
            var contactList = IGeneric.GetAll(a => a.ContactTypes).Where(a => a.RoleId == (int)Role.HostAdmin || a.RoleId == (int)Role.HostUser).ToList();
            return MapAndAssignContactList(contactList);
        }

        public IEnumerable<ContactVM> GetContactsByTenant(int tenantId)
        {
            var tenantList = IGeneric.GetAll(a => a.ContactTypes).Where(a => a.TenantId == tenantId).ToList();
            return MapAndAssignContactList(tenantList);
        }

        public IEnumerable<ContactVM> GetContactsByTenantAdmin(int tenantId)
        {
            var tenantAdminList = IGeneric.GetAll(a => a.ContactTypes).Where(a => a.TenantId == tenantId && (a.RoleId == (int)Role.Admin || a.RoleId == (int)Role.User)).ToList();
            return MapAndAssignContactList(tenantAdminList);
        }

        public IEnumerable<ContactVM> GetContactsByUser(int userId)
        {
            var userList = IGeneric.GetAll(a => a.ContactTypes).Where(a => a.UserId == userId).ToList();
            return MapAndAssignContactList(userList);
        }

        public Contact AddContact(ContactVM contact)
        {
            var map = mapper.Map<Contact>(contact);
            IGeneric.Create(map);
            return map;
        }

        public Contact UpdateContact(ContactVM contact)
        {
            var map = mapper.Map<Contact>(contact);
            var date = db.Contacts.Where(a => a.Id == contact.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Contact DeleteContact(int ContId)
        {
            IGeneric.Delete(ContId);
            return null;
        }

        public Contact AddContactImportData(ImportExcel model, List<String> rowData)
        {
            string typeValue = rowData[2].Trim();
            var typeId = db.ContactTypes.Where(x => x.Type == typeValue).FirstOrDefault();
            rowData[2] = typeId != null ? Convert.ToString(typeId.Id) : null;

            var entity = new Contact
            {
                ContactName = rowData[0].Trim(),
                Account = rowData[1].Trim(),
                TypeId = rowData[2] != null ? Convert.ToInt32(rowData[2]) : null,
                Email = rowData[3].Trim(),
                MobileNumber = rowData[4].Trim(),
                Country = rowData[5].Trim(),
                JobTitle = "",
                CreatedOn = DateTime.Now,
                RoleId = model.RoleId,
                UserId = model.UserId,
                TenantId = model.TenantId
            };
            if (entity.RoleId == 0) entity.RoleId = null;
            if (entity.UserId == 0) entity.UserId = null;
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Contacts.Add(entity);

            return entity;
        }

        public IEnumerable<ContactVM> GetSampleDataByContact(XLWorkbook wb)
        {
            var sampleContacts = new List<ContactVM>
            {
                new ContactVM { ContactName = "Alex Hales", Account = "Ncoresoft Technologies", ContactTypes = new ContactType { Id = 1, Type = "Contact person" }, Email = "alex@example.com", MobileNumber = "1234567890", Country = "USA" },
                new ContactVM { ContactName = "Colin Munro", Email = "colin@example.com" }
            };

            var sheet = wb.Worksheets.Add("Contacts");

            sheet.Cell(1, 1).Value = "   " + "* Full name";
            sheet.Cell(1, 2).Value = "   " + "Account";
            sheet.Cell(1, 3).Value = "   " + "Type";
            sheet.Cell(1, 4).Value = "   " + "* Email";
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

            int rowIndex = 2;
            foreach (var contact in sampleContacts)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + contact.ContactName;
                sheet.Cell(rowIndex, 2).Value = "   " + contact.Account;
                sheet.Cell(rowIndex, 3).Value = "   " + contact.ContactTypes?.Type;
                sheet.Cell(rowIndex, 4).Value = "   " + contact.Email;
                sheet.Cell(rowIndex, 5).Value = "   " + contact.MobileNumber;
                sheet.Cell(rowIndex, 6).Value = "   " + contact.Country;
                rowIndex++;
            }

            return null;
        }

        private IEnumerable<ContactVM> MapAndAssignContactList(IEnumerable<Contact> contactList)
        {
            List<ContactVM> map = mapper.Map<List<ContactVM>>(contactList);
            return map.OrderByDescending(a => a.Id);
        }
    }
}