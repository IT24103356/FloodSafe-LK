using FloodSafeLK.Api.Data;
using FloodSafeLK.Api.Services;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' is missing. Set it in appsettings, user secrets, or the ConnectionStrings__DefaultConnection environment variable.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IIncidentService, IncidentService>();
builder.Services.AddScoped<IEmergencyResourceService, EmergencyResourceService>();

const string devCors = "DevCors";
const string productionCors = "ProductionCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(devCors, policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());

    var productionOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
    options.AddPolicy(productionCors, policy =>
        policy.WithOrigins(productionOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var feature = context.Features.Get<IExceptionHandlerFeature>();
        var exception = feature?.Error;
        var logger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("GlobalExceptionHandler");
        logger.LogError(exception, "Unhandled exception");

        var isDevelopment = app.Environment.IsDevelopment();
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/problem+json";
        if (app.Environment.IsDevelopment())
        {
            context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173");
        }
        await context.Response.WriteAsJsonAsync(new
        {
            type = "https://httpstatuses.com/500",
            title = "A server error occurred. Please try again later.",
            status = 500,
            detail = isDevelopment
                ? exception?.Message ?? "Unexpected error."
                : "The request could not be completed. No database details are returned to the client."
        });
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors(devCors);
}
else
{
    app.UseCors(productionCors);
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    try
    {
        await db.Database.MigrateAsync();
        await IncidentSeeder.SeedAsync(db);
        await EmergencyResourceSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Could not seed sample incidents. Apply migrations and check the PostgreSQL connection string.");
    }
}

app.Run();
