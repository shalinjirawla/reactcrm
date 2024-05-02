using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMCore.EntityFrameWorkCore.Migrations
{
    public partial class addCustomerNeedField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerNeed",
                table: "Leads");

            migrationBuilder.AddColumn<int>(
                name: "CustomerNeedId",
                table: "Leads",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "LeadCustomerNeeds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerNeed = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeadCustomerNeeds", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Leads_CustomerNeedId",
                table: "Leads",
                column: "CustomerNeedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Leads_LeadCustomerNeeds_CustomerNeedId",
                table: "Leads",
                column: "CustomerNeedId",
                principalTable: "LeadCustomerNeeds",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Leads_LeadCustomerNeeds_CustomerNeedId",
                table: "Leads");

            migrationBuilder.DropTable(
                name: "LeadCustomerNeeds");

            migrationBuilder.DropIndex(
                name: "IX_Leads_CustomerNeedId",
                table: "Leads");

            migrationBuilder.DropColumn(
                name: "CustomerNeedId",
                table: "Leads");

            migrationBuilder.AddColumn<string>(
                name: "CustomerNeed",
                table: "Leads",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
