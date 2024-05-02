using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMCore.EntityFrameWorkCore.Migrations
{
    public partial class addIsEmailVerificationTokenField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VerificationToken",
                table: "Tenants",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VerificationToken",
                table: "Tenants");
        }
    }
}
