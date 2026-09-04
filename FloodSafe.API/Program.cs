using Microsoft.EntityFrameworkCore;
using FloodSafe.API.Data;
using FloodSafe.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Services ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "FloodSafe LK — Assistance Request API",
        Version = "v1",
        Description = "Community Assistance Request Management for FloodSafe LK. Student ID: IT24102706"
    });
});

// ── Database ───────────────────────────────────────────────────────────────
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Application Services ───────────────────────────────────────────────────
builder.Services.AddScoped<IAssistanceRequestService, AssistanceRequestService>();

// ── CORS ───────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Middleware ─────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FloodSafe API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowVite");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// ── Database Migration & Seeding ───────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
    await DataSeeder.SeedAsync(db);
}

app.Run();
