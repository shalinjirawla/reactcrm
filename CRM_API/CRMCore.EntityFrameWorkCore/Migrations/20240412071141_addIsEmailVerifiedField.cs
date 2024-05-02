using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMCore.EntityFrameWorkCore.Migrations
{
    public partial class addIsEmailVerifiedField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsEmailVerified",
                table: "Tenants",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEmailVerified",
                table: "Tenants");
        }
    }
}
