using AutoMapper;
using CRMCore.Application.Interface.Leads;
using CRMCore.EntityFrameWorkCore;
using CRMCore.Application.Dto.Leads;
using CRMCore.EntityFrameWorkCore.Model.Leads;
using CRMCore.Application.Dto.ImportExcel;
using ClosedXML.Excel;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Enums;

namespace CRMCore.Application.Repository.Leads
{
    public class LeadRepository : ILeadRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Lead> IGeneric;

        public LeadRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Lead> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<LeadVM> GetLeads()
        {
            var leadList = IGeneric.GetAll(a => a.LeadCustomerNeeds, a => a.LeadStatuses, a => a.LeadTypes, a => a.LeadStages).Where(a => a.RoleId == (int)Role.HostAdmin || a.RoleId == (int)Role.HostUser).ToList();
            return MapAndAssignLeadList(leadList);
        }

        public IEnumerable<LeadVM> GetLeadsByTenant(int tenantId)
        {
            var tenantList = IGeneric.GetAll(a => a.LeadCustomerNeeds, a => a.LeadStatuses, a => a.LeadTypes, a => a.LeadStages).Where(a => a.TenantId == tenantId).ToList();
            return MapAndAssignLeadList(tenantList);
        }

        public IEnumerable<LeadVM> GetLeadsByTenantAdmin(int tenantId)
        {
            var tenantAdminList = IGeneric.GetAll(a => a.LeadCustomerNeeds, a => a.LeadStatuses, a => a.LeadTypes, a => a.LeadStages).Where(a => a.TenantId == tenantId && (a.RoleId == (int)Role.Admin || a.RoleId == (int)Role.User)).ToList();
            return MapAndAssignLeadList(tenantAdminList);
        }

        public IEnumerable<LeadVM> GetLeadsByUser(int userId)
        {
            var userList = IGeneric.GetAll(a => a.LeadCustomerNeeds, a => a.LeadStatuses, a => a.LeadTypes, a => a.LeadStages).Where(a => a.UserId == userId).ToList();
            return MapAndAssignLeadList(userList);
        }

        public Lead AddLead(LeadVM lead)
        {
            var map = mapper.Map<Lead>(lead);
            IGeneric.Create(map);
            return map;
        }

        public Lead UpdateLead(LeadVM lead)
        {
            var map = mapper.Map<Lead>(lead);
            var date = db.Leads.Where(a => a.Id == lead.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Lead DeleteLead(int LeadId)
        {
            IGeneric.Delete(LeadId);
            return null;
        }

        public Lead AddLeadImportData(ImportExcel model, List<String> rowData)
        {
            string customerNeedValue = rowData[0].Trim().Split(" / ")[0];
            string statusValue = rowData[3].Trim();
            string typeValue = rowData[4].Trim();
            string stageValue = rowData[5].Trim();

            var customerNeedId = db.LeadCustomerNeeds.Where(x => x.CustomerNeed == customerNeedValue).FirstOrDefault();
            var statusId = db.LeadStatuses.Where(x => x.Status == statusValue).FirstOrDefault();
            var typeId = db.LeadTypes.Where(x => x.Type == typeValue).FirstOrDefault();
            var stageId = db.LeadStages.Where(x => x.Stage == stageValue).FirstOrDefault();

            rowData[0] = customerNeedId != null ? Convert.ToString(customerNeedId.Id) : null;
            rowData[3] = statusId != null ? Convert.ToString(statusId.Id) : null;
            rowData[4] = typeId != null ? Convert.ToString(typeId.Id) : null;
            rowData[5] = stageId != null ? Convert.ToString(stageId.Id) : null;

            var entity = new Lead
            {
                CustomerNeedId = rowData[0] != null ? Convert.ToInt32(rowData[0]) : 1,
                Contact = rowData[1].Trim(),
                Account = rowData[2].Trim(),
                StatusId = rowData[3] != null ? Convert.ToInt32(rowData[3]) : null,
                TypeId = rowData[4] != null ? Convert.ToInt32(rowData[4]) : null,
                StageId = rowData[5] != null ? Convert.ToInt32(rowData[5]) : null,
                Comments = "",
                CreatedOn = DateTime.Now,
                RoleId = model.RoleId,
                UserId = model.UserId,
                TenantId = model.TenantId
            };
            if (entity.RoleId == 0) entity.RoleId = null;
            if (entity.UserId == 0) entity.UserId = null;
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Leads.Add(entity);

            return entity;
        }

        public IEnumerable<LeadVM> GetSampleDataByLead(XLWorkbook wb)
        {
            var sampleLeads = new List<LeadVM>
            {
                new LeadVM { LeadCustomerNeeds = new LeadCustomerNeed { Id = 1, CustomerNeed = "Additional service" }, Contact = "Alex Hales", Account = "Ncoresoft Technologies", LeadStatuses = new LeadStatus { Id = 1, Status = "Contacted" }, LeadTypes = new LeadType { Id = 1, Type = "Added manually" }, LeadStages = new LeadStage { Id = 1, Stage = "Awaiting sale" }, CreatedOn = DateTime.Now },
                new LeadVM { LeadCustomerNeeds = new LeadCustomerNeed { Id = 2, CustomerNeed = "Bulk email management system" }, Contact = "Colin Munro", Account = "" }
            };

            var sheet = wb.Worksheets.Add("Leads");

            sheet.Cell(1, 1).Value = "   " + "* Name";
            sheet.Cell(1, 2).Value = "   " + "* Contact";
            sheet.Cell(1, 3).Value = "   " + "Account";
            sheet.Cell(1, 4).Value = "   " + "Status";
            sheet.Cell(1, 5).Value = "   " + "Lead type";
            sheet.Cell(1, 6).Value = "   " + "Stage";
            sheet.Cell(1, 7).Value = "   " + "Created on";

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
            foreach (var employee in sampleLeads)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + employee.LeadCustomerNeeds?.CustomerNeed + " / " + employee.Contact + (employee.Account != "" ? (", " + employee.Account) : "");
                sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                sheet.Cell(rowIndex, 3).Value = "   " + employee.Account;
                sheet.Cell(rowIndex, 4).Value = "   " + employee.LeadStatuses?.Status;
                sheet.Cell(rowIndex, 5).Value = "   " + employee.LeadTypes?.Type;
                sheet.Cell(rowIndex, 6).Value = "   " + employee.LeadStages?.Stage;
                sheet.Cell(rowIndex, 7).Value = "   " + employee.CreatedOn;
                rowIndex++;
            }

            return null;
        }

        private IEnumerable<LeadVM> MapAndAssignLeadList(IEnumerable<Lead> tenantList)
        {
            List<LeadVM> map = mapper.Map<List<LeadVM>>(tenantList);
            return map.OrderByDescending(a => a.Id);
        }
    }
}
