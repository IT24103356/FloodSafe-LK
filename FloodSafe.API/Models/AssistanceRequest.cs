using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FloodSafe.API.Models;

public enum RequestType
{
    Food,
    Water,
    Medical,
    Transport,
    Evacuation,
    Shelter,
    Other
}

public enum Priority
{
    Low,
    Medium,
    High,
    Critical
}

public enum RequestStatus
{
    Pending,
    InProgress,
    Resolved
}

[Table("assistance_requests")]
public class AssistanceRequest
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("requester_name")]
    public string RequesterName { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    [Column("phone")]
    public string Phone { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    [Column("district")]
    public string District { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [Column("location")]
    public string Location { get; set; } = string.Empty;

    [Required]
    [Column("request_type")]
    public RequestType RequestType { get; set; }

    [Required]
    [Column("priority")]
    public Priority Priority { get; set; }

    [Required]
    [MinLength(20)]
    [MaxLength(1000)]
    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(1, 10000)]
    [Column("number_of_people")]
    public int NumberOfPeople { get; set; }

    [Column("status")]
    public RequestStatus Status { get; set; } = RequestStatus.Pending;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("is_sample")]
    public bool IsSample { get; set; } = false;
}
