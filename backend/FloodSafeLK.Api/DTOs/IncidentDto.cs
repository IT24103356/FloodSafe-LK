namespace FloodSafeLK.Api.DTOs;

public class IncidentDto
{
    public Guid Id { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string IncidentType { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTimeOffset DateTime { get; set; }
    public decimal WaterLevel { get; set; }
    public int AffectedPeople { get; set; }
    public string RoadAccessibility { get; set; } = string.Empty;
    public int RiskScore { get; set; }
    public string RiskLevel { get; set; } = string.Empty;
    public bool IsSample { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
