using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.Accounts;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Enums;
using CRMCore.Application.Interface.Accounts;
using CRMCore.Application.Interface.Generic;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Accounts;

namespace CRMCore.Application.Repository.Accounts
{
    public class AccountRepository : IAccountRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Account> IGeneric;

        public AccountRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Account> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<AccountVM> GetAccounts()
        {
            var accountList = IGeneric.GetAll(a => a.AccountTypes, a => a.AccountCategories, a => a.AccoutIndustries).Where(a => a.RoleId == (int)Role.HostAdmin || a.RoleId == (int)Role.HostUser).ToList();
            return MapAndAssignAccountList(accountList);
        }

        public IEnumerable<AccountVM> GetAccountsByTenant(int tenantId)
        {
            var tenantList = IGeneric.GetAll(a => a.AccountTypes, a => a.AccountCategories, a => a.AccoutIndustries).Where(a => a.TenantId == tenantId).ToList();
            return MapAndAssignAccountList(tenantList);
        }

        public IEnumerable<AccountVM> GetAccountsByTenantAdmin(int tenantId)
        {
            var tenantAdminList = IGeneric.GetAll(a => a.AccountTypes, a => a.AccountCategories, a => a.AccoutIndustries).Where(a => a.TenantId == tenantId && (a.RoleId == (int)Role.Admin || a.RoleId == (int)Role.User)).ToList();
            return MapAndAssignAccountList(tenantAdminList);
        }

        public IEnumerable<AccountVM> GetAccountsByUser(int userId)
        {
            var userList = IGeneric.GetAll(a => a.AccountTypes, a => a.AccountCategories, a => a.AccoutIndustries).Where(a => a.UserId == userId).ToList();
            return MapAndAssignAccountList(userList);
        }

        public Account AddAccount(AccountVM account)
        {
            var map = mapper.Map<Account>(account);
            IGeneric.Create(map);
            return map;
        }

        public Account UpdateAccount(AccountVM account)
        {
            var map = mapper.Map<Account>(account);
            var date = db.Accounts.Where(a => a.Id == account.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Account DeleteAccount(int ActId)
        {
            IGeneric.Delete(ActId);
            return null;
        }

        public Account AddAccountImportData(ImportExcel model, List<String> rowData)
        {
            string typeValue = rowData[2].Trim();
            string categoryValue = rowData[3].Trim();
            string industryValue = rowData[4].Trim();

            var typeId = db.AccountTypes.Where(x => x.Type == typeValue).FirstOrDefault();
            var categoryId = db.AccountCategories.Where(x => x.Category == categoryValue).FirstOrDefault();
            var industryId = db.AccoutIndustries.Where(x => x.Industry == industryValue).FirstOrDefault();

            rowData[2] = typeId != null ? Convert.ToString(typeId.Id) : null;
            rowData[3] = categoryId != null ? Convert.ToString(categoryId.Id) : null;
            rowData[4] = industryId != null ? Convert.ToString(industryId.Id) : null;

            var entity = new Account
            {
                AccountName = rowData[0].Trim(),
                Contact = rowData[1].Trim(),
                TypeId = rowData[2] != null ? Convert.ToInt32(rowData[2]) : null,
                CategoryId = rowData[3] != null ? Convert.ToInt32(rowData[3]) : null,
                IndustryId = rowData[4] != null ? Convert.ToInt32(rowData[4]) : null,
                Web = rowData[5].Trim(),
                Country = rowData[6].Trim(),
                MobileNumber = "",
                CreatedOn = DateTime.Now,
                RoleId = model.RoleId,
                UserId = model.UserId,
                TenantId = model.TenantId
            };
            if (entity.RoleId == 0) entity.RoleId = null;
            if (entity.UserId == 0) entity.UserId = null;
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Accounts.Add(entity);

            return entity;
        }

        public IEnumerable<AccountVM> GetSampleDataByAccount(XLWorkbook wb)
        {
            var sampleAccounts = new List<AccountVM>
            {
                new AccountVM { AccountName = "Ncoresoft Technologies", Contact = "Alex Hales", AccountTypes = new AccountType { Id = 1, Type = "Competitor" }, AccountCategories = new AccountCategory { Id = 1, Category = "A" }, AccoutIndustries = new AccoutIndustry { Id = 1, Industry = "Advertising" }, Web = "https://ncoresoft.com/", Country = "India", CreatedOn = DateTime.Now },
                new AccountVM { AccountName = "Ncore Business" }
            };

            var sheet = wb.Worksheets.Add("Accounts");

            sheet.Cell(1, 1).Value = "   " + "* Name";
            sheet.Cell(1, 2).Value = "   " + "Primary contact";
            sheet.Cell(1, 3).Value = "   " + "Type";
            sheet.Cell(1, 4).Value = "   " + "Category";
            sheet.Cell(1, 5).Value = "   " + "Industry";
            sheet.Cell(1, 6).Value = "   " + "Web";
            sheet.Cell(1, 7).Value = "   " + "Country";
            sheet.Cell(1, 8).Value = "   " + "Created on";

            var headerRange = sheet.Range("A1:H1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

            sheet.Column(1).Width = 45;
            sheet.Column(2).Width = 35;
            sheet.Column(3).Width = 25;
            sheet.Column(4).Width = 25;
            sheet.Column(5).Width = 35;
            sheet.Column(6).Width = 50;
            sheet.Column(7).Width = 35;
            sheet.Column(8).Width = 25;

            int rowIndex = 2;
            foreach (var employee in sampleAccounts)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + employee.AccountName;
                sheet.Cell(rowIndex, 2).Value = "   " + employee.Contact;
                sheet.Cell(rowIndex, 3).Value = "   " + employee.AccountTypes?.Type;
                sheet.Cell(rowIndex, 4).Value = "   " + employee.AccountCategories?.Category;
                sheet.Cell(rowIndex, 5).Value = "   " + employee.AccoutIndustries?.Industry;
                sheet.Cell(rowIndex, 6).Value = "   " + employee.Web;
                sheet.Cell(rowIndex, 7).Value = "   " + employee.Country;
                sheet.Cell(rowIndex, 8).Value = "   " + employee.CreatedOn;
                rowIndex++;
            }

            return null;
        }

        private IEnumerable<AccountVM> MapAndAssignAccountList(IEnumerable<Account> accountList)
        {
            List<AccountVM> map = mapper.Map<List<AccountVM>>(accountList);
            return map.OrderByDescending(a => a.Id);
        }
    }
}