using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Services;

public interface IAdditionRequestService
{
    Task<SubmissionReceiptDto> SubmitResourceAsync(CreateResourceAdditionRequestDto dto);
    Task<SubmissionReceiptDto> SubmitSafeCentreAsync(CreateSafeCentreAdditionRequestDto dto);
    Task<IEnumerable<ResourceAdditionRequestDto>> GetResourcesAsync(string? status);
    Task<ResourceAdditionRequestDto?> GetResourceAsync(int id);
    Task<IEnumerable<SafeCentreAdditionRequestDto>> GetSafeCentresAsync(string? status);
    Task<SafeCentreAdditionRequestDto?> GetSafeCentreAsync(int id);
    Task<ResourceAdditionRequestDto> ApproveResourceAsync(int id, string reviewerId);
    Task<SafeCentreAdditionRequestDto> ApproveSafeCentreAsync(int id, string reviewerId);
    Task<ResourceAdditionRequestDto> RejectResourceAsync(int id, string reviewerId, string reason);
    Task<SafeCentreAdditionRequestDto> RejectSafeCentreAsync(int id, string reviewerId, string reason);
}

public class AdditionRequestService(
    ApplicationDbContext context,
    IEmergencyResourceService emergencyResources,
    ISafeCentreService safeCentres) : IAdditionRequestService
{
    public async Task<SubmissionReceiptDto> SubmitResourceAsync(CreateResourceAdditionRequestDto dto)
    {
        var request = new ResourceAdditionRequest
        {
            RequesterName = dto.RequesterName.Trim(),
            RequesterPhone = dto.RequesterPhone.Trim(),
            ResourceName = dto.ResourceName.Trim(),
            ResourceType = dto.ResourceType,
            District = dto.District.Trim(),
            Location = dto.Location.Trim(),
            Quantity = dto.Quantity,
            Unit = dto.Unit.Trim(),
            MinimumRequired = dto.MinimumRequired,
            ResourceStatus = dto.Status,
            Notes = dto.Notes?.Trim(),
            SubmittedAt = DateTime.UtcNow
        };
        context.ResourceAdditionRequests.Add(request);
        await context.SaveChangesAsync();
        return new(request.Id, request.Status, request.SubmittedAt);
    }

    public async Task<SubmissionReceiptDto> SubmitSafeCentreAsync(CreateSafeCentreAdditionRequestDto dto)
    {
        if (dto.CurrentOccupancy > dto.Capacity)
        {
            throw new ArgumentException("Current occupancy cannot exceed capacity.");
        }

        var request = new SafeCentreAdditionRequest
        {
            RequesterName = dto.RequesterName.Trim(),
            RequesterPhone = dto.RequesterPhone.Trim(),
            Name = dto.Name.Trim(),
            District = dto.District.Trim(),
            Address = dto.Address.Trim(),
            ContactNumber = dto.ContactNumber.Trim(),
            Capacity = dto.Capacity,
            CurrentOccupancy = dto.CurrentOccupancy,
            Facilities = dto.Facilities.Trim(),
            Availability = dto.Availability,
            OpeningDate = dto.OpeningDate.ToUniversalTime(),
            Notes = dto.Notes.Trim(),
            SubmittedAt = DateTime.UtcNow
        };
        context.SafeCentreAdditionRequests.Add(request);
        await context.SaveChangesAsync();
        return new(request.Id, request.Status, request.SubmittedAt);
    }

    public async Task<IEnumerable<ResourceAdditionRequestDto>> GetResourcesAsync(string? status) =>
        (await ResourceQuery(status).ToListAsync()).Select(MapResource);

    public async Task<ResourceAdditionRequestDto?> GetResourceAsync(int id)
    {
        var request = await ResourceQuery(null).FirstOrDefaultAsync(r => r.Id == id);
        return request is null ? null : MapResource(request);
    }

    public async Task<IEnumerable<SafeCentreAdditionRequestDto>> GetSafeCentresAsync(string? status) =>
        (await SafeCentreQuery(status).ToListAsync()).Select(MapSafeCentre);

    public async Task<SafeCentreAdditionRequestDto?> GetSafeCentreAsync(int id)
    {
        var request = await SafeCentreQuery(null).FirstOrDefaultAsync(r => r.Id == id);
        return request is null ? null : MapSafeCentre(request);
    }

    public async Task<ResourceAdditionRequestDto> ApproveResourceAsync(int id, string reviewerId)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        var request = await context.ResourceAdditionRequests
            .Include(r => r.ReviewedByUser)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException("Resource addition request not found.");
        EnsurePending(request.Status);

        var published = await emergencyResources.CreateAsync(new CreateEmergencyResourceDto
        {
            ResourceName = request.ResourceName,
            ResourceType = request.ResourceType,
            District = request.District,
            Location = request.Location,
            Quantity = request.Quantity,
            Unit = request.Unit,
            MinimumRequired = request.MinimumRequired,
            Status = request.ResourceStatus,
            Notes = request.Notes,
            IsSample = false
        });
        CompleteReview(request, reviewerId, AdditionRequestStatuses.Approved);
        request.PublishedResourceId = published.Id;
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        request.ReviewedByUser = await context.Users.FindAsync(reviewerId);
        return MapResource(request);
    }

    public async Task<SafeCentreAdditionRequestDto> ApproveSafeCentreAsync(int id, string reviewerId)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        var request = await context.SafeCentreAdditionRequests
            .Include(r => r.ReviewedByUser)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException("Safe centre addition request not found.");
        EnsurePending(request.Status);

        var published = await safeCentres.CreateAsync(new CreateSafeCentreDto
        {
            Name = request.Name,
            District = request.District,
            Address = request.Address,
            ContactNumber = request.ContactNumber,
            Capacity = request.Capacity,
            CurrentOccupancy = request.CurrentOccupancy,
            Facilities = request.Facilities,
            Availability = request.Availability,
            OpeningDate = request.OpeningDate,
            Notes = request.Notes,
            IsSample = false
        });
        CompleteReview(request, reviewerId, AdditionRequestStatuses.Approved);
        request.PublishedCentreId = published.Id;
        await context.SaveChangesAsync();
        await transaction.CommitAsync();
        request.ReviewedByUser = await context.Users.FindAsync(reviewerId);
        return MapSafeCentre(request);
    }

    public async Task<ResourceAdditionRequestDto> RejectResourceAsync(
        int id, string reviewerId, string reason)
    {
        var request = await context.ResourceAdditionRequests
            .Include(r => r.ReviewedByUser)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException("Resource addition request not found.");
        EnsurePending(request.Status);
        CompleteReview(request, reviewerId, AdditionRequestStatuses.Rejected, reason.Trim());
        await context.SaveChangesAsync();
        request.ReviewedByUser = await context.Users.FindAsync(reviewerId);
        return MapResource(request);
    }

    public async Task<SafeCentreAdditionRequestDto> RejectSafeCentreAsync(
        int id, string reviewerId, string reason)
    {
        var request = await context.SafeCentreAdditionRequests
            .Include(r => r.ReviewedByUser)
            .FirstOrDefaultAsync(r => r.Id == id)
            ?? throw new KeyNotFoundException("Safe centre addition request not found.");
        EnsurePending(request.Status);
        CompleteReview(request, reviewerId, AdditionRequestStatuses.Rejected, reason.Trim());
        await context.SaveChangesAsync();
        request.ReviewedByUser = await context.Users.FindAsync(reviewerId);
        return MapSafeCentre(request);
    }

    private IQueryable<ResourceAdditionRequest> ResourceQuery(string? status)
    {
        var query = context.ResourceAdditionRequests.AsNoTracking()
            .Include(r => r.ReviewedByUser).OrderByDescending(r => r.SubmittedAt).AsQueryable();
        return string.IsNullOrWhiteSpace(status)
            ? query
            : query.Where(r => r.Status == status.Trim());
    }

    private IQueryable<SafeCentreAdditionRequest> SafeCentreQuery(string? status)
    {
        var query = context.SafeCentreAdditionRequests.AsNoTracking()
            .Include(r => r.ReviewedByUser).OrderByDescending(r => r.SubmittedAt).AsQueryable();
        return string.IsNullOrWhiteSpace(status)
            ? query
            : query.Where(r => r.Status == status.Trim());
    }

    private static void EnsurePending(string status)
    {
        if (status != AdditionRequestStatuses.Pending)
        {
            throw new InvalidOperationException("This request has already been reviewed.");
        }
    }

    private static void CompleteReview(
        AdditionRequestBase request, string reviewerId, string status, string? reason = null)
    {
        request.Status = status;
        request.ReviewedAt = DateTime.UtcNow;
        request.ReviewedByUserId = reviewerId;
        request.RejectionReason = reason;
    }

    private static ResourceAdditionRequestDto MapResource(ResourceAdditionRequest r) => new(
        r.Id, r.RequesterName, r.RequesterPhone, r.ResourceName, r.ResourceType,
        r.District, r.Location, r.Quantity, r.Unit, r.MinimumRequired, r.ResourceStatus,
        r.Notes, r.Status, r.SubmittedAt, r.ReviewedAt, r.ReviewedByUser?.Email,
        r.RejectionReason, r.PublishedResourceId);

    private static SafeCentreAdditionRequestDto MapSafeCentre(SafeCentreAdditionRequest r) => new(
        r.Id, r.RequesterName, r.RequesterPhone, r.Name, r.District, r.Address,
        r.ContactNumber, r.Capacity, r.CurrentOccupancy, r.Facilities, r.Availability,
        r.OpeningDate, r.Notes, r.Status, r.SubmittedAt, r.ReviewedAt,
        r.ReviewedByUser?.Email, r.RejectionReason, r.PublishedCentreId);
}
