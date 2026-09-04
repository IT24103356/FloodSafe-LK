namespace FloodSafeLK.Api.Services;

/// <summary>
/// Deterministic prototype risk score used only for demonstration.
/// It is not an official disaster prediction.
/// </summary>
public static class RiskCalculator
{
    public static (int Score, string Level) Calculate(
        string severity,
        decimal waterLevelCm,
        int affectedPeople,
        string roadAccessibility)
    {
        var score = SeverityPoints(severity)
                    + WaterPoints(waterLevelCm)
                    + PeoplePoints(affectedPeople)
                    + RoadPoints(roadAccessibility);

        var level = score switch
        {
            <= 24 => "Low",
            <= 49 => "Medium",
            <= 74 => "High",
            _ => "Critical"
        };

        return (score, level);
    }

    private static int SeverityPoints(string severity) => severity.ToLowerInvariant() switch
    {
        "low" => 10,
        "moderate" => 25,
        "high" => 40,
        "severe" => 55,
        _ => 10
    };

    private static int WaterPoints(decimal waterLevelCm) => waterLevelCm switch
    {
        < 30 => 5,
        < 60 => 15,
        < 100 => 25,
        _ => 35
    };

    private static int PeoplePoints(int affectedPeople) => affectedPeople switch
    {
        < 10 => 0,
        < 50 => 10,
        < 200 => 20,
        _ => 30
    };

    private static int RoadPoints(string roadAccessibility) => roadAccessibility.ToLowerInvariant() switch
    {
        "open" => 0,
        "restricted" => 10,
        "closed" => 20,
        _ => 0
    };
}
