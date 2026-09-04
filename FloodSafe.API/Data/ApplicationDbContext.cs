using Microsoft.EntityFrameworkCore;
using FloodSafe.API.Models;

namespace FloodSafe.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<AssistanceRequest> AssistanceRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AssistanceRequest>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.RequestType)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(e => e.Priority)
                .HasConversion<string>()
                .HasMaxLength(10);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(15);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("NOW()");

            // Index for common filter columns
            entity.HasIndex(e => e.District);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
        });
    }
}
