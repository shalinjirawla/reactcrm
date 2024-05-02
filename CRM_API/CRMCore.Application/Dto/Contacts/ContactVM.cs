using CRMCore.EntityFrameWorkCore.Model.Contacts;

namespace CRMCore.Application.Dto.Contacts
{
    public class ContactVM
    {
        public int Id { get; set; }
        public string ContactName { get; set; }
        public string? Account { get; set; }
        public string? JobTitle { get; set; }
        public string Email { get; set; }
        public string? MobileNumber { get; set; }
        public string? Country { get; set; }
        public DateTime? CreatedOn { get; set; }

        public int? TypeId { get; set; }
        public virtual ContactType? ContactTypes { get; set; }

        public int? RoleId { get; set; }
        public int? UserId { get; set; }
        public int? TenantId { get; set; }
    }
}
