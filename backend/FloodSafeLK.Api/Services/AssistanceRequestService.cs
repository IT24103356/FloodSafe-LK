using Microsoft.EntityFrameworkCore;
using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;

namespace FloodSafeLK.Api.Services;

public class AssistanceRequestService : IAssistanceRequestService
{
    private readonly ApplicationDbContext _context;

    public AssistanceRequestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AssistanceRequestDto>> GetAllAsync(
        string? search,
        string? district,
        string? requestType,
        string? priority,
        string? status)
    {
        var query = _context.AssistanceRequests.AsQueryable();

        // Search across name, location, description
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(r =>
                r.RequesterName.ToLower().Contains(term) ||
                r.Location.ToLower().Contains(term) ||
                r.Description.ToLower().Contains(term) ||
                r.District.ToLower().Contains(term));
        }

        // District filter
        if (!string.IsNullOrWhiteSpace(district))
            query = query.Where(r => r.District.ToLower() == district.Trim().ToLower());

        // Request type filter
        if (!string.IsNullOrWhiteSpace(requestType) &&
            Enum.TryParse<RequestType>(requestType, true, out var rtEnum))
            query = query.Where(r => r.RequestType == rtEnum);

        // Priority filter
        if (!string.IsNullOrWhiteSpace(priority) &&
            Enum.TryParse<Priority>(priority, true, out var prEnum))
            query = query.Where(r => r.Priority == prEnum);

        // Status filter
        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<RequestStatus>(status, true, out var stEnum))
            query = query.Where(r => r.Status == stEnum);

        var results = await query
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return results.Select(MapToDto);
    }

    public async Task<AssistanceRequestDto?> GetByIdAsync(int id)
    {
        var entity = await _context.AssistanceRequests.FindAsync(id);
        return entity is null ? null : MapToDto(entity);
    }

    public async Task<AssistanceRequestDto> CreateAsync(CreateAssistanceRequestDto dto)
    {
        if (!Enum.TryParse<RequestType>(dto.RequestType, out var requestType))
            throw new ArgumentException("Invalid request type.");

        if (!Enum.TryParse<Priority>(dto.Priority, out var priority))
            throw new ArgumentException("Invalid priority.");

        var entity = new AssistanceRequest
        {
            RequesterName = dto.RequesterName.Trim(),
            Phone = dto.Phone.Trim(),
            District = dto.District.Trim(),
            Location = dto.Location.Trim(),
            RequestType = requestType,
            Priority = priority,
            Description = dto.Description.Trim(),
            NumberOfPeople = dto.NumberOfPeople,
            Status = RequestStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsSample = dto.IsSample
        };

        _context.AssistanceRequests.Add(entity);
        await _context.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<AssistanceRequestDto?> UpdateAsync(int id, UpdateAssistanceRequestDto dto)
    {
        var entity = await _context.AssistanceRequests.FindAsync(id);
        if (entity is null) return null;

        if (dto.Location is not null)
            entity.Location = dto.Location.Trim();

        if (dto.RequestType is not null && Enum.TryParse<RequestType>(dto.RequestType, out var rt))
            entity.RequestType = rt;

        if (dto.Priority is not null && Enum.TryParse<Priority>(dto.Priority, out var pr))
            entity.Priority = pr;

        if (dto.Description is not null)
            entity.Description = dto.Description.Trim();

        if (dto.NumberOfPeople.HasValue)
            entity.NumberOfPeople = dto.NumberOfPeople.Value;

        if (dto.Status is not null && Enum.TryParse<RequestStatus>(dto.Status, out var st))
            entity.Status = st;

        entity.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(entity);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.AssistanceRequests.FindAsync(id);
        if (entity is null) return false;

        _context.AssistanceRequests.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    private static AssistanceRequestDto MapToDto(AssistanceRequest e) => new()
    {
        Id = e.Id,
        RequesterName = e.RequesterName,
        Phone = e.Phone,
        District = e.District,
        Location = e.Location,
        RequestType = e.RequestType.ToString(),
        Priority = e.Priority.ToString(),
        Description = e.Description,
        NumberOfPeople = e.NumberOfPeople,
        Status = e.Status.ToString(),
        CreatedAt = e.CreatedAt,
        UpdatedAt = e.UpdatedAt,
        IsSample = e.IsSample
    };
}
