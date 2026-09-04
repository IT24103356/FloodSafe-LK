using FloodSafeLK.Api.DTOs;

namespace FloodSafeLK.Api.Services;

public interface IIncidentService
{
    Task<IReadOnlyList<IncidentDto>> GetAllAsync(IncidentQuery query, CancellationToken cancellationToken = default);
    Task<IncidentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IncidentDto> CreateAsync(CreateIncidentDto dto, CancellationToken cancellationToken = default);
    Task<IncidentDto?> UpdateAsync(Guid id, UpdateIncidentDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
