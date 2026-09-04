using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

public class UpdateAssistanceRequestDto
{
    [MaxLength(200, ErrorMessage = "Location must not exceed 200 characters.")]
    public string? Location { get; set; }

    [RegularExpression("^(Food|Water|Medical|Transport|Evacuation|Shelter|Other)$",
        ErrorMessage = "Invalid request type.")]
    public string? RequestType { get; set; }

    [RegularExpression("^(Low|Medium|High|Critical)$", ErrorMessage = "Invalid priority.")]
    public string? Priority { get; set; }

    [MinLength(20, ErrorMessage = "Description must be at least 20 characters.")]
    [MaxLength(1000, ErrorMessage = "Description must not exceed 1000 characters.")]
    public string? Description { get; set; }

    [Range(1, 10000, ErrorMessage = "Number of people must be between 1 and 10,000.")]
    public int? NumberOfPeople { get; set; }

    [RegularExpression("^(Pending|InProgress|Resolved)$", ErrorMessage = "Invalid status.")]
    public string? Status { get; set; }
}
