using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

/// <summary>
/// DTO used when creating a new Emergency Resource.
/// All fields validated via Data Annotations.
/// Author: Mamalgaha I.G.W.S. (IT24102615)
/// </summary>
public class CreateEmergencyResourceDto
{
    [Required(ErrorMessage = "Resource name is required.")]
    [MaxLength(200, ErrorMessage = "Resource name cannot exceed 200 characters.")]
    public string ResourceName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Resource type is required.")]
    [RegularExpression(
        "^(Drinking Water|Food|First Aid|Blankets|Hygiene Kits|Flashlights|Other)$",
        ErrorMessage = "Invalid resource type. Must be one of: Drinking Water, Food, First Aid, Blankets, Hygiene Kits, Flashlights, Other.")]
    public string ResourceType { get; set; } = string.Empty;

    [Required(ErrorMessage = "District is required.")]
    [MaxLength(100, ErrorMessage = "District name cannot exceed 100 characters.")]
    public string District { get; set; } = string.Empty;

    [Required(ErrorMessage = "Location is required.")]
    [MaxLength(300, ErrorMessage = "Location cannot exceed 300 characters.")]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Quantity must be 0 or greater.")]
    public decimal Quantity { get; set; }

    [Required(ErrorMessage = "Unit is required.")]
    [MaxLength(50, ErrorMessage = "Unit cannot exceed 50 characters.")]
    public string Unit { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Minimum required must be 0 or greater.")]
    public decimal MinimumRequired { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [RegularExpression(
        "^(Available|Low Stock|Depleted|Reserved)$",
        ErrorMessage = "Status must be one of: Available, Low Stock, Depleted, Reserved.")]
    public string Status { get; set; } = "Available";

    [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
    public string? Notes { get; set; }

    public bool IsSample { get; set; } = false;
}
