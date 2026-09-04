using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Services;

/// <summary>
/// Business logic service for Emergency Resource Management.
/// 
/// Low-Stock Rule (transparent):
///   If Quantity &lt;= MinimumRequired -&gt; IsLowStock = true ("Low Stock")
///   Otherwise                       -&gt; IsLowStock = false ("Available")
///
/// Author: Mamalgaha I.G.W.S. (IT24102615)
/// </summary>
public class EmergencyResourceService : IEmergencyResourceService
{
    private readonly ApplicationDbContext _context;

    public EmergencyResourceService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─── READ ALL ─────────────────────────────────────────────────────────────
    public async Task<IEnumerable<EmergencyResourceDto>> GetAllAsync(
        string? search,
        string? district,
        string? resourceType,
        string? status)
    {
        var query = _context.EmergencyResources.AsQueryable();

        // Full-text search on ResourceName and Location
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(r =>
                r.ResourceName.ToLower().Contains(term) ||
                r.Location.ToLower().Contains(term) ||
                (r.Notes != null && r.Notes.ToLower().Contains(term)));
        }

        // District filter
        if (!string.IsNullOrWhiteSpace(district))
            query = query.Where(r => r.District == district);

        // ResourceType filter
        if (!string.IsNullOrWhiteSpace(resourceType))
            query = query.Where(r => r.ResourceType == resourceType);

        // Status filter
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);

        var resources = await query
            .OrderByDescending(r => r.LastUpdated)
            .ToListAsync();

        return resources.Select(MapToDto);
    }

    // ─── READ BY ID ──────────────────────────────────────────────────────────
    public async Task<EmergencyResourceDto?> GetByIdAsync(int id)
    {
        var resource = await _context.EmergencyResources.FindAsync(id);
        return resource is null ? null : MapToDto(resource);
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────
    public async Task<EmergencyResourceDto> CreateAsync(CreateEmergencyResourceDto dto)
    {
        var resource = new EmergencyResource
        {
            ResourceName    = dto.ResourceName.Trim(),
            ResourceType    = dto.ResourceType,
            District        = dto.District,
            Location        = dto.Location.Trim(),
            Quantity        = dto.Quantity,
            Unit            = dto.Unit.Trim(),
            MinimumRequired = dto.MinimumRequired,
            Status          = dto.Status,
            LastUpdated     = DateTime.UtcNow,
            Notes           = dto.Notes?.Trim(),
            IsSample        = dto.IsSample
        };

        _context.EmergencyResources.Add(resource);
        await _context.SaveChangesAsync();

        return MapToDto(resource);
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────
    public async Task<EmergencyResourceDto?> UpdateAsync(int id, UpdateEmergencyResourceDto dto)
    {
        var resource = await _context.EmergencyResources.FindAsync(id);
        if (resource is null) return null;

        resource.Quantity        = dto.Quantity;
        resource.Status          = dto.Status;
        resource.Location        = dto.Location.Trim();
        resource.MinimumRequired = dto.MinimumRequired;
        resource.Notes           = dto.Notes?.Trim();
        resource.LastUpdated     = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(resource);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────
    public async Task<bool> DeleteAsync(int id)
    {
        var resource = await _context.EmergencyResources.FindAsync(id);
        if (resource is null) return false;

        _context.EmergencyResources.Remove(resource);
        await _context.SaveChangesAsync();
        return true;
    }

    // ─── MAPPING ──────────────────────────────────────────────────────────────
    /// <summary>
    /// Maps entity to DTO and computes the low-stock rule:
    ///   IsLowStock = Quantity &lt;= MinimumRequired
    /// </summary>
    private static EmergencyResourceDto MapToDto(EmergencyResource r) => new()
    {
        Id              = r.Id,
        ResourceName    = r.ResourceName,
        ResourceType    = r.ResourceType,
        District        = r.District,
        Location        = r.Location,
        Quantity        = r.Quantity,
        Unit            = r.Unit,
        MinimumRequired = r.MinimumRequired,
        Status          = r.Status,
        LastUpdated     = r.LastUpdated,
        Notes           = r.Notes,
        IsSample        = r.IsSample,
        // ── LOW STOCK RULE ──────────────────────────────────────
        // A resource is "Low Stock" when the current quantity
        // is at or below the minimum required threshold.
        IsLowStock      = r.Quantity <= r.MinimumRequired
        // ────────────────────────────────────────────────────────
    };
}
