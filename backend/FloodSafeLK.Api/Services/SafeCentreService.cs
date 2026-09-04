using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Services;

public class SafeCentreService : ISafeCentreService
{
    private readonly ApplicationDbContext _context;

    public SafeCentreService(ApplicationDbContext context)
    {
        _context = context;
    }

    // ── Mapping helpers ──────────────────────────────────────────────────────

    private static SafeCentreDto ToDto(SafeCentre entity) => new SafeCentreDto
    {
        Id = entity.Id,
        Name = entity.Name,
        District = entity.District,
        Address = entity.Address,
        ContactNumber = entity.ContactNumber,
        Capacity = entity.Capacity,
        CurrentOccupancy = entity.CurrentOccupancy,
        AvailableSpaces = entity.AvailableSpaces,   // computed [NotMapped]
        Facilities = entity.Facilities,
        Availability = entity.Availability,
        OpeningDate = entity.OpeningDate,
        Notes = entity.Notes,
        IsSample = entity.IsSample
    };

    // ── GET ALL (with optional search / filter) ───────────────────────────

    public async Task<IEnumerable<SafeCentreDto>> GetAllAsync(
        string? search,
        string? district,
        bool? availability)
    {
        IQueryable<SafeCentre> query = _context.SafeCentres.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            string term = search.Trim().ToLower();
            query = query.Where(c =>
                c.Name.ToLower().Contains(term) ||
                c.Address.ToLower().Contains(term) ||
                c.Facilities.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(district))
        {
            query = query.Where(c => c.District.ToLower() == district.Trim().ToLower());
        }

        if (availability.HasValue)
        {
            query = query.Where(c => c.Availability == availability.Value);
        }

        var list = await query
            .OrderBy(c => c.District)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return list.Select(ToDto);
    }

    // ── GET BY ID ────────────────────────────────────────────────────────────

    public async Task<SafeCentreDto?> GetByIdAsync(int id)
    {
        var entity = await _context.SafeCentres
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        return entity is null ? null : ToDto(entity);
    }

    // ── CREATE ───────────────────────────────────────────────────────────────

    public async Task<SafeCentreDto> CreateAsync(CreateSafeCentreDto dto)
    {
        var entity = new SafeCentre
        {
            Name = dto.Name.Trim(),
            District = dto.District.Trim(),
            Address = dto.Address.Trim(),
            ContactNumber = dto.ContactNumber.Trim(),
            Capacity = dto.Capacity,
            CurrentOccupancy = dto.CurrentOccupancy,
            Facilities = (dto.Facilities ?? string.Empty).Trim(),
            Availability = dto.Availability,
            OpeningDate = dto.OpeningDate == default ? DateTime.UtcNow : dto.OpeningDate.ToUniversalTime(),
            Notes = (dto.Notes ?? string.Empty).Trim(),
            IsSample = dto.IsSample
        };

        _context.SafeCentres.Add(entity);
        await _context.SaveChangesAsync();

        return ToDto(entity);
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    public async Task<SafeCentreDto?> UpdateAsync(int id, UpdateSafeCentreDto dto)
    {
        var entity = await _context.SafeCentres.FindAsync(id);
        if (entity is null)
            return null;

        entity.Name = dto.Name.Trim();
        entity.District = dto.District.Trim();
        entity.Address = dto.Address.Trim();
        entity.ContactNumber = dto.ContactNumber.Trim();
        entity.Capacity = dto.Capacity;
        entity.CurrentOccupancy = dto.CurrentOccupancy;
        entity.Facilities = (dto.Facilities ?? string.Empty).Trim();
        entity.Availability = dto.Availability;
        entity.OpeningDate = dto.OpeningDate.ToUniversalTime();
        entity.Notes = (dto.Notes ?? string.Empty).Trim();

        await _context.SaveChangesAsync();

        return ToDto(entity);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.SafeCentres.FindAsync(id);
        if (entity is null)
            return false;

        _context.SafeCentres.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
