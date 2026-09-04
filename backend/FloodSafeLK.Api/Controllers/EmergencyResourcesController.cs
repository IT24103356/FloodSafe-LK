using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FloodSafeLK.Api.Controllers;

/// <summary>
/// REST API controller for Emergency Resource Management.
/// Thin controller — business logic delegated to IEmergencyResourceService.
///
/// Endpoints:
///   GET    /api/emergencyresources              — list all (with filters)
///   GET    /api/emergencyresources/{id}         — get single resource
///   POST   /api/emergencyresources              — create resource
///   PUT    /api/emergencyresources/{id}         — update resource
///   DELETE /api/emergencyresources/{id}         — delete resource
///
/// Author: Mamalgaha I.G.W.S. (IT24102615) - Emergency Resource Management
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class EmergencyResourcesController : ControllerBase
{
    private readonly IEmergencyResourceService _service;
    private readonly ILogger<EmergencyResourcesController> _logger;

    public EmergencyResourcesController(
        IEmergencyResourceService service,
        ILogger<EmergencyResourcesController> logger)
    {
        _service = service;
        _logger  = logger;
    }

    // ─── GET /api/emergencyresources ─────────────────────────────────────────
    /// <summary>
    /// Returns all emergency resources, with optional filtering.
    /// Query params: search, district, resourceType, status
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmergencyResourceDto>>> GetAll(
        [FromQuery] string? search       = null,
        [FromQuery] string? district     = null,
        [FromQuery] string? resourceType = null,
        [FromQuery] string? status       = null)
    {
        var resources = await _service.GetAllAsync(search, district, resourceType, status);
        return Ok(resources);
    }

    // ─── GET /api/emergencyresources/{id} ────────────────────────────────────
    /// <summary>Returns a single resource by ID.</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmergencyResourceDto>> GetById(int id)
    {
        var resource = await _service.GetByIdAsync(id);
        if (resource is null)
        {
            _logger.LogWarning("Resource with ID {Id} not found.", id);
            return NotFound(new { message = $"Resource with ID {id} was not found." });
        }
        return Ok(resource);
    }

    // ─── POST /api/emergencyresources ────────────────────────────────────────
    /// <summary>Creates a new emergency resource.</summary>
    [HttpPost]
    public async Task<ActionResult<EmergencyResourceDto>> Create(
        [FromBody] CreateEmergencyResourceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateAsync(dto);
        _logger.LogInformation("Created resource: {Name} (ID: {Id})", created.ResourceName, created.Id);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // ─── PUT /api/emergencyresources/{id} ────────────────────────────────────
    /// <summary>Updates quantity, status, location, minimum required, and notes.</summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<EmergencyResourceDto>> Update(
        int id,
        [FromBody] UpdateEmergencyResourceDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateAsync(id, dto);
        if (updated is null)
        {
            _logger.LogWarning("Update failed — Resource with ID {Id} not found.", id);
            return NotFound(new { message = $"Resource with ID {id} was not found." });
        }

        _logger.LogInformation("Updated resource ID {Id}.", id);
        return Ok(updated);
    }

    // ─── DELETE /api/emergencyresources/{id} ─────────────────────────────────
    /// <summary>Permanently deletes a resource from PostgreSQL.</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
        {
            _logger.LogWarning("Delete failed — Resource with ID {Id} not found.", id);
            return NotFound(new { message = $"Resource with ID {id} was not found." });
        }

        _logger.LogInformation("Deleted resource ID {Id}.", id);
        return NoContent();
    }
}
