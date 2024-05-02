using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Tenants;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Interface.Tenants;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Tenants;

namespace CRMCore.Application.Repository.Tenants
{
    public class TenantRepository : ITenantRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<Tenant> IGeneric;

        public TenantRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<Tenant> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<TenantVM> GetTenants()
        {
            var tenantList = IGeneric.GetAll().ToList();
            List<TenantVM> map = mapper.Map<List<TenantVM>>(tenantList);
            return map.OrderByDescending(a => a.Id);
        }

        public Tenant AddTenant(TenantVM tenant)
        {
            var map = mapper.Map<Tenant>(tenant);
            map.IsActive = true;
            IGeneric.Create(map);
            return map;
        }

        public Tenant UpdateTenant(TenantVM tenant)
        {
            var map = mapper.Map<Tenant>(tenant);
            map.IsEmailVerified = true;
            var date = db.Tenants.Where(a => a.Id == tenant.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;
            IGeneric.Update(map);
            return map;
        }

        public Tenant DeleteTenant(int TntId)
        {
            IGeneric.Delete(TntId);
            return null;
        }

        public Tenant AddTenantImportData(ImportExcel model, List<String> rowData)
        {
            var entity = new Tenant
            {
                Name = rowData[0].Trim(),
                Password = rowData[1].Trim(),
                Email = rowData[2].Trim(),
                MobileNumber = rowData[3].Trim(),
                IsActive = true,
                IsEmailVerified = false,
                CreatedOn = DateTime.Now
            };
            db.Tenants.Add(entity);
            return entity;
        }

        public IEnumerable<TenantVM> GetSampleDataByTenant(XLWorkbook wb)
        {
            var sampleTenants = new List<TenantVM>
            {
                new TenantVM { Name = "Ncoresoft", Password = "ncoresoft@123", Email = "ncoresoft123@gmail.com", MobileNumber = "9989784562" },
                new TenantVM { Name = "Ncore", Password = "ncore@123", Email = "ncore123@gmail.com", MobileNumber = "8756457896" }
            };

            var sheet = wb.Worksheets.Add("Tenants");

            sheet.Cell(1, 1).Value = "   " + "* Name";
            sheet.Cell(1, 2).Value = "   " + "* Password";
            sheet.Cell(1, 3).Value = "   " + "* Email";
            sheet.Cell(1, 4).Value = "   " + "* Mobile number";

            var headerRange = sheet.Range("A1:D1");
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Font.FontColor = XLColor.White;
            headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#2276e3");

            sheet.Column(1).Width = 45;
            sheet.Column(2).Width = 35;
            sheet.Column(3).Width = 25;
            sheet.Column(4).Width = 25;

            int rowIndex = 2;
            foreach (var employee in sampleTenants)
            {
                sheet.Cell(rowIndex, 1).Value = "   " + employee.Name;
                sheet.Cell(rowIndex, 2).Value = "   " + employee.Password;
                sheet.Cell(rowIndex, 3).Value = "   " + employee.Email;
                sheet.Cell(rowIndex, 4).Value = "   " + employee.MobileNumber;
                rowIndex++;
            }

            return null;
        }
    }
}
