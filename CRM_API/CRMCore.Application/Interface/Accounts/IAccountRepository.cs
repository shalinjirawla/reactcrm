using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.EntityFrameWorkCore.Model.Accounts;

namespace CRMCore.Application.Interface.Accounts
{
    public interface IAccountRepository
    {
        IEnumerable<AccountVM> GetAccounts();
        IEnumerable<AccountVM> GetAccountsByTenant(int tenantId);
        IEnumerable<AccountVM> GetAccountsByTenantAdmin(int tenantId);
        IEnumerable<AccountVM> GetAccountsByUser(int userId);
        Account AddAccount(AccountVM account);
        Account UpdateAccount(AccountVM account);
        Account DeleteAccount(int ActId);
        Account AddAccountImportData(ImportExcel model, List<String> rowData);
        IEnumerable<AccountVM> GetSampleDataByAccount(XLWorkbook wb);
    }
}
