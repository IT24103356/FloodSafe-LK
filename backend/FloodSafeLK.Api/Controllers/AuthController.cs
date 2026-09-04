using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FloodSafeLK.Api.DTOs;
using FloodSafeLK.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace FloodSafeLK.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    UserManager<ApplicationUser> userManager,
    IConfiguration configuration) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto dto)
    {
        var user = await userManager.FindByEmailAsync(dto.Email.Trim());
        if (user is null || !await userManager.CheckPasswordAsync(user, dto.Password)
            || !await userManager.IsInRoleAsync(user, "Admin"))
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Invalid administrator credentials."
            });
        }

        var key = configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key is not configured.");
        var issuer = configuration["Jwt:Issuer"] ?? "FloodSafeLK.Api";
        var audience = configuration["Jwt:Audience"] ?? "FloodSafeLK.Frontend";
        var expiresAt = DateTime.UtcNow.AddMinutes(
            configuration.GetValue("Jwt:ExpiryMinutes", 60));

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, "Admin")
        };

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                SecurityAlgorithms.HmacSha256));

        return Ok(new LoginResponseDto(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAt,
            user.Email!,
            "Admin"));
    }
}
