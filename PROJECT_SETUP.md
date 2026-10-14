# NutriScan AI - Project Setup and Environment Guide

This document outlines the system requirements, installation workflows, and verification commands for all modules of the **NutriScan AI** ecosystem.

---

## 1. System Environment Inspection Report

An inspection of the local host environment was performed with the following results:

| Tool / Runtime | Detected Status | Version / Path | Compatibility Notes |
| :--- | :--- | :--- | :--- |
| **Operating System** | Available | Windows 11 / 10 64-bit | Native host platform |
| **Java JDK** | Available | Java SE 26.0.1 (`javac 26.0.1`) | High-version JDK; compatible with modern Gradle 8.8+ |
| **Node.js** | Available | v25.9.0 | Ready for Web App and Cloud Backend |
| **npm** | Available | 11.12.1 | Ready for package management |
| **Python** | Not in PATH | WindowsApps stub | Required for ML training scripts (`python --version`) |
| **Git** | Not in PATH | Not recognized | Recommended to add to PATH for version control |
| **Android SDK / ADB**| Not in PATH | Android Studio not detected in default PATH | Required for compiling release APKs locally |
| **VS Code** | Available | `AppData\Local\Programs\Microsoft VS Code` | Editor environment |

---

## 2. Directory Structure Overview

```text
Major Project NutriScan AI/
├── android-app/        # Native Android (Kotlin, Jetpack Compose, CameraX, Photo Picker)
├── web-app/            # Responsive Web Application (React, TypeScript, Vite)
├── backend/            # Shared Cloud API & Dew Sync Engine (Node.js, Express)
├── ml-model/           # TinyML training, quantization, and evaluation scripts
├── dataset/            # Data acquisition protocols and dataset schema
├── documentation/      # Research papers, Dew computing specs, and test reports
├── tests/              # Cross-module unit, integration, and benchmark suites
├── assets/             # Branding, vectors, and UI design assets
├── Release/            # Release APKs and packaged source code archives
├── README.md           # Architecture overview and academic abstract
└── PROJECT_SETUP.md    # This setup manual
```

---

## 3. Module Setup Instructions

### A. Shared Cloud Backend (`backend/`)

The backend coordinates cloud-level adulteration cross-verification and synchronizes offline Dew logs.

1. **Navigate to the backend directory:**
   ```bash
   cd "Major Project NutriScan AI/backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```

4. **Start the API Server:**
   ```bash
   npm run dev
   # or
   node src/server.js
   ```
   *The server defaults to port `5000` (http://localhost:5000).*

---

### B. Responsive Web Application (`web-app/`)

The web portal provides consumer scanning, lab analysis, and TinyML Dew performance dashboards.

1. **Navigate to the web-app directory:**
   ```bash
   cd "Major Project NutriScan AI/web-app"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   *Opens by default on http://localhost:5173.*

4. **Create a production build:**
   ```bash
   npm run build
   ```

---

### C. Native Android Application (`android-app/`)

Built with **Kotlin**, **Jetpack Compose (Material 3)**, **CameraX**, and **Android Photo Picker**.

1. **Prerequisites:**
   - Android Studio Iguana / Jellyfish (or higher) with Android SDK API Level 34.
   - Recommended JDK: Java 17 or Java 21 (Note: Java 26 may require Gradle 8.7+ or `--warning-mode=none`).

2. **Opening in Android Studio:**
   - Open Android Studio.
   - Select **Open** and choose `Major Project NutriScan AI/android-app`.
   - Allow Gradle Sync to finish downloading dependencies.

3. **Building via Command Line (when Android SDK is installed):**
   ```bash
   cd "Major Project NutriScan AI/android-app"
   ./gradlew assembleDebug
   ```

4. **Permissions and CameraX Implementation:**
   - Permissions requested: `android.permission.CAMERA` (runtime prompt only upon user clicking "TAKE PHOTO").
   - Gallery image input: Uses `ActivityResultContracts.PickVisualMedia` (Android Photo Picker, zero invasive storage permission needed).
   - Downsampling: Bitmaps are decoded with an inSampleSize pipeline before feeding into the 224x224 RGB Dew inference engine.

---

### D. Machine Learning Pipeline (`ml-model/`)

Contains TinyML INT8 quantization and MobileNetV3-Small transfer learning pipelines for Dew nodes.

1. **Install Python 3.10+ and create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install ML dependencies:**
   ```bash
   pip install -r "Major Project NutriScan AI/ml-model/requirements.txt"
   ```

3. **Model Training & Quantization Pipeline:**
   ```bash
   python "Major Project NutriScan AI/ml-model/src/train.py"
   python "Major Project NutriScan AI/ml-model/src/quantize.py"
   python "Major Project NutriScan AI/ml-model/src/evaluate.py"
   ```
   *Optimized models are exported to `ml-model/exports/nutriscan_tinyml_int8.tflite`.*

---

## 4. Dew-to-Cloud Sync Protocol

1. **Offline Mode**: The Android node evaluates food authenticity on-device in <80ms using the embedded TinyML model. Findings are committed to local SQLite storage with a UUID and cryptographic hash.
2. **Online Sync**: When an internet connection becomes available, the client emits a `POST /api/sync/dew` batch payload containing timestamped offline logs.
3. **Cloud Consensus**: The cloud backend updates the consumer record and flags potential regional adulteration spikes for regulatory awareness.
