using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FloodSafeLK.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SafeCentresController : ControllerBase
{
    private readonly ISafeCentreService _service;

    public SafeCentresController(ISafeCentreService service)
    {
        _service = service;
    }

    // ── GET /api/safecentres ──────────────────────────────────────────────
    /// <summary>
    /// Returns all safe centres. Supports optional query filters:
    /// ?search=, ?district=, ?availability=true|false
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SafeCentreDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? district,
        [FromQuery] bool? availability)
    {
        var results = await _service.GetAllAsync(search, district, availability);
        return Ok(results);
    }

    // ── GET /api/safecentres/{id} ─────────────────────────────────────────
    /// <summary>
    /// Returns a single safe centre by ID. Returns 404 if not found.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(SafeCentreDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        if (dto is null)
            return NotFound(new { message = $"Safe centre with ID {id} was not found." });

        return Ok(dto);
    }

    // ── POST /api/safecentres ─────────────────────────────────────────────
    /// <summary>
    /// Creates a new safe centre. Returns 400 if validation fails.
    /// Business rule: CurrentOccupancy must not exceed Capacity.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(SafeCentreDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateSafeCentreDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Business rule: CurrentOccupancy cannot exceed Capacity
        if (dto.CurrentOccupancy > dto.Capacity)
        {
            return BadRequest(new
            {
                message = "Current occupancy cannot exceed maximum capacity.",
                errors = new { CurrentOccupancy = new[] { $"Current occupancy ({dto.CurrentOccupancy}) cannot exceed capacity ({dto.Capacity})." } }
            });
        }

        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // ── PUT /api/safecentres/{id} ─────────────────────────────────────────
    /// <summary>
    /// Updates an existing safe centre. Returns 400 if validation fails, 404 if not found.
    /// Business rule: CurrentOccupancy must not exceed Capacity.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(SafeCentreDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSafeCentreDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Business rule: CurrentOccupancy cannot exceed Capacity
        if (dto.CurrentOccupancy > dto.Capacity)
        {
            return BadRequest(new
            {
                message = "Current occupancy cannot exceed maximum capacity.",
                errors = new { CurrentOccupancy = new[] { $"Current occupancy ({dto.CurrentOccupancy}) cannot exceed capacity ({dto.Capacity})." } }
            });
        }

        var updated = await _service.UpdateAsync(id, dto);
        if (updated is null)
            return NotFound(new { message = $"Safe centre with ID {id} was not found." });

        return Ok(updated);
    }

    // ── DELETE /api/safecentres/{id} ──────────────────────────────────────
    /// <summary>
    /// Deletes a safe centre by ID. Returns 204 No Content, or 404 if not found.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Safe centre with ID {id} was not found." });

        return NoContent();
    }
}
