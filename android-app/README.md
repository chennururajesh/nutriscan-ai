# NutriScan AI - Android Application Module

A native Android application built in **Java** utilizing Android CameraX, Android Photo Picker, Room local database, and a TinyML Dew Computing inference engine.

## Key Features
- **Zero-Latency Offline Screening**: Runs quantized TensorFlow Lite inference directly on the Android smartphone without requiring cloud connectivity.
- **Dual Image Acquisition**:
  - Real-time viewfinder & camera capture via **Android CameraX**.
  - System-secured gallery selection via modern **Android Photo Picker** (`PickVisualMediaRequest`) with zero invasive storage permissions.
- **Nine-Stage Inspection Pipeline**:
  1. Image Validation (Laplacian blur variance, brightness/exposure thresholding)
  2. Object/Food Detection
  3. Category Classification (Milk, Honey, Turmeric, Chili Powder, Black Pepper, Mustard, Cooking Oil)
  4. Visible Condition Assessment ("No obvious damage detected", "Visible surface discoloration", "Bruising", etc.)
  5. Supported Adulteration Screening
  6. Confidence & Uncertainty Quantification
  7. Multi-Card Result Display
  8. Local SQLite / Room Database Persistence
  9. Idempotent Cloud Synchronization (when connectivity is restored)
- **Cautious Result Communication**:
  - Displays strict safety disclaimer: *"This AI result is a preliminary visual screening, not a food-safety certification. Normal appearance does not guarantee that food is safe."*
  - Never labels probabilistic model confidence as chemical safety or adulteration percentage.
- **Fixed Bottom Navigation**: `HOME | SCAN | HISTORY | PROFILE`.

## Build & Run Instructions
1. Open this directory in **Android Studio**.
2. Ensure Android SDK 34 is installed.
3. Build via terminal:
   ```bash
   ./gradlew assembleDebug
   ```
4. Install on device or emulator:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```
