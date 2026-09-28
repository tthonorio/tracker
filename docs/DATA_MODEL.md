# Data Model

## Purpose

This document describes the data owned and managed by the application,
as well as the relationships between that data.

The data model is expected to evolve throughout development as new
requirements are identified.

The application separates application-owned data from external media
metadata provided by TMDB.

---

## 1. External Media Data

Movie and TV show metadata will primarily be provided by The Movie
Database (TMDB).

The application should not attempt to recreate the complete TMDB
catalogue.

TMDB data may include:

- Titles
- Original titles
- Descriptions
- Release/air dates
- Posters
- Backdrops
- Genres
- Languages
- Countries
- Cast and crew
- Seasons
- Episodes
- Ratings and other metadata
- Streaming provider information

The application stores references to TMDB media items using their
external IDs.

TMDB metadata is not duplicated in the application's database unless
required by an application feature.

---

## 2. Users

### User

Represents a registered user of the application.

Initial attributes:

- id
- username
- email
- password_hash
- profile_image
- created_at

The User entity contains only core identity and authentication
information initially.

Additional profile functionality may be added later as requirements
are implemented.

User statistics, activity, reviews, lists, achievements and
friendships are represented through their respective relationships
rather than being stored directly as User attributes.

---

## 3. Media

### Media

Represents a movie or TV show referenced by the application.

Media metadata primarily originates from TMDB.

The application stores a local Media record so that user-owned data
can reference the corresponding external media item.

Initial attributes:

- id
- tmdb_id
- type
- created_at

Supported media types:

- movie
- tv

The combination of `tmdb_id` and `type` must be unique.

A Movie is represented by a Media record where `type` is `movie`.

A TV Show is represented by a Media record where `type` is `tv`.

Movies are standalone media items and do not contain seasons or
episodes.

TV Shows may contain multiple seasons.

---

## 4. Seasons and Episodes

### Season

Represents a season belonging to a TV Show.

Initial attributes:

- id
- media_id
- tmdb_id
- season_number

`media_id` references the Media record representing the TV Show.

`tmdb_id` identifies the corresponding season in TMDB.

`season_number` identifies the season within the TV Show.

A TV Show may contain multiple Seasons.

### Episode

Represents an individual episode belonging to a Season.

Initial attributes:

- id
- season_id
- tmdb_id
- episode_number

`season_id` references the Season to which the Episode belongs.

`tmdb_id` identifies the corresponding episode in TMDB.

`episode_number` identifies the episode within the Season.

A Season may contain multiple Episodes.

The resulting media hierarchy is:

TV Show → Seasons → Episodes

Movies do not have Seasons or Episodes.

---

## 5. Tracking

Tracking represents the relationship between a User and Media.

A User may:

- Add Media to their tracker
- Mark Media as watched
- Record when Media was watched
- Rewatch previously watched Media
- Track progress through TV Shows
- Rate Media
- Organize Media according to their current tracking status

### Tracking Entry

Represents a User's relationship with a Media item in their tracker.

A Tracking Entry is separate from a Watch record because a User may
add Media to their tracker without having watched it.

The current implementation supports the following tracking states:

- planned
- watching
- completed
- dropped
- on_hold

Current attributes include:

- id
- user_id
- media_id
- status
- rating
- created_at
- updated_at

A User can have one Tracking Entry per Media item.

The exact rating system may be refined during implementation.

### Watch

Represents an individual viewing of a Movie or Episode.

A User may have multiple Watch records for the same Movie or Episode.

This allows rewatches to be represented independently.

For a Movie, a Watch references the corresponding Media record.

For a TV Show, a Watch references an individual Episode.

Initial attributes may include:

- id
- user_id
- media_id
- episode_id
- watched_at

A Watch record must reference either a Movie through `media_id` or an
Episode through `episode_id`, but not both.

The exact database constraint will be finalized during implementation.

Watch history has not yet been implemented.

### Progress

TV Show progress is derived from the Episodes watched by a User.

Progress should not be stored as a separate entity initially.

For example, progress may be calculated from:

- Total episodes in the TV Show
- Episodes watched by the User

The application should avoid storing redundant progress data unless
there is a clear performance or functionality requirement.

---

## 6. Collection

Collection functionality allows Users to explore and organize Media
based on metadata.

Initial collection dimensions include:

- Genres
- Decades
- Languages
- Franchises
- Streaming platforms

These attributes primarily originate from TMDB or other external
providers.

Their exact database representation will be determined during
implementation based on the application's requirements.

The application should avoid duplicating external metadata
unnecessarily.

---

## 7. Social

### Friendship

Represents a relationship between two Users.

A Friendship may have a state such as:

- pending
- accepted
- rejected

The exact friendship workflow will be finalized during implementation.

### Review

Represents a User's written opinion about a Media item.

A Review belongs to:

- one User
- one Media item

### Reaction

Represents a User's reaction to another User's activity or content.

A Reaction belongs to:

- one User
- one supported target

The supported reaction types and target relationships will be defined
during implementation.

### List

Represents a User-created collection of Media.

A List belongs to one User.

A List may contain multiple Media items.

A Media item may appear in multiple Lists.

### List Item

Represents the relationship between a List and a Media item.

Initial attributes may include:

- id
- list_id
- media_id
- created_at

List Item exists to represent the many-to-many relationship between
Lists and Media.

### Recommendation

Represents a recommendation of a Media item from one User to another.

A Recommendation involves:

- recommending User
- receiving User
- Media item

The recommendation may also contain optional text and a status such
as pending, viewed or dismissed.

### Feed Activity

Represents an activity that may appear in the shared friends feed.

Examples include:

- Adding Media to a tracker
- Watching a Movie
- Completing a TV Episode or Show
- Writing a Review
- Creating a List
- Recommending Media
- Unlocking an Achievement

The exact activity structure will be finalized during implementation.

### Achievement

Represents a goal or milestone achieved by a User.

Achievements may be based on activities such as:

- Number of Movies watched
- Number of Episodes watched
- Rewatches
- Genres explored
- Years or decades explored
- Other application-defined milestones

The achievement system will be defined separately when implemented.

---

## 8. Profile

A User's profile exposes selected information about their activity,
collection and social presence.

Profile information may include:

- Username
- Profile image
- Statistics
- Recent activity
- Lists
- Reviews
- Achievements
- Friends

Profile is currently treated as a representation of User and related
application data rather than a separate database entity.

Additional profile-specific attributes may be added to User later if
required.

---

## 9. Core Relationships

Initial relationships include:

User → Tracking Entries → Media

User → Watches → Media / Episode

Media (type = tv) → Seasons → Episodes

User → Friends → User

User → Reviews → Media

User → Lists → List Items → Media

User → Recommendations → User / Media

User → Reactions → Supported Activity or Content

User → Achievements

Media → Genres

Media → Languages

Media → Franchises

Media → Streaming Platforms

The exact representation of metadata relationships will be determined
during implementation.

---

## 10. Entity Summary

The initial application-owned entities are:

### Core

- User
- Media
- Season
- Episode

### Tracking

- Tracking Entry
- Watch

### Social

- Friendship
- Review
- Reaction
- List
- List Item
- Recommendation
- Feed Activity
- Achievement

Profile is not currently treated as a separate entity.

Progress is derived from watched Episodes and is not currently treated
as a separate entity.

Genres, decades, languages, franchises and streaming platforms are
currently treated as media metadata.

Their final database representation has not yet been decided.