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

    [Required, MaxLength(20), RegularExpression(@"^\+?[0-9][0-9\s-]{7,18}$")]
    public string RequesterPhone { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string ResourceName { get; set; } = string.Empty;

    [Required, RegularExpression("^(Drinking Water|Food|First Aid|Blankets|Hygiene Kits|Flashlights|Other)$")]
    public string ResourceType { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Quantity { get; set; }

    [Required, MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal MinimumRequired { get; set; }

    [Required, RegularExpression("^(Available|Low Stock|Depleted|Reserved)$")]
    public string Status { get; set; } = "Available";

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class CreateSafeCentreAdditionRequestDto
{
    [Required, MaxLength(120)]
    public string RequesterName { get; set; } = string.Empty;

    [Required, MaxLength(20), RegularExpression(@"^\+?[0-9][0-9\s-]{7,18}$")]
    public string RequesterPhone { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required, MaxLength(20), RegularExpression(@"^\+?[0-9][0-9\s-]{7,18}$")]
    public string ContactNumber { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue)]
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
