namespace FloodSafeLK.Api.DTOs;

/// <summary>
/// Read DTO returned to frontend clients.
/// Includes computed IsLowStock flag.
/// Author: Mamalgaha I.G.W.S. (IT24102615)
/// </summary>
public class EmergencyResourceDto
{
    public int Id { get; set; }
    public string ResourceName { get; set; } = string.Empty;
    public string ResourceType { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal MinimumRequired { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime LastUpdated { get; set; }
    public string? Notes { get; set; }
    public bool IsSample { get; set; }

    /// <summary>
    /// Transparent low-stock rule:
    ///   If Quantity is less than or equal to MinimumRequired -> Low Stock
    ///   Otherwise -> Available
    /// </summary>
    public bool IsLowStock { get; set; }

    /// <summary>
    /// Human-readable stock status label for the UI.
    /// </summary>
    public string StockStatus => IsLowStock ? "Low Stock" : "Available";
}
