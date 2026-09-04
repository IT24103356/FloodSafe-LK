using System.ComponentModel.DataAnnotations;

namespace FloodSafeLK.Api.DTOs;

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public record LoginResponseDto(string Token, DateTime ExpiresAt, string Email, string Role);
public record SubmissionReceiptDto(int ReferenceId, string Status, DateTime SubmittedAt);

public class RejectRequestDto
{
    [Required, StringLength(500, MinimumLength = 3)]
    public string Reason { get; set; } = string.Empty;
}

public class CreateResourceAdditionRequestDto
{
    [Required, MaxLength(120)]
    public string RequesterName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Your phone number is required.")]
    [MaxLength(20, ErrorMessage = "Your phone number cannot exceed 20 characters.")]
    [RegularExpression(@"^(?:\+94|0)(?:[ -]?[0-9]){9}$",
        ErrorMessage = "Enter a valid Sri Lankan phone number, such as 0771234567, 0112345678, or +94771234567.")]
    public string RequesterPhone { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string ResourceName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Resource type is required.")]
    [RegularExpression("^(Drinking Water|Food|First Aid|Blankets|Hygiene Kits|Flashlights|Other)$",
        ErrorMessage = "Select a valid resource type.")]
    public string ResourceType { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Quantity cannot be negative.")]
    public decimal Quantity { get; set; }

    [Required, MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "Minimum required cannot be negative.")]
    public decimal MinimumRequired { get; set; }

    [Required(ErrorMessage = "Resource status is required.")]
    [RegularExpression("^(Available|Low Stock|Depleted|Reserved)$",
        ErrorMessage = "Status must be Available, Low Stock, Depleted, or Reserved.")]
    public string Status { get; set; } = "Available";

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class CreateSafeCentreAdditionRequestDto
{
    [Required, MaxLength(120)]
    public string RequesterName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Your phone number is required.")]
    [MaxLength(20, ErrorMessage = "Your phone number cannot exceed 20 characters.")]
    [RegularExpression(@"^(?:\+94|0)(?:[ -]?[0-9]){9}$",
        ErrorMessage = "Enter a valid Sri Lankan phone number, such as 0771234567, 0112345678, or +94771234567.")]
    public string RequesterPhone { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "The safe centre contact number is required.")]
    [MaxLength(20, ErrorMessage = "The contact number cannot exceed 20 characters.")]
    [RegularExpression(@"^(?:\+94|0)(?:[ -]?[0-9]){9}$",
        ErrorMessage = "Enter a valid Sri Lankan contact number, such as 0112345678 or +94112345678.")]
    public string ContactNumber { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than zero.")]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Current occupancy cannot be negative.")]
    public int CurrentOccupancy { get; set; }

    [MaxLength(1000)]
    public string Facilities { get; set; } = string.Empty;

    public bool Availability { get; set; } = true;
    public DateTime OpeningDate { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}

public record ResourceAdditionRequestDto(
    int Id, string RequesterName, string RequesterPhone, string ResourceName,
    string ResourceType, string District, string Location, decimal Quantity,
    string Unit, decimal MinimumRequired, string ResourceStatus, string? Notes,
    string Status, DateTime SubmittedAt, DateTime? ReviewedAt,
    string? ReviewedByEmail, string? RejectionReason, int? PublishedResourceId);

public record SafeCentreAdditionRequestDto(
    int Id, string RequesterName, string RequesterPhone, string Name,
    string District, string Address, string ContactNumber, int Capacity,
    int CurrentOccupancy, string Facilities, bool Availability, DateTime OpeningDate,
    string Notes, string Status, DateTime SubmittedAt, DateTime? ReviewedAt,
    string? ReviewedByEmail, string? RejectionReason, int? PublishedCentreId);
