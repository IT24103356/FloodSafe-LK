using System.ComponentModel.DataAnnotations;
using FloodSafeLK.Api.Validation;

namespace FloodSafeLK.Api.DTOs;

public class UpdateIncidentDto
{
    [Required]
    [StringLength(IncidentRules.NameMaxLength, MinimumLength = 2)]
    public string ReporterName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^(\+94|0)7[0-9]{8}$", ErrorMessage = "Phone must be a Sri Lankan mobile number such as 0771234567 or +94771234567.")]
    [StringLength(IncidentRules.PhoneMaxLength)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [AllowedValues(
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
        "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya")]
    public string District { get; set; } = string.Empty;

    [Required]
    [StringLength(IncidentRules.LocationMaxLength, MinimumLength = 3)]
    public string Location { get; set; } = string.Empty;

    [Required]
    [AllowedValues("FlashFlood", "RiverOverflow", "UrbanFlooding", "LandslideRelated", "CoastalFlooding", "ReservoirOverflow")]
    public string IncidentType { get; set; } = string.Empty;

    [Required]
    [AllowedValues("Low", "Moderate", "High", "Severe")]
    public string Severity { get; set; } = string.Empty;

    [Required]
    [StringLength(IncidentRules.DescriptionMaxLength, MinimumLength = IncidentRules.DescriptionMinLength)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public DateTimeOffset? DateTime { get; set; }

    [Required]
    [Range(typeof(decimal), "0", "2000", ErrorMessage = "Water level must be between 0 and 2000 cm.")]
    public decimal? WaterLevel { get; set; }

    [Required]
    [Range(IncidentRules.AffectedPeopleMin, IncidentRules.AffectedPeopleMax, ErrorMessage = "Affected people must be between 0 and 1,000,000.")]
    public int? AffectedPeople { get; set; }

    [Required]
    [AllowedValues("Open", "Restricted", "Closed")]
    public string RoadAccessibility { get; set; } = string.Empty;
}
