using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

/// <summary>
/// Input DTO for creating a new SafeCentre (POST /api/safecentres).
/// </summary>
public class CreateSafeCentreDto
{
    [Required(ErrorMessage = "Name is required.")]
    [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "District is required.")]
    [MaxLength(100, ErrorMessage = "District cannot exceed 100 characters.")]
    public string District { get; set; } = string.Empty;

    [Required(ErrorMessage = "Address is required.")]
    [MaxLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "Contact number is required.")]
    [MaxLength(20, ErrorMessage = "Contact number cannot exceed 20 characters.")]
    [RegularExpression(@"^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$",
        ErrorMessage = "Please provide a valid phone number.")]
    public string ContactNumber { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than 0.")]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Current occupancy cannot be negative.")]
    public int CurrentOccupancy { get; set; }

    [MaxLength(1000)]
    public string Facilities { get; set; } = string.Empty;

    public bool Availability { get; set; } = true;

    public DateTime OpeningDate { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public bool IsSample { get; set; } = false;
}
