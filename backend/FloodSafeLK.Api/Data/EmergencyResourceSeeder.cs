using FloodSafeLK.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FloodSafeLK.Api.Data;

/// <summary>
/// Seeds realistic Sri Lankan demo/sample data into the database on first run.
/// All seeded records are marked with IsSample = true.
/// Author: Mamalgaha I.G.W.S. (IT24102615) - Emergency Resource Management (Member 3)
/// </summary>
public static class EmergencyResourceSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Only seed if no resources exist yet
        if (await context.EmergencyResources.AnyAsync()) return;

        var sampleResources = new List<EmergencyResource>
        {
            // ── Colombo District ─────────────────────────────────────────────
            new() {
                ResourceName    = "Bottled Drinking Water 500ml",
                ResourceType    = "Drinking Water",
                District        = "Colombo",
                Location        = "Colombo District Secretariat, Cinnamon Gardens",
                Quantity        = 5000,
                Unit            = "Bottles",
                MinimumRequired = 2000,
                Status          = "Available",
                Notes           = "Donated by National Water Supply & Drainage Board",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            new() {
                ResourceName    = "Emergency Food Packs (3-day supply)",
                ResourceType    = "Food",
                District        = "Colombo",
                Location        = "Sugathadasa Indoor Stadium, Colombo 10",
                Quantity        = 800,
                Unit            = "Packs",
                MinimumRequired = 1000,
                Status          = "Low Stock",
                Notes           = "Contains rice, dhal, canned fish, and biscuits",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Gampaha District ─────────────────────────────────────────────
            new() {
                ResourceName    = "First Aid Kit — Standard",
                ResourceType    = "First Aid",
                District        = "Gampaha",
                Location        = "Gampaha Divisional Secretariat",
                Quantity        = 250,
                Unit            = "Kits",
                MinimumRequired = 100,
                Status          = "Available",
                Notes           = "Includes bandages, antiseptic, ORS sachets",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            new() {
                ResourceName    = "Emergency Blankets",
                ResourceType    = "Blankets",
                District        = "Gampaha",
                Location        = "Ja-Ela Flood Relief Depot",
                Quantity        = 400,
                Unit            = "Pieces",
                MinimumRequired = 500,
                Status          = "Low Stock",
                Notes           = "Thermal emergency blankets",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Kalutara District ────────────────────────────────────────────
            new() {
                ResourceName    = "Hygiene Kit (Family Pack)",
                ResourceType    = "Hygiene Kits",
                District        = "Kalutara",
                Location        = "Kalutara District Disaster Management Unit",
                Quantity        = 320,
                Unit            = "Kits",
                MinimumRequired = 150,
                Status          = "Available",
                Notes           = "Contains soap, toothbrush, toothpaste, sanitary pads",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Kandy District ───────────────────────────────────────────────
            new() {
                ResourceName    = "LED Flashlights",
                ResourceType    = "Flashlights",
                District        = "Kandy",
                Location        = "Kandy Municipal Council Emergency Store",
                Quantity        = 180,
                Unit            = "Units",
                MinimumRequired = 200,
                Status          = "Low Stock",
                Notes           = "Includes spare batteries. Critical for night evacuations.",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            new() {
                ResourceName    = "Water Purification Tablets",
                ResourceType    = "Drinking Water",
                District        = "Kandy",
                Location        = "Peradeniya Hospital Emergency Depot",
                Quantity        = 10000,
                Unit            = "Tablets",
                MinimumRequired = 3000,
                Status          = "Available",
                Notes           = "Chlorine-based tablets; 1 tablet per 1L water",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Ratnapura District ───────────────────────────────────────────
            new() {
                ResourceName    = "Dry Rations Pack",
                ResourceType    = "Food",
                District        = "Ratnapura",
                Location        = "Ratnapura Divisional Secretariat Warehouse",
                Quantity        = 1200,
                Unit            = "Packs",
                MinimumRequired = 800,
                Status          = "Available",
                Notes           = "7-day supply per family. Sabaragamuwa Province allocation.",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Batticaloa District ──────────────────────────────────────────
            new() {
                ResourceName    = "Advanced First Aid Kit",
                ResourceType    = "First Aid",
                District        = "Batticaloa",
                Location        = "Batticaloa Teaching Hospital Relief Store",
                Quantity        = 75,
                Unit            = "Kits",
                MinimumRequired = 80,
                Status          = "Low Stock",
                Notes           = "Includes IV sets, suturing materials",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Ampara District ──────────────────────────────────────────────
            new() {
                ResourceName    = "Portable Water Storage Tanks",
                ResourceType    = "Other",
                District        = "Ampara",
                Location        = "Ampara District Secretariat, Ampara Town",
                Quantity        = 30,
                Unit            = "Tanks",
                MinimumRequired = 10,
                Status          = "Available",
                Notes           = "1000L capacity each. For temporary displaced communities.",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Trincomalee District ─────────────────────────────────────────
            new() {
                ResourceName    = "Family Blanket Set",
                ResourceType    = "Blankets",
                District        = "Trincomalee",
                Location        = "Trincomalee Divisional Secretariat",
                Quantity        = 600,
                Unit            = "Sets",
                MinimumRequired = 300,
                Status          = "Available",
                Notes           = "Donated by Sri Lanka Red Cross Society",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Hambantota District ──────────────────────────────────────────
            new() {
                ResourceName    = "Personal Hygiene Kit",
                ResourceType    = "Hygiene Kits",
                District        = "Hambantota",
                Location        = "Hambantota Port Emergency Logistics Hub",
                Quantity        = 0,
                Unit            = "Kits",
                MinimumRequired = 200,
                Status          = "Depleted",
                Notes           = "Urgently restock needed. Last dispatch: 2 days ago.",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Kurunegala District ──────────────────────────────────────────
            new() {
                ResourceName    = "Emergency Flashlight Solar",
                ResourceType    = "Flashlights",
                District        = "Kurunegala",
                Location        = "Kurunegala District Disaster Relief Center",
                Quantity        = 350,
                Unit            = "Units",
                MinimumRequired = 100,
                Status          = "Available",
                Notes           = "Solar-charged. Suitable for extended power outages.",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Galle District ───────────────────────────────────────────────
            new() {
                ResourceName    = "Canned Food Supplies",
                ResourceType    = "Food",
                District        = "Galle",
                Location        = "Galle Fort Emergency Depot, Southern Province",
                Quantity        = 950,
                Unit            = "Cans",
                MinimumRequired = 1000,
                Status          = "Low Stock",
                Notes           = "Mix of canned tuna, sardines, and vegetables",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            },
            // ── Jaffna District ──────────────────────────────────────────────
            new() {
                ResourceName    = "Clean Water Sachets 200ml",
                ResourceType    = "Drinking Water",
                District        = "Jaffna",
                Location        = "Jaffna Teaching Hospital Compound",
                Quantity        = 8000,
                Unit            = "Sachets",
                MinimumRequired = 2500,
                Status          = "Available",
                Notes           = "Northern Province WASH program stock",
                IsSample        = true,
                LastUpdated     = DateTime.UtcNow
            }
        };

        await context.EmergencyResources.AddRangeAsync(sampleResources);
        await context.SaveChangesAsync();
    }
}
