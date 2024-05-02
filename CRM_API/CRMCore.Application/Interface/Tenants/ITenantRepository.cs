using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Tenants;

namespace CRMCore.Application.Interface.Tenants
{
    public interface ITenantRepository
    {
        IEnumerable<TenantVM> GetTenants();
        Tenant AddTenant(TenantVM tenant);
        Tenant UpdateTenant(TenantVM tenant);
        Tenant DeleteTenant(int TntId);
        Tenant AddTenantImportData(ImportExcel model, List<String> rowData);
        IEnumerable<TenantVM> GetSampleDataByTenant(XLWorkbook wb);
    }
}
