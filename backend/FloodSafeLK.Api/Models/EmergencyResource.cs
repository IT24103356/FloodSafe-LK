using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FloodSafeLK.Api.Models;

/// <summary>
/// Represents an emergency resource managed by FloodSafe LK.
/// Author: Mamalgaha I.G.W.S. (IT24102615) - Emergency Resource Management (Member 3)
/// </summary>
[Table("EmergencyResources")]
public class EmergencyResource
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string ResourceName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ResourceType { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Location { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Quantity { get; set; }

    [Required]
    [MaxLength(50)]
    public string Unit { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal MinimumRequired { get; set; }

    /// <summary>
    /// Stored status (e.g., Available, Low Stock, Depleted, Reserved).
    /// Runtime "low stock" logic is computed via IsLowStock in the DTO.
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Available";

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// Marks demo/sample data seeded at startup.
    /// </summary>
    public bool IsSample { get; set; } = false;
}
