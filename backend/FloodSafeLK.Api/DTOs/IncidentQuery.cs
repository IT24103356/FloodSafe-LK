namespace FloodSafeLK.Api.DTOs;

public class IncidentQuery
{
    public string? Search { get; set; }
    public string? District { get; set; }
    public string? Severity { get; set; }
    public string? IncidentType { get; set; }
    public string SortBy { get; set; } = "date";
    public string SortDir { get; set; } = "desc";
}
