using FloodSafe.API.DTOs;

namespace FloodSafe.API.Services;

public interface IAssistanceRequestService
{
    Task<IEnumerable<AssistanceRequestDto>> GetAllAsync(
        string? search,
        string? district,
        string? requestType,
        string? priority,
        string? status);

    Task<AssistanceRequestDto?> GetByIdAsync(int id);
    Task<AssistanceRequestDto> CreateAsync(CreateAssistanceRequestDto dto);
    Task<AssistanceRequestDto?> UpdateAsync(int id, UpdateAssistanceRequestDto dto);
    Task<bool> DeleteAsync(int id);
}
