# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added
- (new features, enhancements)

### Changed
- (changes to existing functionality)

### Deprecated
- (soon-to-be removed features)

### Removed
- (now removed features)

### Fixed
- (bug fixes)

### Security
- (security improvements)

---

## [0.2.0] - 2024-06-09

### Added
- Caching system for attendance data with 5-minute cache duration
- Manual data refresh option in the header dropdown
- Cache status indicator and last updated time

### Changed
- Dashboard now loads instantly from cache if available
- Dashboard uses a single Header via DashboardLayout
- Refresh logic is passed through layout props

### Fixed
- Cache is now cleared automatically when the user logs out for privacy

### Removed
- Old DashboardClient component (now fully replaced by CachedDashboardClient)

### Docs
- README documents caching, refresh, and cache status indicator
- README documents cache clearing on logout
- README simplified and then improved with concise 'How it works' and 'Contributing' sections
- CHANGELOG.md created and maintained

---

## [0.1.0] - 2024-06-08

### Added
- Custom error page for improved error handling
- Modern UI, interactive charts, protected routes, and initial dashboard features
