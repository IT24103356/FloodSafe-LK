using FloodSafe.API.Data;
using FloodSafe.API.Models;

namespace FloodSafe.API.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (context.AssistanceRequests.Any(r => r.IsSample))
            return;

        var samples = new List<AssistanceRequest>
        {
            new() {
                RequesterName = "[DEMO] Kumari Perera",
                Phone = "0771234567",
                District = "Colombo",
                Location = "Wellampitiya, Colombo 10",
                RequestType = RequestType.Food,
                Priority = Priority.Critical,
                Description = "[SAMPLE DATA] Family of 6 stranded after floods. Need emergency food supplies urgently. Water rising rapidly.",
                NumberOfPeople = 6,
                Status = RequestStatus.Pending,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-5)
            },
            new() {
                RequesterName = "[DEMO] Sunil Bandara",
                Phone = "0712345678",
                District = "Gampaha",
                Location = "Ja-Ela, Gampaha",
                RequestType = RequestType.Water,
                Priority = Priority.High,
                Description = "[SAMPLE DATA] Drinking water contaminated due to flooding. Need clean water for 20 households in the area.",
                NumberOfPeople = 80,
                Status = RequestStatus.InProgress,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-8)
            },
            new() {
                RequesterName = "[DEMO] Nimalka Fernando",
                Phone = "0776543210",
                District = "Kalutara",
                Location = "Panadura, Kalutara",
                RequestType = RequestType.Medical,
                Priority = Priority.Critical,
                Description = "[SAMPLE DATA] Elderly patient needs insulin medication. Cannot travel due to flooded roads. Medical assistance required immediately.",
                NumberOfPeople = 1,
                Status = RequestStatus.Pending,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-2)
            },
            new() {
                RequesterName = "[DEMO] Chaminda Rajapaksa",
                Phone = "0718765432",
                District = "Ratnapura",
                Location = "Embilipitiya, Ratnapura",
                RequestType = RequestType.Evacuation,
                Priority = Priority.Critical,
                Description = "[SAMPLE DATA] 15 people trapped on upper floor of flooded building. Roads completely submerged. Immediate evacuation needed.",
                NumberOfPeople = 15,
                Status = RequestStatus.InProgress,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-3)
            },
            new() {
                RequesterName = "[DEMO] Priya Jayawardena",
                Phone = "0754321098",
                District = "Matara",
                Location = "Weligama, Matara",
                RequestType = RequestType.Shelter,
                Priority = Priority.High,
                Description = "[SAMPLE DATA] Family home flooded and uninhabitable. Need temporary shelter for 4 family members including 2 small children.",
                NumberOfPeople = 4,
                Status = RequestStatus.Pending,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-6)
            },
            new() {
                RequesterName = "[DEMO] Roshan Silva",
                Phone = "0789012345",
                District = "Galle",
                Location = "Ambalangoda, Galle",
                RequestType = RequestType.Transport,
                Priority = Priority.Medium,
                Description = "[SAMPLE DATA] Need transport to evacuate 8 elderly residents from flood-prone area to safe ground before nightfall.",
                NumberOfPeople = 8,
                Status = RequestStatus.Resolved,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-12)
            },
            new() {
                RequesterName = "[DEMO] Malini Dissanayake",
                Phone = "0731234567",
                District = "Kandy",
                Location = "Peradeniya, Kandy",
                RequestType = RequestType.Food,
                Priority = Priority.Medium,
                Description = "[SAMPLE DATA] Small community of 30 people cut off by landslide. Food reserves depleted. Need supply delivery within 24 hours.",
                NumberOfPeople = 30,
                Status = RequestStatus.Pending,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-4)
            },
            new() {
                RequesterName = "[DEMO] Asela Wickramasinghe",
                Phone = "0765432109",
                District = "Kurunegala",
                Location = "Kuliyapitiya, Kurunegala",
                RequestType = RequestType.Water,
                Priority = Priority.Low,
                Description = "[SAMPLE DATA] Water supply disrupted in area. Local well flooded. Need clean water supply for the next few days.",
                NumberOfPeople = 12,
                Status = RequestStatus.Resolved,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-24)
            },
            new() {
                RequesterName = "[DEMO] Thilini Gunawardena",
                Phone = "0777890123",
                District = "Ampara",
                Location = "Kalmunai, Ampara",
                RequestType = RequestType.Medical,
                Priority = Priority.High,
                Description = "[SAMPLE DATA] Several flood victims with injuries need medical attention. Local clinic inaccessible. Requesting mobile medical unit.",
                NumberOfPeople = 7,
                Status = RequestStatus.InProgress,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-7)
            },
            new() {
                RequesterName = "[DEMO] Kasun Madushan",
                Phone = "0701234567",
                District = "Batticaloa",
                Location = "Eravur, Batticaloa",
                RequestType = RequestType.Other,
                Priority = Priority.Medium,
                Description = "[SAMPLE DATA] School building used as temporary shelter needs sanitation supplies and basic utilities restored for 50+ displaced residents.",
                NumberOfPeople = 55,
                Status = RequestStatus.Pending,
                IsSample = true,
                CreatedAt = DateTime.UtcNow.AddHours(-9)
            }
        };

        await context.AssistanceRequests.AddRangeAsync(samples);
        await context.SaveChangesAsync();
    }
}
