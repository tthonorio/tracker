# Architecture

## 1. Overview

The application will be developed as a web-based full-stack application.

The initial architecture will separate:

1. Frontend
2. Backend/API
3. Application database
4. External media data provider

The architecture should allow the frontend to be replaced or expanded
in the future without requiring major changes to the backend.

---

## 2. High-Level Architecture

                    ┌─────────────────┐
                    │   Web Frontend  │
                    └────────┬────────┘
                             │
                             │ HTTP/API
                             ▼
                    ┌─────────────────┐
                    │ Backend / API   │
                    └───────┬─┬───────┘
                            │ │
                 ┌──────────┘ └──────────┐
                 ▼                       ▼
        ┌─────────────────┐      ┌─────────────────┐
        │   Application   │      │      TMDB       │
        │    Database     │      │      API        │
        └─────────────────┘      └─────────────────┘

---

## 3. Frontend

The frontend will provide the user interface for:

- Homepage
- Tracker
- Profile
- Media discovery
- Media details
- Social functionality
- Collection functionality

The frontend communicates with the application's backend rather than
directly accessing the application database.

The frontend has not yet been implemented.

---

## 4. Backend

The backend is responsible for:

- Authentication
- User management
- Tracking
- Watch history
- Progress
- Collections
- Social functionality
- Reviews
- Lists
- Recommendations
- Reactions
- Achievements
- Communication with TMDB
- Validation and authorization

The backend acts as the main application layer between the frontend,
database and external services.

The backend is currently implemented using NestJS and TypeScript.

Implemented backend functionality currently includes:

- TMDB media search
- Movie details
- TV details
- Media persistence
- TV season persistence
- TV episode persistence
- Tracking Entry CRUD

---

## 5. Database

The application will use a relational database to store data owned by
the application.

PostgreSQL is currently being used as the application's relational
database.

Prisma is used as the application's database access layer.

The database currently stores:

- Media
- Seasons
- Episodes
- Users
- Tracking Entries

The initial database migration already creates tables for planned features
(such as watch records, friendships, reviews, lists, recommendations,
reactions, feed activity and achievements). These tables exist in the
schema but are not yet used by application code.

Planned application-owned data includes:

- Watch history
- Progress
- Reviews
- Lists
- Friendships
- Recommendations
- Reactions
- Achievements
- Other application-specific data

The database will not attempt to duplicate the entire TMDB catalogue.

---

## 6. TMDB Integration

TMDB will be used as the primary external source for movie and TV
metadata.

The backend will communicate with TMDB rather than exposing TMDB
credentials to the frontend.

The application will store TMDB IDs to associate local application
data with external media records.

TMDB provides APIs for movie, TV, actor and image data.

The current backend integration uses a single `media` module/service
for movie and TV data.

Implemented TMDB functionality currently includes:

- Multi-search
- Movie details
- TV details
- TV season data
- TV episode data

TMDB data is normalized into application-specific response formats
rather than exposing raw TMDB responses directly to the frontend.

---

## 7. External Data Strategy

TMDB data and application-owned data will be treated separately.

External data:

- Movie metadata
- TV metadata
- Seasons
- Episodes
- Cast/crew
- Images
- Other TMDB-provided metadata

Application-owned data:

- Users
- Watch history
- Progress
- Ratings
- Reviews
- Lists
- Friendships
- Recommendations
- Reactions
- Achievements
- Tracking relationships

The application stores local Media, Season and Episode records when
required so that application-owned data can reference external media.

This separation allows the application to change its own functionality
without needing to maintain a complete movie/TV database.

---

## 8. Authentication

Users will authenticate with the application's backend.

Authentication credentials and session information will not be exposed
to the frontend or stored in plain text.

TMDB authentication is separate from application user authentication.

Authentication has not yet been implemented.

During development, the Tracking API currently receives the User ID
explicitly because authentication is not yet available.

Once authentication is implemented, the authenticated user will be used
instead.

---

## 9. API Design

The backend will expose an API for the frontend.

Potential API areas include:

- /auth
- /users
- /media
- /movies
- /tv
- /tracking
- /watch-history
- /reviews
- /lists
- /friends
- /recommendations
- /feed
- /achievements

The exact API structure will be determined during implementation.

Currently implemented API areas include:

- /media
- /tracking

The current `/media` API supports:

- `/media/search`
- `/media/movie/:id`
- `/media/tv/:id`

The current `/tracking` API supports creating, retrieving, updating
and deleting Tracking Entries.

---

## 10. Current Architectural Decisions

### Decision 001 — Use TMDB as the external media source

Status: Accepted

Reason:

Maintaining a complete movie and TV catalogue manually would add
significant unnecessary complexity.

TMDB already provides structured movie and TV metadata through its API.

### Decision 002 — Separate application data from external media data

Status: Accepted

Reason:

The application's main value comes from user tracking and social
functionality rather than recreating an existing media database.

### Decision 003 — Frontend communicates through the backend

Status: Accepted

Reason:

This keeps business logic, authentication, authorization and external
API credentials on the server side.

### Decision 004 — Use a shared Media entity for movies and TV shows

Status: Accepted

Reason:

Movies and TV shows share a large amount of application behavior and
both originate from TMDB.

A single Media entity can identify the type of media while allowing
movies and TV shows to share the same application-level relationships.

### Decision 005 — Use PostgreSQL as the application database

Status: Accepted

Reason:

The application contains relational data such as users, media,
tracking entries, seasons, episodes and future social relationships.

PostgreSQL provides a suitable relational database for these
relationships.

### Decision 006 — Use Prisma as the database access layer

Status: Accepted

Reason:

Prisma provides typed database access and integrates with the NestJS
backend while keeping the database model explicit and maintainable.

### Decision 007 — Keep Tracking Entries separate from Watch History

Status: Accepted

Reason:

Adding media to a tracker and actually watching media are different
actions.

Separating these concepts allows the application to support planned
media, watch history and rewatches without combining unrelated data.

### Decision 008 — Derive TV progress from watched Episodes

Status: Accepted

Reason:

Progress can be calculated from the number of Episodes watched by a
User instead of storing duplicate progress data.

This reduces the risk of progress becoming inconsistent with watch
history.

---

## 11. Future Considerations

Potential future clients include:

- Mobile application
- Desktop application

The backend should therefore avoid unnecessary coupling to the initial
web frontend.

The frontend may also be expanded with additional social and
collection functionality after the core tracking experience is
implemented.

---

## 12. Third-Party Requirements

### TMDB

This project uses the TMDB API for movie and TV metadata.

The application must comply with TMDB's current API terms and
attribution requirements.

Required attribution and licensing requirements will be reviewed
before deployment.

### JustWatch

If streaming-provider data is used through TMDB's watch-provider
endpoints, the project's attribution requirements for JustWatch must
also be satisfied.