# Changelog

All notable changes to this project are documented in this file.

The format follows **Keep a Changelog**,  
and this project adheres to **Semantic Versioning**.

---
`Major Release Soon...`
---

## [2.1.0] - 2026-01-14

### Added
- Support for receiving files and code when:
  - No file is open in the editor
  - The text editor is not focused
- Automatic fallback behavior to save received files directly in the workspace root
- Improved handling for scenarios where no active editor context exists

### Changed
- Refined file delivery logic to reduce dependency on editor state
- Improved workspace detection when receiving files or code snippets

### Fixed
- Reliability issues where incoming files or code were dropped if the editor was inactive
- Edge cases where receiving content failed due to missing workspace context

---

## [2.0.1] - 2026-01-14

### Changed
- Internal project restructuring to improve code organization
- URL and endpoint reorganization for better backend maintainability

### Fixed
- Incorrect backend server URLs causing intermittent connection failures
- API routing inconsistencies affecting friend connections and message delivery

---

## [2.0.0] - 2025-08-03

### Added
- Stable DNS configuration for backend services
- Improved network stability for peer connections

### Fixed
- Bugs in the friends management system
- Issues related to friend discovery and connection stability
- General reliability problems across core features

---

## [1.0.8] - 2025-08-03

### Changed
- Backend server migration to a new environment
- Updated server and API endpoints to reflect the new infrastructure

### Fixed
- Connectivity issues caused by outdated endpoints

---

## [1.0.6] - 2025-05-01

### Fixed
- Broken API integrations introduced in version 1.0.5
- Issues preventing file and code sharing between connected users
- Restored all core features to a stable working state

---

## [1.0.5] - 2025-04-30

### Fixed
- Major functional regressions
- File sharing failures between users
- Partial feature availability where only the “Add Friends” functionality was operational

---

## [1.0.4] - 2025-04-30

### Changed
- Backend server relocation
- Updated server URLs across the extension configuration

### Fixed
- Connection issues caused by outdated server addresses

---

## [1.0.0] - 2025-04-30

### Added
- File sharing between VS Code instances
- Selected code snippet sharing from the editor
- Friends management features:
  - Add friends
  - Rename friends
  - Block and unblock friends
- Light and dark theme icon support

---
