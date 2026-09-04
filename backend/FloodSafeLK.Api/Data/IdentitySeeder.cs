using FloodSafeLK.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace FloodSafeLK.Api.Data;

public static class IdentitySeeder
{
    public static async Task SeedAdminAsync(IServiceProvider services, IConfiguration configuration)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            var roleResult = await roleManager.CreateAsync(new IdentityRole("Admin"));
            EnsureSucceeded(roleResult, "create the Admin role");
        }

        var email = configuration["Admin:Email"];
        var password = configuration["Admin:Password"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                "Admin:Email and Admin:Password must be configured using user secrets or environment variables.");
        }

        var admin = await userManager.FindByEmailAsync(email);
        if (admin is null)
        {
            admin = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };
            EnsureSucceeded(await userManager.CreateAsync(admin, password), "create the admin account");
        }

        if (!await userManager.IsInRoleAsync(admin, "Admin"))
        {
            EnsureSucceeded(await userManager.AddToRoleAsync(admin, "Admin"), "assign the Admin role");
        }
    }

    private static void EnsureSucceeded(IdentityResult result, string action)
    {
        if (result.Succeeded)
        {
            return;
        }

        throw new InvalidOperationException(
            $"Could not {action}: {string.Join("; ", result.Errors.Select(error => error.Description))}");
    }
}
