using Microsoft.AspNetCore.Http;

namespace CRMCore.Application.Dto.ImportExcel
{
    public class ImportExcel
    {
        public string Module { get; set; }
        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }
        public IFormFile File { get; set; }
    }
}
