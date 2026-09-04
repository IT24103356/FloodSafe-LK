using System.Text.RegularExpressions;

namespace FloodSafeLK.Api.Validation;

public static class IncidentRules
{
    public const int NameMaxLength = 100;
    public const int PhoneMaxLength = 15;
    public const int DistrictMaxLength = 50;
    public const int LocationMaxLength = 200;
    public const int DescriptionMinLength = 20;
    public const int DescriptionMaxLength = 1000;
    public const decimal WaterLevelMin = 0;
    public const decimal WaterLevelMax = 2000;
    public const int AffectedPeopleMin = 0;
    public const int AffectedPeopleMax = 1_000_000;

    public static readonly Regex SriLankanMobile = new(
        @"^(\+94|0)7[0-9]{8}$",
        RegexOptions.Compiled);

    public static readonly string[] Districts =
    [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Mannar",
        "Matale", "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
        "Polonnaruwa", "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ];

    public static readonly string[] IncidentTypes =
    [
        "FlashFlood",
        "RiverOverflow",
        "UrbanFlooding",
        "LandslideRelated",
        "CoastalFlooding",
        "ReservoirOverflow"
    ];

    public static readonly string[] Severities = ["Low", "Moderate", "High", "Severe"];

    public static readonly string[] RoadAccessibilities = ["Open", "Restricted", "Closed"];

    public static readonly string[] SortFields = ["date", "severity", "risk", "affectedPeople"];

    public static readonly string[] SortDirections = ["asc", "desc"];

    public static bool IsAllowed(string? value, IReadOnlyCollection<string> allowed) =>
        !string.IsNullOrWhiteSpace(value) &&
        allowed.Any(item => string.Equals(item, value.Trim(), StringComparison.OrdinalIgnoreCase));

    public static string Canonical(string value, IReadOnlyCollection<string> allowed) =>
        allowed.First(item => string.Equals(item, value.Trim(), StringComparison.OrdinalIgnoreCase));
}
