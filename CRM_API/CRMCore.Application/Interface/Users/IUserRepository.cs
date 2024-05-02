using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Users;
using CRMCore.EntityFrameWorkCore.Model.Users;

namespace CRMCore.Application.Interface.Users
{
    public interface IUserRepository
    {
        IEnumerable<UserVM> GetUsers();
        IEnumerable<UserVM> GetUsersByTenant(int tenantId);
        User AddUser(UserVM user);
        User UpdateUser(UserVM user);
        User DeleteUser(int UId);
        User AddUserImportData(ImportExcel model, List<String> rowData);
        IEnumerable<UserVM> GetSampleDataByUser(XLWorkbook wb);
    }
}
