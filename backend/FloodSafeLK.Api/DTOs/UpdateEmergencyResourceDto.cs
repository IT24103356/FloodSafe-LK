using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

/// <summary>
/// DTO used when updating an existing Emergency Resource.
/// Only mutable fields are allowed: Quantity, Status, Location, MinimumRequired, Notes.
/// Author: Mamalgaha I.G.W.S. (IT24102615)
/// </summary>
public class UpdateEmergencyResourceDto
{
    [Range(0, double.MaxValue, ErrorMessage = "Quantity must be 0 or greater.")]
    public decimal Quantity { get; set; }

    [Required(ErrorMessage = "Status is required.")]
    [RegularExpression(
        "^(Available|Low Stock|Depleted|Reserved)$",
        ErrorMessage = "Status must be one of: Available, Low Stock, Depleted, Reserved.")]
    public string Status { get; set; } = "Available";

    [Required(ErrorMessage = "Location is required.")]
    [MaxLength(300, ErrorMessage = "Location cannot exceed 300 characters.")]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Minimum required must be 0 or greater.")]
    public decimal MinimumRequired { get; set; }

    [MaxLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
    public string? Notes { get; set; }
}
