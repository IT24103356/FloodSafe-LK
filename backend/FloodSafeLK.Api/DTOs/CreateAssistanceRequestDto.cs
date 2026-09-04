using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

public class CreateAssistanceRequestDto
{
    [Required(ErrorMessage = "Requester name is required.")]
    [MaxLength(100, ErrorMessage = "Name must not exceed 100 characters.")]
    public string RequesterName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    [RegularExpression(@"^(\+94|0)[0-9]{9}$", ErrorMessage = "Enter a valid Sri Lankan phone number (e.g. 0771234567 or +94771234567).")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "District is required.")]
    [MaxLength(50, ErrorMessage = "District must not exceed 50 characters.")]
    public string District { get; set; } = string.Empty;

    [Required(ErrorMessage = "Location is required.")]
    [MaxLength(200, ErrorMessage = "Location must not exceed 200 characters.")]
    public string Location { get; set; } = string.Empty;

    [Required(ErrorMessage = "Request type is required.")]
    [RegularExpression("^(Food|Water|Medical|Transport|Evacuation|Shelter|Other)$",
        ErrorMessage = "Invalid request type.")]
    public string RequestType { get; set; } = string.Empty;

    [Required(ErrorMessage = "Priority is required.")]
    [RegularExpression("^(Low|Medium|High|Critical)$", ErrorMessage = "Invalid priority.")]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MinLength(20, ErrorMessage = "Description must be at least 20 characters.")]
    [MaxLength(1000, ErrorMessage = "Description must not exceed 1000 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Number of people is required.")]
    [Range(1, 10000, ErrorMessage = "Number of people must be between 1 and 10,000.")]
    public int NumberOfPeople { get; set; }

    public bool IsSample { get; set; } = false;
}
