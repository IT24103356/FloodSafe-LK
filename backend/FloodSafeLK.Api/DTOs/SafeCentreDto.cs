namespace FloodSafeLK.Api.DTOs;

/// <summary>
/// Response DTO returned to the client for a SafeCentre.
/// Includes the computed AvailableSpaces field.
/// </summary>
public class SafeCentreDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int CurrentOccupancy { get; set; }
    public int AvailableSpaces { get; set; }
    public string Facilities { get; set; } = string.Empty;
    public bool Availability { get; set; }
    public DateTime OpeningDate { get; set; }
    public string Notes { get; set; } = string.Empty;
    public bool IsSample { get; set; }
}
