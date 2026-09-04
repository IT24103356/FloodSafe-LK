using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FloodSafeLK.Api.Models;

/// <summary>
/// Represents a flood safe centre in Sri Lanka.
/// </summary>
public class SafeCentre
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string District { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Phone]
    public string ContactNumber { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Capacity must be greater than 0.")]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Current occupancy cannot be negative.")]
    public int CurrentOccupancy { get; set; }

    /// <summary>
    /// Comma-separated list of available facilities (e.g. "Toilets, Water, Medical Aid").
    /// </summary>
    [MaxLength(1000)]
    public string Facilities { get; set; } = string.Empty;

    /// <summary>
    /// Whether the centre is currently available/open.
    /// </summary>
    public bool Availability { get; set; } = true;

    public DateTime OpeningDate { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;

    /// <summary>
    /// True if this record is demo/sample data — not a real live centre.
    /// </summary>
    public bool IsSample { get; set; } = false;

    /// <summary>
    /// Calculated value — not stored in DB. Returns remaining spaces.
    /// </summary>
    [NotMapped]
    public int AvailableSpaces => Capacity - CurrentOccupancy;
}
