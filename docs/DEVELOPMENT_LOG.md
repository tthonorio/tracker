## 2026-09-18 — Backend Initialization

### What I did

- Created the project repository.
- Initialized a NestJS backend using TypeScript and ESM.
- Configured npm as the package manager.
- Enabled NestJS anonymous telemetry during setup.
- Successfully started the NestJS development server.

### Result

The backend compiles successfully with zero errors and runs locally.

The default NestJS route is available at:

http://localhost:3000

### Current Project Structure

- `backend/` — NestJS backend
- `README.md` — project overview
- `PROJECT.md` — product definition
- `DATA_MODEL.md` — data model
- `ARCHITECTURE.md` — technical architecture
- `DEVELOPMENT_LOG.md` — development history

### Next

- Establish the initial backend structure.
- Integrate the TMDB API.
- Implement the first media search endpoint.


## 2026-09-20 — TMDB Media Search

### Completed
- Added environment variable support with `@nestjs/config`.
- Added TMDB API integration through the backend.
- Created the `media` module as the initial integration layer for movie and TV data.
- Implemented `GET /media/search?q={query}` using TMDB multi-search.
- Added an application-specific `MediaSearchResult` response format.
- Added DTO-based query validation.
- Added unit tests for media search and controller behavior.
- Mocked external TMDB requests in tests.
- Removed the unused NestJS Observe integration.

### Technical Decisions
- TMDB is used as the external source for movie and TV metadata.
- TMDB credentials are stored in `.env` and are never exposed to the frontend.
- Movie and TV integration initially share a single `media` module/service.
- The frontend will communicate with TMDB through our backend rather than directly.
- Search results use a lightweight application-defined structure rather than exposing TMDB's raw response.
- Detailed media information will be retrieved separately from search results.
- API input is validated at the controller boundary.
- External API calls are mocked during unit tests.

### Result
The backend can search TMDB for movies and TV shows and return clean, validated, application-specific results through the Tracker API.

### Next
Implement detailed media endpoints for individual movies and TV shows.


## 2026-09-21 — Normalized TMDB Media Details

### Completed
- Added movie detail endpoint at `GET /media/movie/:id`.
- Added TV detail endpoint at `GET /media/tv/:id`.
- Added numeric ID validation using `ParseIntPipe`.
- Added `MediaDetails`, `MovieDetails`, and `TvDetails` interfaces.
- Added normalized season data for TV shows.
- Added transformation of TMDB movie responses into the application's `MovieDetails` format.
- Added transformation of TMDB TV responses into the application's `TvDetails` format.
- Added unit tests covering movie and TV detail transformations.
- Added tests for missing API credentials and TMDB errors on detail requests.

### Technical Decisions
- The backend does not expose raw TMDB detail responses to the frontend.
- TMDB-specific field names are transformed into application-specific camelCase fields.
- Movie and TV details share common media information while retaining type-specific fields.
- Movie-specific data includes runtime.
- TV-specific data includes seasons, episode counts, air dates, status, and episode runtime.
- External TMDB requests continue to be mocked during unit tests.
- TMDB remains an external metadata provider rather than the application's data model.

### Result
The backend can retrieve detailed movie and TV information from TMDB and expose it through a stable application-specific format.

### Next
Decide which media data should be persisted in the application's database and begin the database layer.


## 2026-09-26 — PostgreSQL and Prisma Setup

### Completed

- Installed and verified PostgreSQL 18.6 for local development.
- Created the local `tracker` database.
- Installed and configured Prisma and Prisma Client.
- Configured Prisma to use PostgreSQL.
- Wired Prisma into the NestJS backend using the PostgreSQL adapter.
- Generated the Prisma Client.
- Verified communication between NestJS, Prisma and PostgreSQL with a successful runtime query.

### Technical Decisions

- PostgreSQL is used as the application's relational database.
- Prisma is used as the application's database access layer.
- Application-owned data will be stored locally while TMDB remains the external source for media metadata.
- The database stores TMDB IDs so local application data can reference external media.

### Result

The backend can communicate successfully with the local PostgreSQL
database through Prisma.

### Next

Persist Media, Seasons and Episodes through Prisma.


## 2026-09-26 — Persist Media Data

### Completed

- Added Prisma-backed Media persistence.
- Updated movie detail retrieval to create or reuse the corresponding local Media record.
- Updated TV detail retrieval to create or reuse the corresponding local Media record.
- Added database unit-test mocks for Media persistence.
- Verified Media persistence through unit tests.

### Technical Decisions

- Movies and TV shows use a shared Media entity.
- The combination of TMDB ID and media type uniquely identifies a Media record.
- Media metadata remains primarily external to the application database.
- Local Media records exist so application-owned data can reference TMDB media.

### Result

Movie and TV detail retrieval can now create or reuse the corresponding
Media record in the local database.

### Next

Persist TV Seasons and Episodes.


## 2026-09-26 — Persist TV Seasons and Episodes

### Completed

- Added TMDB season retrieval for TV shows.
- Added TMDB episode retrieval for each season.
- Added Prisma-backed Season persistence.
- Added Prisma-backed Episode persistence.
- Added the TV hierarchy:
  - TV Show → Season → Episode
- Added unit tests covering Season and Episode persistence.
- Verified that multiple Episodes are persisted under the correct Season.

### Technical Decisions

- TV Seasons are associated with the local Media record representing the TV Show.
- TV Episodes are associated with their local Season record.
- TMDB IDs are stored for Seasons and Episodes.
- Season numbers are unique within a TV Show.
- Episode numbers are unique within a Season.
- Movies do not have Seasons or Episodes.

### Result

The backend can retrieve a TMDB TV show and build the corresponding
local TV Show → Season → Episode hierarchy.

### Next

Implement Tracking Entry CRUD.


## 2026-09-26 — Tracking Entries

### Completed

- Added the Tracking Entry service and controller.
- Added DTO validation for creating and updating Tracking Entries.
- Implemented Tracking Entry creation.
- Implemented retrieval of Tracking Entries for a User.
- Implemented retrieval of a specific Media Tracking Entry.
- Implemented Tracking Entry status updates.
- Implemented Tracking Entry rating updates.
- Implemented Tracking Entry deletion.
- Added unit tests with mocked Prisma dependencies.
- Verified the backend build after the Tracking Entry implementation.

### Technical Decisions

- Tracking Entry represents a User's relationship with Media in the tracker.
- A User can have one Tracking Entry per Media item.
- Tracking Entry is separate from Watch history.
- User ID is currently supplied directly to the Tracking API because authentication has not yet been implemented.
- The authenticated User will replace the explicit User ID once authentication is implemented.
- Tracking statuses are currently:
  - PLANNED
  - WATCHING
  - COMPLETED
  - DROPPED
  - ON_HOLD
- Rating is optional.


## 2026-09-27 // 2026-09-28 — Tracking Entry Verification

### Completed

- Created a development User and verified Tracking Entry persistence against PostgreSQL.
- Created a real Tracking Entry through the API.
- Verified that the Tracking Entry was persisted with the correct User and Media relationships.
- Verified updating the Tracking Entry status and rating through the API.

### Result

The Tracker API can now persist, retrieve, update and delete real
Tracking Entries through NestJS, Prisma and PostgreSQL.

### Next

Implement Watch history for movie watches and TV episode watches.
