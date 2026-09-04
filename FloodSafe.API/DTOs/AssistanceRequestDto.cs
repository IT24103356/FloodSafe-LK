namespace FloodSafe.API.DTOs;

public class AssistanceRequestDto
{
    public int Id { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string RequestType { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int NumberOfPeople { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsSample { get; set; }
}
