using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Users;
using CRMCore.EntityFrameWorkCore.Model.Users;

namespace CRMCore.Application.Interface.Roles
{
    public interface IRoleRepository
    {
        IEnumerable<UserRoleVM> GetRoles();
        UserRole AddRole(UserRoleVM role);
        UserRole UpdateRole(UserRoleVM role);
        UserRole DeleteRole(int roleId);
        UserRole AddUserRoleImportData(ImportExcel model, List<String> rowData);
        IEnumerable<UserRoleVM> GetSampleDataByUserRole(XLWorkbook wb);
    }
}
