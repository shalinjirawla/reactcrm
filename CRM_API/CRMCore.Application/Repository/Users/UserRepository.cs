using AutoMapper;
using ClosedXML.Excel;
using CRMCore.Application.Dto.ImportExcel;
using CRMCore.Application.Dto.Users;
using CRMCore.Application.Interface.Generic;
using CRMCore.Application.Interface.Users;
using CRMCore.EntityFrameWorkCore;
using CRMCore.EntityFrameWorkCore.Model.Users;
using Role = CRMCore.Application.Enums.Role;

namespace CRMCore.Application.Repository.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly CRMCoreDbContext db;
        private readonly IMapper mapper;
        private readonly IGenericRepository<User> IGeneric;

        public UserRepository(CRMCoreDbContext context, IMapper _mapper, IGenericRepository<User> generic)
        {
            db = context;
            mapper = _mapper;
            IGeneric = generic;
        }

        public IEnumerable<UserVM> GetUsers()
        {
            var userList = IGeneric.GetAll(a => a.Roles).Where(x => x.RoleId == (int)Role.HostUser).ToList();
            List<UserVM> map = mapper.Map<List<UserVM>>(userList);

            //foreach (var item in map)
            //{
            //    System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            //    System.Text.Decoder utf8Decode = encoder.GetDecoder();
            //    byte[] todecode_byte = Convert.FromBase64String(item.Password);
            //    int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            //    char[] decoded_char = new char[charCount];
            //    utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            //    string result = new String(decoded_char);
            //    item.Password = result;
            //}

            return map.OrderByDescending(a => a.Id);
        }

        public IEnumerable<UserVM> GetUsersByTenant(int tenantId)
        {
            var tenantUserList = IGeneric.GetAll().Where(a => a.TenantId == tenantId).ToList();
            List<UserVM> map = mapper.Map<List<UserVM>>(tenantUserList);
            return map.OrderByDescending(a => a.Id);
        }

        public User AddUser(UserVM user)
        {
            var map = mapper.Map<User>(user);

            //map.Password = BCrypt.Net.BCrypt.HashPassword(map.Password);

            //byte[] encData_byte = new byte[map.Password.Length];
            //encData_byte = System.Text.Encoding.UTF8.GetBytes(map.Password);
            //string encodedData = Convert.ToBase64String(encData_byte);
            //map.Password = encodedData;

            IGeneric.Create(map);
            return map;
        }

        public User UpdateUser(UserVM user)
        {
            var map = mapper.Map<User>(user);
            var date = db.Users.Where(a => a.Id == user.Id).FirstOrDefault();
            map.CreatedOn = date?.CreatedOn;

            //byte[] encData_byte = new byte[map.Password.Length];
            //encData_byte = System.Text.Encoding.UTF8.GetBytes(map.Password);
            //string encodedData = Convert.ToBase64String(encData_byte);
            //map.Password = encodedData;

            IGeneric.Update(map);
            return map;
        }

        public User DeleteUser(int UId)
        {
            IGeneric.Delete(UId);
            return null;
        }

        public User AddUserImportData(ImportExcel model, List<String> rowData)
        {
            var entity = new User
            {
                Name = rowData[0].Trim(),
                Password = rowData[1].Trim(),
                Email = rowData[2].Trim(),
                MobileNumber = rowData[3].Trim(),
                CreatedOn = DateTime.Now,
                RoleId = (int)model.RoleId,
                TenantId = model.TenantId
            };
            if (entity.TenantId == 0) entity.TenantId = null;
            db.Users.Add(entity);
            return entity;
        }

        public IEnumerable<UserVM> GetSampleDataByUser(XLWorkbook wb)
        {
            var sampleUsers = new List<UserVM>
            {
                new UserVM { Name = "Keval Trivedi", Password = "keval@123", Email = "keval123@gmail.com", MobileNumber = "9878455615" },
                new UserVM { Name = "Jay Golakiya", Password = "jay@123", Email = "jay123@gmail.com", MobileNumber = "7845561223" }
            };

            var sheet = wb.Worksheets.Add("Users");

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
            foreach (var employee in sampleUsers)
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
