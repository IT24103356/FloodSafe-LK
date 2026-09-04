using Microsoft.AspNetCore.Mvc;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Authorization;

namespace FloodSafeLK.Api.Controllers;

[ApiController]
[Route("api/assistancerequests")]
[Produces("application/json")]
public class AssistanceRequestsController : ControllerBase
{
    private readonly IAssistanceRequestService _service;

    public AssistanceRequestsController(IAssistanceRequestService service)
    {
        _service = service;
    }

    /// <summary>
    /// Get all assistance requests with optional filters.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AssistanceRequestDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? district,
        [FromQuery] string? requestType,
        [FromQuery] string? priority,
        [FromQuery] string? status)
    {
        var results = await _service.GetAllAsync(search, district, requestType, priority, status);
        return Ok(results);
    }

    /// <summary>
    /// Get a single assistance request by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(AssistanceRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result is null)
            return NotFound(new { message = $"Assistance request with ID {id} was not found." });

        return Ok(result);
    }

    /// <summary>
    /// Create a new assistance request.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(AssistanceRequestDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateAssistanceRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing assistance request.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(AssistanceRequestDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAssistanceRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateAsync(id, dto);
        if (updated is null)
            return NotFound(new { message = $"Assistance request with ID {id} was not found." });

        return Ok(updated);
    }

    /// <summary>
    /// Delete an assistance request by ID.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Assistance request with ID {id} was not found." });

        return Ok(new { message = $"Assistance request {id} was successfully deleted." });
    }
}
