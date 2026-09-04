using FloodSafeLK.Api.Models;
using FloodSafeLK.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Data;

public static class IncidentSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Incidents.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        var samples = new List<Incident>();

        void Add(
            string reporter,
            string phone,
            string district,
            string location,
            string type,
            string severity,
            string description,
            DateTimeOffset occurredAt,
            decimal waterCm,
            int people,
            string road)
        {
            var (score, level) = RiskCalculator.Calculate(severity, waterCm, people, road);
            samples.Add(new Incident
            {
                Id = Guid.NewGuid(),
                ReporterName = reporter,
                Phone = phone,
                District = district,
                Location = location,
                IncidentType = type,
                Severity = severity,
                Description = description,
                DateTime = occurredAt,
                WaterLevel = waterCm,
                AffectedPeople = people,
                RoadAccessibility = road,
                RiskScore = score,
                RiskLevel = level,
                IsSample = true,
                CreatedAt = now,
                UpdatedAt = now
            });
        }

        Add(
            "Nimal Perera",
            "0771234567",
            "Colombo",
            "Kolonnawa low-lying canal belt",
            "UrbanFlooding",
            "High",
            "Canal overflow after overnight rain has flooded ground-floor homes along the Kolonnawa canal. Families are moving belongings upstairs. This is demonstration data, not a live DMC alert.",
            now.AddHours(-6),
            85,
            120,
            "Restricted");

        Add(
            "Fathima Rizwan",
            "0718899001",
            "Colombo",
            "Kaduwela, New Kandy Road underpass",
            "FlashFlood",
            "Severe",
            "Rapid water rise at the Kaduwela underpass after a short intense shower. Vehicles stalled in knee-deep water. Demonstration sample only.",
            now.AddHours(-3),
            110,
            45,
            "Closed");

        Add(
            "Sanduni Jayawardena",
            "0753344556",
            "Ratnapura",
            "Ratnapura town, Kalu Ganga bank",
            "RiverOverflow",
            "Severe",
            "Kalu Ganga is over bank near the town bazaar. Several shops have ankle-to-knee water. Sample record for coursework demonstration.",
            now.AddHours(-10),
            140,
            280,
            "Closed");

        Add(
            "Kasun Fernando",
            "0762211443",
            "Kalutara",
            "Kalutara North, Palatota road",
            "RiverOverflow",
            "High",
            "Kalu Ganga backwater on Palatota road. School vans diverted. Not an official warning — sample data for FloodSafe LK.",
            now.AddHours(-14),
            70,
            60,
            "Restricted");

        Add(
            "Tharushi Silva",
            "0705566778",
            "Matara",
            "Nilwala river flats, Thudawa",
            "RiverOverflow",
            "Moderate",
            "Nilwala river water on paddy-side lanes in Thudawa. Access still possible for high vehicles. Demonstration incident only.",
            now.AddHours(-20),
            45,
            22,
            "Restricted");

        Add(
            "Mohamed Ameen",
            "0729988776",
            "Batticaloa",
            "Batticaloa lagoon-side, Kallady",
            "CoastalFlooding",
            "Moderate",
            "Lagoon water on low yards after spring tide and rain. A few gardens inundated. Sample data, not a live coastal advisory.",
            now.AddHours(-8),
            35,
            18,
            "Open");

        Add(
            "Ruwan Bandara",
            "0741122334",
            "Kegalle",
            "Sitawaka valley road, Deraniyagala approach",
            "LandslideRelated",
            "High",
            "Slope seepage and muddy runoff have blocked one lane after heavy rain. Nearby homes reporting yard flooding. Coursework sample only.",
            now.AddHours(-18),
            55,
            35,
            "Restricted");

        Add(
            "Ishara Wickramasinghe",
            "0774455667",
            "Gampaha",
            "Kelaniya, Biyagama road low stretch",
            "UrbanFlooding",
            "Low",
            "Shallow flooding on a low stretch of Biyagama road after drain blockage. Traffic slow but moving. Demonstration record.",
            now.AddHours(-2),
            22,
            8,
            "Open");

        Add(
            "Chamari Gunasekara",
            "+94718877665",
            "Galle",
            "Gin Ganga, Baddegama approach",
            "RiverOverflow",
            "High",
            "Gin Ganga water on the Baddegama approach road. Three-wheelers turning back. This is sample data for the FloodSafe LK prototype.",
            now.AddHours(-12),
            95,
            90,
            "Closed");

        Add(
            "Pradeep Rathnayake",
            "0782233445",
            "Colombo",
            "Wellampitiya, Sedawatta lane",
            "UrbanFlooding",
            "Moderate",
            "Stagnant drain water in Sedawatta lanes after rain. Ground floors damp, roads still passable on foot. Not official government information.",
            now.AddHours(-5),
            40,
            30,
            "Open");

        db.Incidents.AddRange(samples);
        await db.SaveChangesAsync(cancellationToken);
    }
}
