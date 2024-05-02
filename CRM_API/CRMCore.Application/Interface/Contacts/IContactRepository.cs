using ClosedXML.Excel;
using CRMCore.Application.Dto.Contacts;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.EntityFrameWorkCore.Model.Contacts;

namespace CRMCore.Application.Interface.Contacts
{
    public interface IContactRepository
    {
        IEnumerable<ContactVM> GetContacts();
        IEnumerable<ContactVM> GetContactsByTenant(int tenantId);
        IEnumerable<ContactVM> GetContactsByTenantAdmin(int tenantId);
        IEnumerable<ContactVM> GetContactsByUser(int userId);
        Contact AddContact(ContactVM contact);
        Contact UpdateContact(ContactVM contact);
        Contact DeleteContact(int ContId);
        Contact AddContactImportData(ImportExcel model, List<String> rowData);
        IEnumerable<ContactVM> GetSampleDataByContact(XLWorkbook wb);
    }
}
