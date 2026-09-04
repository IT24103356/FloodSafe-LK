using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;
using FloodSafeLK.Api.Validation;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Services;

public class IncidentService : IIncidentService
{
    private readonly ApplicationDbContext _db;

    public IncidentService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<IncidentDto>> GetAllAsync(IncidentQuery query, CancellationToken cancellationToken = default)
    {
        var incidents = _db.Incidents.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLower();
            incidents = incidents.Where(i =>
                i.Location.ToLower().Contains(term) ||
                i.District.ToLower().Contains(term) ||
                i.ReporterName.ToLower().Contains(term) ||
                i.Description.ToLower().Contains(term) ||
                i.IncidentType.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(query.District))
        {
            var district = query.District.Trim();
            incidents = incidents.Where(i => i.District.ToLower() == district.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(query.Severity))
        {
            var severity = query.Severity.Trim();
            incidents = incidents.Where(i => i.Severity.ToLower() == severity.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(query.IncidentType))
        {
            var type = query.IncidentType.Trim();
            incidents = incidents.Where(i => i.IncidentType.ToLower() == type.ToLower());
        }

        var sortBy = (query.SortBy ?? "date").Trim().ToLowerInvariant();
        var sortDir = (query.SortDir ?? "desc").Trim().ToLowerInvariant();
        var descending = sortDir != "asc";

        incidents = (sortBy, descending) switch
        {
            ("severity", true) => incidents.OrderByDescending(i => i.Severity).ThenByDescending(i => i.DateTime),
            ("severity", false) => incidents.OrderBy(i => i.Severity).ThenByDescending(i => i.DateTime),
            ("risk", true) => incidents.OrderByDescending(i => i.RiskScore).ThenByDescending(i => i.DateTime),
            ("risk", false) => incidents.OrderBy(i => i.RiskScore).ThenByDescending(i => i.DateTime),
            ("affectedpeople", true) => incidents.OrderByDescending(i => i.AffectedPeople).ThenByDescending(i => i.DateTime),
            ("affectedpeople", false) => incidents.OrderBy(i => i.AffectedPeople).ThenByDescending(i => i.DateTime),
            (_, true) => incidents.OrderByDescending(i => i.DateTime),
            (_, false) => incidents.OrderBy(i => i.DateTime)
        };

        var list = await incidents.ToListAsync(cancellationToken);
        return list.Select(ToDto).ToList();
    }

    public async Task<IncidentDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await _db.Incidents.AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        return incident is null ? null : ToDto(incident);
    }

    public async Task<IncidentDto> CreateAsync(CreateIncidentDto dto, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var (score, level) = RiskCalculator.Calculate(
            dto.Severity,
            dto.WaterLevel!.Value,
            dto.AffectedPeople!.Value,
            dto.RoadAccessibility);

        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            ReporterName = dto.ReporterName.Trim(),
            Phone = dto.Phone.Trim(),
            District = IncidentRules.Canonical(dto.District, IncidentRules.Districts),
            Location = dto.Location.Trim(),
            IncidentType = IncidentRules.Canonical(dto.IncidentType, IncidentRules.IncidentTypes),
            Severity = IncidentRules.Canonical(dto.Severity, IncidentRules.Severities),
            Description = dto.Description.Trim(),
            DateTime = dto.DateTime!.Value.ToUniversalTime(),
            WaterLevel = dto.WaterLevel.Value,
            AffectedPeople = dto.AffectedPeople.Value,
            RoadAccessibility = IncidentRules.Canonical(dto.RoadAccessibility, IncidentRules.RoadAccessibilities),
            RiskScore = score,
            RiskLevel = level,
            IsSample = false,
            CreatedAt = now,
            UpdatedAt = now
        };

        _db.Incidents.Add(incident);
        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(incident);
    }

    public async Task<IncidentDto?> UpdateAsync(Guid id, UpdateIncidentDto dto, CancellationToken cancellationToken = default)
    {
        var incident = await _db.Incidents.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (incident is null)
        {
            return null;
        }

        var (score, level) = RiskCalculator.Calculate(
            dto.Severity,
            dto.WaterLevel!.Value,
            dto.AffectedPeople!.Value,
            dto.RoadAccessibility);

        incident.ReporterName = dto.ReporterName.Trim();
        incident.Phone = dto.Phone.Trim();
        incident.District = IncidentRules.Canonical(dto.District, IncidentRules.Districts);
        incident.Location = dto.Location.Trim();
        incident.IncidentType = IncidentRules.Canonical(dto.IncidentType, IncidentRules.IncidentTypes);
        incident.Severity = IncidentRules.Canonical(dto.Severity, IncidentRules.Severities);
        incident.Description = dto.Description.Trim();
        incident.DateTime = dto.DateTime!.Value.ToUniversalTime();
        incident.WaterLevel = dto.WaterLevel.Value;
        incident.AffectedPeople = dto.AffectedPeople.Value;
        incident.RoadAccessibility = IncidentRules.Canonical(dto.RoadAccessibility, IncidentRules.RoadAccessibilities);
        incident.RiskScore = score;
        incident.RiskLevel = level;
        incident.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(incident);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var incident = await _db.Incidents.FirstOrDefaultAsync(i => i.Id == id, cancellationToken);
        if (incident is null)
        {
            return false;
        }

        _db.Incidents.Remove(incident);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static IncidentDto ToDto(Incident incident) => new()
    {
        Id = incident.Id,
        ReporterName = incident.ReporterName,
        Phone = incident.Phone,
        District = incident.District,
        Location = incident.Location,
        IncidentType = incident.IncidentType,
        Severity = incident.Severity,
        Description = incident.Description,
        DateTime = incident.DateTime,
        WaterLevel = incident.WaterLevel,
        AffectedPeople = incident.AffectedPeople,
        RoadAccessibility = incident.RoadAccessibility,
        RiskScore = incident.RiskScore,
        RiskLevel = incident.RiskLevel,
        IsSample = incident.IsSample,
        CreatedAt = incident.CreatedAt,
        UpdatedAt = incident.UpdatedAt
    };
}
