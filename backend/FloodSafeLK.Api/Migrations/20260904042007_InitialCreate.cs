using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FloodSafeLK.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Incidents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ReporterName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    District = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    IncidentType = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    Severity = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    DateTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    WaterLevel = table.Column<decimal>(type: "numeric(8,2)", precision: 8, scale: 2, nullable: false),
                    AffectedPeople = table.Column<int>(type: "integer", nullable: false),
                    RoadAccessibility = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RiskScore = table.Column<int>(type: "integer", nullable: false),
                    RiskLevel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IsSample = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Incidents", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_DateTime",
                table: "Incidents",
                column: "DateTime");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_District",
                table: "Incidents",
                column: "District");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_IncidentType",
                table: "Incidents",
                column: "IncidentType");

            migrationBuilder.CreateIndex(
                name: "IX_Incidents_Severity",
                table: "Incidents",
                column: "Severity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Incidents");
        }
    }
}
