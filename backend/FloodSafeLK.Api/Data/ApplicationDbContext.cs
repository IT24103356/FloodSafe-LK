using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<EmergencyResource> EmergencyResources => Set<EmergencyResource>();
    public DbSet<SafeCentre> SafeCentres => Set<SafeCentre>();
    public DbSet<AssistanceRequest> AssistanceRequests => Set<AssistanceRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var incident = modelBuilder.Entity<Incident>();

        incident.HasKey(e => e.Id);
        incident.Property(e => e.Id).ValueGeneratedNever();

        incident.Property(e => e.ReporterName).IsRequired().HasMaxLength(100);
        incident.Property(e => e.Phone).IsRequired().HasMaxLength(15);
        incident.Property(e => e.District).IsRequired().HasMaxLength(50);
        incident.Property(e => e.Location).IsRequired().HasMaxLength(200);
        incident.Property(e => e.IncidentType).IsRequired().HasMaxLength(40);
        incident.Property(e => e.Severity).IsRequired().HasMaxLength(20);
        incident.Property(e => e.Description).IsRequired().HasMaxLength(1000);
        incident.Property(e => e.RoadAccessibility).IsRequired().HasMaxLength(20);
        incident.Property(e => e.RiskLevel).IsRequired().HasMaxLength(20);
        incident.Property(e => e.WaterLevel).HasPrecision(8, 2);

        incident.HasIndex(e => e.District);
        incident.HasIndex(e => e.Severity);
        incident.HasIndex(e => e.IncidentType);
        incident.HasIndex(e => e.DateTime);

        // EmergencyResource Configuration (Member 3 - IT24102615)
        var resource = modelBuilder.Entity<EmergencyResource>();
        resource.HasKey(e => e.Id);
        resource.Property(e => e.ResourceName).IsRequired().HasMaxLength(200);
        resource.Property(e => e.ResourceType).IsRequired().HasMaxLength(100);
        resource.Property(e => e.District).IsRequired().HasMaxLength(100);
        resource.Property(e => e.Location).IsRequired().HasMaxLength(300);
        resource.Property(e => e.Quantity).HasColumnType("decimal(18,2)");
        resource.Property(e => e.Unit).IsRequired().HasMaxLength(50);
        resource.Property(e => e.MinimumRequired).HasColumnType("decimal(18,2)");
        resource.Property(e => e.Status).IsRequired().HasMaxLength(50);
        resource.Property(e => e.Notes).HasMaxLength(1000);

        resource.HasIndex(e => e.District);
        resource.HasIndex(e => e.ResourceType);
        resource.HasIndex(e => e.Status);

        var safeCentre = modelBuilder.Entity<SafeCentre>();
        safeCentre.HasKey(s => s.Id);
        safeCentre.Property(s => s.Id).ValueGeneratedOnAdd();
        safeCentre.Property(s => s.Name).IsRequired().HasMaxLength(200);
        safeCentre.Property(s => s.District).IsRequired().HasMaxLength(100);
        safeCentre.Property(s => s.Address).IsRequired().HasMaxLength(500);
        safeCentre.Property(s => s.ContactNumber).IsRequired().HasMaxLength(20);
        safeCentre.Property(s => s.Facilities).HasMaxLength(1000);
        safeCentre.Property(s => s.Notes).HasMaxLength(1000);
        safeCentre.Ignore(s => s.AvailableSpaces);

        safeCentre.HasIndex(s => s.District);
        safeCentre.HasIndex(s => s.Availability);

        var assistanceRequest = modelBuilder.Entity<AssistanceRequest>();
        assistanceRequest.HasKey(r => r.Id);
        assistanceRequest.Property(r => r.RequesterName).IsRequired().HasMaxLength(100);
        assistanceRequest.Property(r => r.Phone).IsRequired().HasMaxLength(20);
        assistanceRequest.Property(r => r.District).IsRequired().HasMaxLength(50);
        assistanceRequest.Property(r => r.Location).IsRequired().HasMaxLength(200);
        assistanceRequest.Property(r => r.Description).IsRequired().HasMaxLength(1000);
        assistanceRequest.Property(r => r.RequestType).HasConversion<string>().HasMaxLength(30);
        assistanceRequest.Property(r => r.Priority).HasConversion<string>().HasMaxLength(20);
        assistanceRequest.Property(r => r.Status).HasConversion<string>().HasMaxLength(20);

        assistanceRequest.HasIndex(r => r.District);
        assistanceRequest.HasIndex(r => r.RequestType);
        assistanceRequest.HasIndex(r => r.Priority);
        assistanceRequest.HasIndex(r => r.Status);
    }
}
