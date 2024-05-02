using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Leads;
using CRMCore.EntityFrameWorkCore.Model.Leads;

namespace CRMCore.Application.Interface.Leads
{
    public interface ILeadRepository
    {
        IEnumerable<LeadVM> GetLeads();
        IEnumerable<LeadVM> GetLeadsByTenant(int tenantId);
        IEnumerable<LeadVM> GetLeadsByTenantAdmin(int tenantId);
        IEnumerable<LeadVM> GetLeadsByUser(int userId);
        Lead AddLead(LeadVM lead);
        Lead UpdateLead(LeadVM lead);
        Lead DeleteLead(int LeadId);
        Lead AddLeadImportData(ImportExcel model, List<String> rowData);
        IEnumerable<LeadVM> GetSampleDataByLead(XLWorkbook wb);
    }
}
