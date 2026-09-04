using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FloodSafeLK.Api.Models;

[Table("Incidents")]
public class Incident
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string ReporterName { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string District { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [MaxLength(40)]
    public string IncidentType { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Severity { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public DateTimeOffset DateTime { get; set; }

    [Column(TypeName = "numeric(8,2)")]
    public decimal WaterLevel { get; set; }

    public int AffectedPeople { get; set; }

    [Required]
    [MaxLength(20)]
    public string RoadAccessibility { get; set; } = string.Empty;

    public int RiskScore { get; set; }

    [Required]
    [MaxLength(20)]
    public string RiskLevel { get; set; } = string.Empty;

    public bool IsSample { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
