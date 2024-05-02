using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Opportunities;
using CRMCore.EntityFrameWorkCore.Model.Opportunities;

namespace CRMCore.Application.Interface.Opportunities
{
    public interface IOpportunityRepository
    {
        IEnumerable<OpportunityVM> GetOpportunities();
        IEnumerable<OpportunityVM> GetOpportunitiesByTenant(int tenantId);
        IEnumerable<OpportunityVM> GetOpportunitiesByTenantAdmin(int tenantId);
        IEnumerable<OpportunityVM> GetOpportunitiesByUser(int userId);
        Opportunity AddOpportunity(OpportunityVM opportunity);
        Opportunity UpdateOpportunity(OpportunityVM opportunity);
        Opportunity DeleteOpportunity(int OppId);
        Opportunity AddOpportunityImportData(ImportExcel model, List<String> rowData);
        IEnumerable<OpportunityVM> GetSampleDataByOpportunity(XLWorkbook wb);
    }
}
