using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Opportunities;
using CRMCore.Application.Enums;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Interface.Opportunities;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Opportunities;

namespace CRMCore.Application.Repository.Opportunities
{
    public class OpportunityRepository : IOpportunityRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Opportunity> IGeneric;

        public OpportunityRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Opportunity> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<OpportunityVM> GetOpportunities()
        {
            var oppotunityList = IGeneric.GetAll(a => a.OpportunityStages, a => a.OpportunitySalesChannels).Where(a => a.RoleId == (int)Role.HostAdmin || a.RoleId == (int)Role.HostUser).ToList();
            return MapAndAssignOpportunityList(oppotunityList);
        }

        public IEnumerable<OpportunityVM> GetOpportunitiesByTenant(int tenantId)
        {
            var tenantList = IGeneric.GetAll(a => a.OpportunityStages, a => a.OpportunitySalesChannels).Where(a => a.TenantId == tenantId).ToList();
            return MapAndAssignOpportunityList(tenantList);
        }

        public IEnumerable<OpportunityVM> GetOpportunitiesByTenantAdmin(int tenantId)
        {
            var tenantAdminList = IGeneric.GetAll(a => a.OpportunityStages, a => a.OpportunitySalesChannels).Where(a => a.TenantId == tenantId && (a.RoleId == (int)Role.Admin || a.RoleId == (int)Role.User)).ToList();
            return MapAndAssignOpportunityList(tenantAdminList);
        }

        public IEnumerable<OpportunityVM> GetOpportunitiesByUser(int userId)
        {
            var userList = IGeneric.GetAll(a => a.OpportunityStages, a => a.OpportunitySalesChannels).Where(a => a.UserId == userId).ToList();
            return MapAndAssignOpportunityList(userList);
        }

        public Opportunity AddOpportunity(OpportunityVM opportunity)
        {
            var map = mapper.Map<Opportunity>(opportunity);
            IGeneric.Create(map);
            return map;
        }

        public Opportunity UpdateOpportunity(OpportunityVM opportunity)
        {
            var map = mapper.Map<Opportunity>(opportunity);
            var date = db.Opportunities.Where(a => a.Id == opportunity.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Opportunity DeleteOpportunity(int OppId)
        {
            IGeneric.Delete(OppId);
            return null;
        }

        public Opportunity AddOpportunityImportData(ImportExcel model, List<String> rowData)
        {
            string stageValue = rowData[3].Trim();
            string salesChannelValue = rowData[4].Trim();

            var stageId = db.OpportunityStages.Where(x => x.Stage == stageValue).FirstOrDefault();
            var salesChannelId = db.OpportunitySalesChannels.Where(x => x.SalesChannel == salesChannelValue).FirstOrDefault();

            rowData[3] = stageId != null ? Convert.ToString(stageId.Id) : null;
            rowData[4] = salesChannelId != null ? Convert.ToString(salesChannelId.Id) : null;
            rowData[5] = rowData[5].Trim();
            rowData[6] = rowData[6].Trim();

            var entity = new Opportunity
            {
                Name = rowData[0].Trim(),
                Contact = rowData[1].Trim(),
                Account = rowData[2].Trim(),
                StageId = rowData[3] != null ? Convert.ToInt32(rowData[3]) : 12,
                SalesChannelId = rowData[4] != null ? Convert.ToInt32(rowData[4]) : null,
                ContractValue = rowData[5] != "" ? Convert.ToInt32(rowData[5]) : 0,
                CloseDate = rowData[6] != "" ? Convert.ToDateTime(rowData[6]) : null,
                Description = "",
                CreatedOn = DateTime.Now,
                RoleId = model.RoleId,
                UserId = model.UserId,
                TenantId = model.TenantId
            };
            if (entity.RoleId == 0) entity.RoleId = null;
            if (entity.UserId == 0) entity.UserId = null;
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Opportunities.Add(entity);

            return entity;
        }

        public IEnumerable<OpportunityVM> GetSampleDataByOpportunity(XLWorkbook wb)
        {
            var sampleOpportunities = new List<OpportunityVM>
            {
                new OpportunityVM { Name = "001 / Ncoresoft Technologies / Sale of Goods", Contact = "Alex Hales", Account = "Ncoresoft Technologies", OpportunityStages = new OpportunityStage { Id = 1, Stage = "Closed lost" }, OpportunitySalesChannels = new OpportunitySalesChannel { Id = 1, SalesChannel = "Direct sale" }, ContractValue = 50000, CloseDate = DateTime.Parse("2024-06-10") },
                new OpportunityVM { Name = "002 / Ncore Business / Sale of Services", Contact = "Colin Munro", OpportunityStages = new OpportunityStage { Id = 2, Stage = "Closed rejected" } }
            };

            var sheet = wb.Worksheets.Add("Opportunities");

            sheet.Cell(1, 1).Value = "   " + "* Name";
            sheet.Cell(1, 2).Value = "   " + "* Contact";
            sheet.Cell(1, 3).Value = "   " + "Account";
            sheet.Cell(1, 4).Value = "   " + "* Stage";
            sheet.Cell(1, 5).Value = "   " + "Sales channel";
            sheet.Cell(1, 6).Value = "   " + "Total contract value";
            sheet.Cell(1, 7).Value = "   " + "Expected close date";

            var headerRange = sheet.Range("A1:G1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

            sheet.Column(1).Width = 55;
            sheet.Column(2).Width = 35;
            sheet.Column(3).Width = 35;
            sheet.Column(4).Width = 25;
            sheet.Column(5).Width = 25;
            sheet.Column(6).Width = 25;
            sheet.Column(7).Width = 25;

            int rowIndex = 2;
            foreach (var employee in sampleOpportunities)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + employee.Name;
                sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                sheet.Cell(rowIndex, 3).Value = "   " + employee.Account;
                sheet.Cell(rowIndex, 4).Value = "   " + employee.OpportunityStages?.Stage;
                sheet.Cell(rowIndex, 5).Value = "   " + employee.OpportunitySalesChannels?.SalesChannel;
                sheet.Cell(rowIndex, 6).Value = "   " + employee.ContractValue;
                sheet.Cell(rowIndex, 7).Value = "   " + employee.CloseDate;
                rowIndex++;
            }

            return null;
        }

        private IEnumerable<OpportunityVM> MapAndAssignOpportunityList(IEnumerable<Opportunity> oppotunityList)
        {
            List<OpportunityVM> map = mapper.Map<List<OpportunityVM>>(oppotunityList);
            return map.OrderByDescending(a => a.Id);
        }
    }
}
