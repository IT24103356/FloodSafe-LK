using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Data;

public static class SafeCentreSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.SafeCentres.AnyAsync(cancellationToken))
        {
            return;
        }

        var samples = new List<SafeCentre>
        {
            new SafeCentre
            {
                Name = "Colombo Civic Centre Emergency Shelter",
                District = "Colombo",
                Address = "No. 1, Town Hall Place, Colombo 07",
                ContactNumber = "+94112345678",
                Capacity = 500,
                CurrentOccupancy = 320,
                Facilities = "Toilets, Drinking Water, Medical Aid, Food Distribution, Generator Power",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Main civic shelter in Colombo. Ground floor accessible.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Gampaha District Kanatha Grounds Shelter",
                District = "Gampaha",
                Address = "Kanatha Grounds, Gampaha Town, Gampaha",
                ContactNumber = "+94332245678",
                Capacity = 350,
                CurrentOccupancy = 210,
                Facilities = "Toilets, Drinking Water, Food Distribution, Charging Points",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 16, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Large open grounds. Suitable for families.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Kalutara Matugama Community Hall",
                District = "Kalutara",
                Address = "Matugama Community Hall, Matugama, Kalutara",
                ContactNumber = "+94342256789",
                Capacity = 200,
                CurrentOccupancy = 195,
                Facilities = "Toilets, Drinking Water, Medical Aid",
                Availability = false,
                OpeningDate = new DateTime(2024, 5, 17, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Almost at capacity. Seeking alternative locations.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Galle Fort Recreation Centre Shelter",
                District = "Galle",
                Address = "Dutch Fort Area, Galle 80000",
                ContactNumber = "+94912234567",
                Capacity = 400,
                CurrentOccupancy = 150,
                Facilities = "Toilets, Drinking Water, Food Distribution, Medical Aid, Wi-Fi",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 14, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — UNESCO heritage area. Coordination with local authority required.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Matara Nupe Public Grounds Relief Camp",
                District = "Matara",
                Address = "Nupe Junction, Matara 81000",
                ContactNumber = "+94412289012",
                Capacity = 300,
                CurrentOccupancy = 280,
                Facilities = "Toilets, Drinking Water, Food Distribution, Generator Power",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 18, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Near Nilwala river. Monitor water level continuously.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Ratnapura Balangoda Divisional Secretariat",
                District = "Ratnapura",
                Address = "Balangoda DS Office, Balangoda 70140",
                ContactNumber = "+94452212345",
                Capacity = 250,
                CurrentOccupancy = 90,
                Facilities = "Toilets, Drinking Water, Medical Aid, Charging Points",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 19, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — DS office compound used as temporary shelter.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Kegalle Town Gymnasium Emergency Centre",
                District = "Kegalle",
                Address = "Kegalle Municipal Gymnasium, Kegalle 71000",
                ContactNumber = "+94352267890",
                Capacity = 180,
                CurrentOccupancy = 60,
                Facilities = "Toilets, Drinking Water, Food Distribution",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 20, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Gymnasium converted for emergency use.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Hambantota Tangalle Urban Council Hall",
                District = "Hambantota",
                Address = "Urban Council Building, Tangalle, Hambantota",
                ContactNumber = "+94472223456",
                Capacity = 150,
                CurrentOccupancy = 0,
                Facilities = "Toilets, Drinking Water",
                Availability = false,
                OpeningDate = new DateTime(2024, 5, 21, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Currently closed for maintenance. Reopening pending.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Kurunegala Youth Centre Relief Shelter",
                District = "Kurunegala",
                Address = "Youth Centre Road, Kurunegala 60000",
                ContactNumber = "+94372234567",
                Capacity = 220,
                CurrentOccupancy = 110,
                Facilities = "Toilets, Drinking Water, Food Distribution, Charging Points",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 22, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Central location with ample parking and logistics access.",
                IsSample = true
            },
            new SafeCentre
            {
                Name = "Kandy Asgiriya Stadium Pavilion Camp",
                District = "Kandy",
                Address = "Asgiriya Stadium, Kandy 20000",
                ContactNumber = "+94812245678",
                Capacity = 300,
                CurrentOccupancy = 75,
                Facilities = "Toilets, Drinking Water, Medical Aid, Generator Power",
                Availability = true,
                OpeningDate = new DateTime(2024, 5, 23, 0, 0, 0, DateTimeKind.Utc),
                Notes = "SAMPLE DATA — Covered pavilion seating area converted for shelter.",
                IsSample = true
            }
        };

        await db.SafeCentres.AddRangeAsync(samples, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }
}
