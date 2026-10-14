# NutriScan AI - Central Cloud Backend & Dew Synchronization Gateway

A shared Node.js & Express REST API and Firebase Firestore coordination backend serving both the Android application and React Web application.

## Endpoints
- `GET /api/health`: Health status and Dew framework metadata.
- `GET /api/food-registry`: Canonical registry of all 78 commodities and adulteration hazards.
- `POST /api/sync/dew`: Idempotent batch sync endpoint for offline Dew scan logs.
- `GET /api/users/:userId/scans`: Isolated private user scan history.
- `GET /api/metrics`: Performance benchmark telemetry.

## Security & Privacy Architecture
- Strict user-level access isolation: Each client can only read/write their own private documents.
- Rule enforcement via `firestore.rules`.
- Zero service-account credentials committed to client source trees.

For comprehensive Firebase setup, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).
