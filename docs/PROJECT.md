# Project

## 1. Overview

Tracker is a web-based movie and TV tracking application being
developed as a full-stack portfolio project.

The application is designed primarily for a small group of users,
initially centered around personal use and sharing media activity with
friends.

The application combines:

- Media tracking
- Watch history
- Personal collections
- Social interaction
- Media discovery
- Achievements

The project takes inspiration from applications such as TV Time and
PassportDex while maintaining its own visual identity and product
structure.

---

## 2. Product Pillars

### TRACK

The tracking system is the core functionality of the application.

Users should be able to:

- Track Movies
- Track TV Shows
- Track Seasons
- Track Episodes
- Record watch dates
- Record rewatches
- Track TV progress
- Set tracking status
- Rate Media

---

### COLLECT

The application should allow Users to explore and organize their media
collection.

Collection dimensions may include:

- Genres
- Decades
- Languages
- Franchises
- Streaming platforms
- Personal Lists
- Achievements

---

### SOCIAL

The application should allow Users to interact with friends through
their media activity.

Planned functionality includes:

- Friends
- Reactions
- Reviews
- Lists
- Recommendations
- Profiles
- Shared friends feed
- Achievements

The social functionality is intended for a small user base rather than
a large public social network.

---

## 3. Main Pages

The initial primary navigation consists of:

- Home
- Tracker
- Profile

Additional pages and views may include:

- Media details
- Search results
- TV seasons
- TV episodes
- Reviews
- Lists
- Friends
- Recommendations
- Shared activity

---

## 4. Homepage

The Homepage should provide a quick overview of the User's current
media activity.

Initial content may include:

- Search
- Continue watching
- Currently watching
- Recent activity
- Recommendations
- Friends' recommendations
- Relevant achievements

The Homepage should prioritize current and useful activity rather than
displaying every available statistic.

---

## 5. Tracker

The Tracker is the main area for managing the User's media.

Users should be able to:

- View tracked Media
- Filter Media by status
- Update tracking status
- Add ratings
- Open Media details
- View watch history
- View TV progress

Tracking an item and watching an item are separate actions.

---

## 6. Media

The application supports two main media types:

- Movies
- TV Shows

Movies are represented as standalone Media.

TV Shows use the hierarchy:

TV Show → Season → Episode

This allows TV watching activity to be tracked at the Episode level.

TMDB is used as the primary external source for movie and TV metadata.

---

## 7. User Profiles

A Profile represents the User's media identity.

Possible profile information includes:

- Username
- Profile image
- Statistics
- Recent activity
- Lists
- Reviews
- Achievements
- Friends

Profile is represented through the User and its related application
data rather than as a separate database entity.

---

## 8. Design Direction

The initial visual direction is:

- Pixel-art inspired
- Night sky
- Constellations
- Passport/travel elements

The design should communicate the idea of exploring, collecting and
remembering media.

The visual direction takes inspiration from TV Time and PassportDex
without directly reproducing either application's interface.

---

## 9. Product Principles

### Personal first

The application is designed around the User's own media history,
collection and activity.

### Track actual behavior

Tracking Media and watching Media are separate concepts.

This allows the application to support planned media, current watching,
completed media and rewatches.

### TV is first-class

TV Shows are explicitly represented through Seasons and Episodes rather
than being treated as Movies with different metadata.

### Social but small

Social functionality should support interaction between friends without
requiring the infrastructure or complexity of a large public social
network.

### External metadata, local activity

TMDB provides media metadata while the application owns User activity,
tracking, watch history and social data.

### Backend first

The backend and database establish the application's core behavior
before the frontend is fully implemented.

---

## 10. Current Development Status

### Completed

- NestJS backend setup
- TypeScript and ESM configuration
- Environment configuration
- TMDB API integration
- TMDB media search
- Movie detail retrieval
- TV detail retrieval
- Normalized movie and TV responses
- PostgreSQL setup
- Prisma setup
- Media persistence
- TV Season persistence
- TV Episode persistence
- Tracking Entry creation
- Tracking Entry retrieval
- Tracking Entry updates
- Tracking Entry deletion
- Tracking Entry unit tests
- PostgreSQL-backed Tracking Entry verification

### In Progress

- Watch history
- User accounts
- Authentication
- Frontend application
- User interface

### Planned

- TV progress
- Reviews
- Lists
- Friendships
- Recommendations
- Reactions
- Feed activity
- Achievements
- Collection functionality

---

## 11. Current Technology

### Backend

- TypeScript
- NestJS
- Prisma

### Database

- PostgreSQL

### External Media Data

- TMDB

### Frontend

- Web application

---

## 12. Current Development Priority

The next major feature is Watch history.

Watch history should support:

- Movie watches
- Episode watches
- Watch dates
- Multiple watches
- Rewatches
- Association with Users
- Association with Movies or Episodes

TV progress will initially be derived from Watch history rather than
stored as a separate value.

After the core tracking system is established, development will move
toward authentication and the frontend application.