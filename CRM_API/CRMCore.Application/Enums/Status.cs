using System.ComponentModel.DataAnnotations;

namespace CRMCore.Application.Enums
{
    public enum Status
    {
        [Display(Name = "Active")]
        Active,

        [Display(Name = "InActive")]
        InActive
    }
}
