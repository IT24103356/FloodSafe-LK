using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace FloodSafeLK.Api.Models;

public class ApplicationUser : IdentityUser
{
}

public static class AdditionRequestStatuses
{
    public const string Pending = "Pending";
    public const string Approved = "Approved";
    public const string Rejected = "Rejected";
}

public abstract class AdditionRequestBase
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string RequesterName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string RequesterPhone { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Status { get; set; } = AdditionRequestStatuses.Pending;

    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }

    [MaxLength(450)]
    public string? ReviewedByUserId { get; set; }

    public ApplicationUser? ReviewedByUser { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }
}

public class ResourceAdditionRequest : AdditionRequestBase
{
    [Required, MaxLength(200)]
    public string ResourceName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string ResourceType { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    public decimal Quantity { get; set; }

    [Required, MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    public decimal MinimumRequired { get; set; }

    [Required, MaxLength(50)]
    public string ResourceStatus { get; set; } = "Available";

    [MaxLength(1000)]
    public string? Notes { get; set; }

    public int? PublishedResourceId { get; set; }
}

public class SafeCentreAdditionRequest : AdditionRequestBase
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string ContactNumber { get; set; } = string.Empty;

    public int Capacity { get; set; }
    public int CurrentOccupancy { get; set; }

    [MaxLength(1000)]
    public string Facilities { get; set; } = string.Empty;

    public bool Availability { get; set; } = true;
    public DateTime OpeningDate { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    public int? PublishedCentreId { get; set; }
}
