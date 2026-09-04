using FloodSafeLK.Api.DTOs;

namespace FloodSafeLK.Api.Services;

/// <summary>
/// Service interface for Emergency Resource Management.
/// Author: Mamalgaha I.G.W.S. (IT24102615)
/// </summary>
public interface IEmergencyResourceService
{
    Task<IEnumerable<EmergencyResourceDto>> GetAllAsync(
        string? search,
        string? district,
        string? resourceType,
        string? status);

    Task<EmergencyResourceDto?> GetByIdAsync(int id);
    Task<EmergencyResourceDto> CreateAsync(CreateEmergencyResourceDto dto);
    Task<EmergencyResourceDto?> UpdateAsync(int id, UpdateEmergencyResourceDto dto);
    Task<bool> DeleteAsync(int id);
}
