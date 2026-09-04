# FloodSafe LK — Flood Incident Management

Community flood incident reporting for Sri Lanka. This repository implements **only** the Flood Incident Management feature (Member: Kowdu.A.B / IT24103356). Safe Centre, Emergency Resource, and Community Assistance features are out of scope.

Sample records are demonstration data. They are **not** official Disaster Management Centre, NBRO, or government alerts.

```
React (Vite)  →  ASP.NET Core REST API  →  EF Core  →  PostgreSQL
```

## Prerequisites

- .NET 8 SDK
- Node.js 18+
- PostgreSQL 14+ (pgAdmin is optional)
- `dotnet-ef` tools: `dotnet tool install --global dotnet-ef`

## Configure PostgreSQL (no password in source)

The committed connection string has **no password**:

```
Host=localhost;Port=5432;Database=floodsafelk;Username=postgres
```

Set the password (and optionally the full string) using user secrets or an environment variable.

```powershell
cd backend/FloodSafeLK.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=floodsafelk;Username=postgres;Password=YOUR_PASSWORD"
```

Or in PowerShell for the current session:

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Port=5432;Database=floodsafelk;Username=postgres;Password=YOUR_PASSWORD"
```

Create an empty database named `floodsafelk` in pgAdmin (or `createdb floodsafelk`) if your server does not allow EF to create it.

## Backend commands

```powershell
cd backend/FloodSafeLK.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run --launch-profile http
```

`InitialCreate` is already in `Migrations/`. You only need `migrations add` again if the model changes.

On startup the API applies pending migrations and seeds 10 sample Sri Lankan incidents when the table is empty.

- HTTP API: http://localhost:5203
- Swagger: http://localhost:5203/swagger

## Frontend commands

```powershell
cd frontend
npm install
npm run dev
```

The Vite app runs at http://localhost:5173 and calls `VITE_API_BASE_URL` from `.env.development` (`http://localhost:5203`).

## CORS

| Environment | Policy | Allowed origins |
|---|---|---|
| Development | `DevCors` | `http://localhost:5173` only |
| Production | `ProductionCors` | Origins listed in `Cors:AllowedOrigins` in configuration |

Production does **not** use `AllowAnyOrigin`. Add each deployed frontend origin to `Cors:AllowedOrigins` (or the `Cors__AllowedOrigins__0` environment variable). HTTPS redirection is enabled only in production.

## Risk calculation (prototype)

Score = severity + water level + affected people + road accessibility.

| Factor | Points |
|---|---|
| Severity Low / Moderate / High / Severe | 10 / 25 / 40 / 55 |
| Water &lt;30 / 30–59 / 60–99 / ≥100 cm | 5 / 15 / 25 / 35 |
| People 0–9 / 10–49 / 50–199 / ≥200 | 0 / 10 / 20 / 30 |
| Road Open / Restricted / Closed | 0 / 10 / 20 |

Levels: 0–24 Low, 25–49 Medium, 50–74 High, 75+ Critical.

Displayed disclaimer: *This is a prototype risk calculation for demonstration purposes and is not an official disaster prediction.*

Clients cannot set `riskScore`, `riskLevel`, or `isSample`. Those are assigned on the server.

## API contract

Base URL: `http://localhost:5203/api/incidents`

### POST /api/incidents

Creates an incident, calculates risk, stores the row in PostgreSQL.

**Request body (`CreateIncidentDto`)**

```json
{
  "reporterName": "Amal Silva",
  "phone": "0771234567",
  "district": "Colombo",
  "location": "Wellampitiya junction",
  "incidentType": "UrbanFlooding",
  "severity": "Moderate",
  "description": "At least twenty characters describing the incident.",
  "dateTime": "2026-09-04T10:00:00+05:30",
  "waterLevel": 35,
  "affectedPeople": 12,
  "roadAccessibility": "Restricted"
}
```

| Status | When |
|---|---|
| **201** | Created. Body is `IncidentDto`. `Location` header points to GET by id. |
| **400** | Validation failed (missing fields, invalid phone, ranges, or enum-like values). |

### GET /api/incidents

Lists incidents. Query parameters (server-side):

- `search` — location, district, reporter, description, type
- `district`, `severity`, `incidentType`
- `sortBy` — `date` (default), `severity`, `risk`, `affectedPeople`
- `sortDir` — `asc` or `desc` (default `desc`)

| Status | When |
|---|---|
| **200** | JSON array. Empty array if nothing matches. |

### GET /api/incidents/{id}

| Status | When |
|---|---|
| **200** | `IncidentDto` |
| **404** | Unknown or non-GUID id (non-GUID routes return 404 from the constraint) |

### PUT /api/incidents/{id}

Same body shape as create (`UpdateIncidentDto`). Risk is recalculated.

| Status | When |
|---|---|
| **200** | Updated `IncidentDto` |
| **400** | Invalid body |
| **404** | Id not found |

### DELETE /api/incidents/{id}

| Status | When |
|---|---|
| **204** | Deleted |
| **404** | Id not found |

Unhandled failures return **500** Problem Details without EF stack traces for end users (development may include a short exception message).

### Allowed values

- **Districts:** the 25 Sri Lankan districts (Ampara … Vavuniya)
- **IncidentType:** FlashFlood, RiverOverflow, UrbanFlooding, LandslideRelated, CoastalFlooding, ReservoirOverflow
- **Severity:** Low, Moderate, High, Severe
- **RoadAccessibility:** Open, Restricted, Closed
- **Phone:** `07XXXXXXXX` or `+947XXXXXXXX`

## Feature files (this member)

Frontend: `src/pages/Incidents.jsx`, `src/pages/ReportIncident.jsx`, `src/components/IncidentCard.jsx`, `src/components/IncidentForm.jsx`, `src/components/IncidentDetails.jsx`, `src/services/incidentService.js`

Backend: `Models/Incident.cs`, `DTOs/*Incident*.cs`, `Controllers/IncidentsController.cs`, `Services/IncidentService.cs`, `Data/ApplicationDbContext.cs`, `Data/IncidentSeeder.cs`, `Migrations/`

## CRUD test checklist

### CREATE

- [ ] Valid incident → **201**, row visible in pgAdmin `Incidents`
- [ ] Missing required values → **400**
- [ ] Invalid phone → **400**
- [ ] Invalid affected people (negative or non-integer) → **400**

### READ

- [ ] GET all → **200** and sample + user rows
- [ ] GET by id → **200**
- [ ] Search (`search=Kolonnawa`) returns matching rows
- [ ] Filters by district, severity, and incident type
- [ ] Sorting by date / risk / affected people

### UPDATE

- [ ] Valid update → **200**, pgAdmin shows new values, risk score changed if inputs changed
- [ ] Invalid update → **400**
- [ ] Unknown id → **404**

### DELETE

- [ ] Valid delete → **204**, row gone in pgAdmin
- [ ] Unknown id → **404**
- [ ] Cancel the browser confirm dialog → record remains

### DATABASE

- [ ] Record created in PostgreSQL (not localStorage)
- [ ] Updated record persisted
- [ ] Deleted record removed
- [ ] Restart the API (`Ctrl+C`, `dotnet run`) — user-created rows are still there; sample rows are not re-seeded if the table is not empty

### HTTP STATUS

- [ ] 200 list / get / update
- [ ] 201 create
- [ ] 204 delete
- [ ] 400 validation
- [ ] 404 missing id
- [ ] 500 only on unexpected server/database failure; UI shows a friendly message

---

# Member 2 — Safe Centre Management

**Member:** Maddegoda M.V.S.  
**Student ID:** IT24101739  
**Role:** Safe Centre Management Developer  

This feature provides end-to-end management for flood safe centres and emergency shelters across Sri Lanka.

## Architecture

```
React (Vite)  →  ASP.NET Core REST API  →  EF Core  →  PostgreSQL
```

All safe centre data is permanently stored in PostgreSQL in the `SafeCentres` table.

## Feature Files (Member 2)

- **Frontend:**
  - `src/pages/SafeCentres.jsx` — Safe centres directory, statistics, search/filter, and modal orchestrations
  - `src/components/SafeCentreCard.jsx` — Card display with capacity bar and quick actions
  - `src/components/SafeCentreForm.jsx` — Controlled form with real-time field validation
  - `src/components/SafeCentreDetails.jsx` — Detailed modal view of a shelter
  - `src/components/SafeCentreFilters.jsx` — Sri Lanka 25-district filter, search bar, and availability toggle
  - `src/styles/safecentres.css` — Responsive glassmorphism styling
  - `src/services/safeCentreService.js` — Async fetch service for all CRUD operations

- **Backend:**
  - `Models/SafeCentre.cs` — Entity with data annotations and `[NotMapped] AvailableSpaces`
  - `DTOs/SafeCentreDto.cs`, `DTOs/CreateSafeCentreDto.cs`, `DTOs/UpdateSafeCentreDto.cs` — Request/response contracts with validations
  - `Controllers/SafeCentresController.cs` — REST API endpoints
  - `Services/ISafeCentreService.cs`, `Services/SafeCentreService.cs` — Business logic and data access
  - `Data/ApplicationDbContext.cs` — `SafeCentres` DbSet and model configuration
  - `Data/SafeCentreSeeder.cs` — 10 seeded Sri Lankan shelters
  - `Migrations/*_AddSafeCentres.cs` — EF Core migration for `SafeCentres` table

## API Contract — Safe Centres

Base URL: `http://localhost:5203/api/safecentres`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| **POST** | `/api/safecentres` | Create a safe centre | `201 Created`, `400 Bad Request` |
| **GET** | `/api/safecentres` | List safe centres (filters: `search`, `district`, `availability`) | `200 OK` |
| **GET** | `/api/safecentres/{id}` | Get safe centre by ID | `200 OK`, `404 Not Found` |
| **PUT** | `/api/safecentres/{id}` | Update existing safe centre | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/safecentres/{id}` | Delete safe centre | `204 No Content`, `404 Not Found` |

### Business Rules & Validations
- `Capacity` must be greater than 0.
- `CurrentOccupancy` must be 0 or more and cannot exceed `Capacity`.
- `AvailableSpaces` is dynamically calculated (`Capacity - CurrentOccupancy`) and never stored directly in the database.
- `Name`, `District`, `Address`, and `ContactNumber` are required.
- Contact numbers are validated against standard phone formats.

