using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FloodSafeLK.Api.Controllers;

[ApiController]
[Route("api/incidents")]
[Produces("application/json")]
public class IncidentsController : ControllerBase
{
    private readonly IIncidentService _incidents;
    private readonly ILogger<IncidentsController> _logger;

    public IncidentsController(IIncidentService incidents, ILogger<IncidentsController> logger)
    {
        _incidents = incidents;
        _logger = logger;
    }

    /// <summary>List incidents with optional search, filters, and sorting.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<IncidentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<IncidentDto>>> GetAll([FromQuery] IncidentQuery query, CancellationToken cancellationToken)
    {
        var results = await _incidents.GetAllAsync(query, cancellationToken);
        return Ok(results);
    }

    /// <summary>Get a single incident by id.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var incident = await _incidents.GetByIdAsync(id, cancellationToken);
        if (incident is null)
        {
            return NotFound(ErrorBody(404, "Incident not found", $"No incident exists with id {id}."));
        }

        return Ok(incident);
    }

    /// <summary>Create a flood incident. Risk score is calculated on the server.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var created = await _incidents.CreateAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>Update an existing incident and recalculate risk.</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(IncidentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IncidentDto>> Update(Guid id, [FromBody] UpdateIncidentDto dto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var updated = await _incidents.UpdateAsync(id, dto, cancellationToken);
        if (updated is null)
        {
            return NotFound(ErrorBody(404, "Incident not found", $"No incident exists with id {id}."));
        }

        return Ok(updated);
    }

    /// <summary>Delete an incident.</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var removed = await _incidents.DeleteAsync(id, cancellationToken);
        if (!removed)
        {
            return NotFound(ErrorBody(404, "Incident not found", $"No incident exists with id {id}."));
        }

        return NoContent();
    }

    private object ErrorBody(int status, string title, string detail)
    {
        _logger.LogWarning("{Title}: {Detail}", title, detail);
        return new
        {
            type = $"https://httpstatuses.com/{status}",
            title,
            status,
            detail
        };
    }
}
