using FloodSafeLK.Api.DTOs;

namespace FloodSafeLK.Api.Services;

public interface ISafeCentreService
{
    Task<IEnumerable<SafeCentreDto>> GetAllAsync(string? search, string? district, bool? availability);
    Task<SafeCentreDto?> GetByIdAsync(int id);
    Task<SafeCentreDto> CreateAsync(CreateSafeCentreDto dto);
    Task<SafeCentreDto?> UpdateAsync(int id, UpdateSafeCentreDto dto);
    Task<bool> DeleteAsync(int id);
}
