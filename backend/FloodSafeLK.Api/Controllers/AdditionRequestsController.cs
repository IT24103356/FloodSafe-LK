using System.Security.Claims;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FloodSafeLK.Api.Controllers;

[ApiController]
public class AdditionRequestsController(IAdditionRequestService requests) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("api/resource-addition-requests")]
    public async Task<ActionResult<SubmissionReceiptDto>> SubmitResource(
        CreateResourceAdditionRequestDto dto)
    {
        var result = await requests.SubmitResourceAsync(dto);
        return Created($"/api/resource-addition-requests/{result.ReferenceId}", result);
    }

    [AllowAnonymous]
    [HttpPost("api/safe-centre-addition-requests")]
    public async Task<ActionResult<SubmissionReceiptDto>> SubmitSafeCentre(
        CreateSafeCentreAdditionRequestDto dto)
    {
        try
        {
            var result = await requests.SubmitSafeCentreAsync(dto);
            return Created($"/api/safe-centre-addition-requests/{result.ReferenceId}", result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails { Status = 400, Title = ex.Message });
        }
    }
}

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/admin")]
public class AdminAdditionRequestsController(IAdditionRequestService requests) : ControllerBase
{
    [HttpGet("resource-addition-requests")]
    public async Task<ActionResult<IEnumerable<ResourceAdditionRequestDto>>> GetResources(
        [FromQuery] string? status) => Ok(await requests.GetResourcesAsync(status));

    [HttpGet("resource-addition-requests/{id:int}")]
    public async Task<ActionResult<ResourceAdditionRequestDto>> GetResource(int id)
    {
        var request = await requests.GetResourceAsync(id);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpGet("safe-centre-addition-requests")]
    public async Task<ActionResult<IEnumerable<SafeCentreAdditionRequestDto>>> GetSafeCentres(
        [FromQuery] string? status) => Ok(await requests.GetSafeCentresAsync(status));

    [HttpGet("safe-centre-addition-requests/{id:int}")]
    public async Task<ActionResult<SafeCentreAdditionRequestDto>> GetSafeCentre(int id)
    {
        var request = await requests.GetSafeCentreAsync(id);
        return request is null ? NotFound() : Ok(request);
    }

    [HttpPost("resource-addition-requests/{id:int}/approve")]
    public Task<ActionResult<ResourceAdditionRequestDto>> ApproveResource(int id) =>
        Review(() => requests.ApproveResourceAsync(id, ReviewerId()));

    [HttpPost("resource-addition-requests/{id:int}/reject")]
    public Task<ActionResult<ResourceAdditionRequestDto>> RejectResource(int id, RejectRequestDto dto) =>
        Review(() => requests.RejectResourceAsync(id, ReviewerId(), dto.Reason));

    [HttpPost("safe-centre-addition-requests/{id:int}/approve")]
    public Task<ActionResult<SafeCentreAdditionRequestDto>> ApproveSafeCentre(int id) =>
        Review(() => requests.ApproveSafeCentreAsync(id, ReviewerId()));

    [HttpPost("safe-centre-addition-requests/{id:int}/reject")]
    public Task<ActionResult<SafeCentreAdditionRequestDto>> RejectSafeCentre(int id, RejectRequestDto dto) =>
        Review(() => requests.RejectSafeCentreAsync(id, ReviewerId(), dto.Reason));

    private string ReviewerId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("Token has no user identifier.");

    private async Task<ActionResult<T>> Review<T>(Func<Task<T>> operation)
    {
        try
        {
            return Ok(await operation());
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails { Status = 404, Title = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ProblemDetails { Status = 409, Title = ex.Message });
        }
    }
}
