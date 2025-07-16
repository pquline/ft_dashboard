# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [feat/implement-cache] - 2024-06-09
### Added
- Caching system for attendance data with 5-minute cache duration
- Manual data refresh option in the header dropdown
- Cache status indicator and last updated time

### Changed
- Dashboard now loads instantly from cache if available

## [fix: clear cached attendance data on logout for privacy] - 2024-06-09
### Fixed
- Cache is now cleared automatically when the user logs out for privacy

## [docs: document cache clearing on logout for privacy] - 2024-06-09
### Added
- README now documents cache clearing on logout

## [docs: update README with caching and manual refresh features] - 2024-06-09
### Added
- README documents caching, refresh, and cache status indicator

## [refactor: use existing Header in DashboardLayout and pass refresh props] - 2024-06-09
### Changed
- Dashboard uses a single Header via DashboardLayout
- Refresh logic is passed through layout props

## [refactor: clean up CachedDashboardClient and remove unused DashboardClient] - 2024-06-09
### Removed
- Old DashboardClient component (now fully replaced by CachedDashboardClient)

## [feat: implement caching system with manual refresh] - 2024-06-09
### Added
- useCachedData hook for client-side caching
- CachedDashboardClient component

## [feat: add error page] - 2024-06-08
### Added
- Custom error page for improved error handling
