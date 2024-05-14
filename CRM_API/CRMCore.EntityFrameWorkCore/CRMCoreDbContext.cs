using CRMCore.EntityFrameWorkCore.Model.Accounts;
using CRMCore.EntityFrameWorkCore.Model.Contacts;
using CRMCore.EntityFrameWorkCore.Model.Leads;
using CRMCore.EntityFrameWorkCore.Model.Opportunities;
using CRMCore.EntityFrameWorkCore.Model.Tasks;
using CRMCore.EntityFrameWorkCore.Model.Tenants;
using CRMCore.EntityFrameWorkCore.Model.Users;
using Microsoft.EntityFrameworkCore;

namespace CRMCore.EntityFrameWorkCore
{
    public class CRMCoreDbContext : DbContext
    {
        public CRMCoreDbContext(DbContextOptions<CRMCoreDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<ContactType> ContactTypes { get; set; }

        public DbSet<Model.Tasks.Task> Tasks { get; set; }
        public DbSet<TaskCategory> TaskCategories { get; set; }
        public DbSet<Model.Tasks.TaskStatus> TaskStatuses { get; set; }

        public DbSet<Opportunity> Opportunities { get; set; }
        public DbSet<OpportunityStage> OpportunityStages { get; set; }
        public DbSet<OpportunitySalesChannel> OpportunitySalesChannels { get; set; }

        public DbSet<Lead> Leads { get; set; }
        public DbSet<LeadCustomerNeed> LeadCustomerNeeds { get; set; }
        public DbSet<LeadStatus> LeadStatuses { get; set; }
        public DbSet<LeadType> LeadTypes { get; set; }
        public DbSet<LeadStage> LeadStages { get; set; }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountType> AccountTypes { get; set; }
        public DbSet<AccountCategory> AccountCategories { get; set; }
        public DbSet<AccoutIndustry> AccoutIndustries { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "HostAdmin", Password = "hostadmin", Email = "hostadmin@gmail.com", MobileNumber = "1234567890", RoleId = 1 }
            );

            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }
    }
}
