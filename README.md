# NutriScan AI

## A Lightweight TinyML-Based Dew Computing Framework for Offline and Low-Latency Food Adulteration Detection

[![Academic Project](https://img.shields.io/badge/Project-Academic%20Major%20Project-006d3a.svg)](https://github.com)
[![Architecture](https://img.shields.io/badge/Architecture-Dew%20Computing%20%2B%20TinyML-2e7d32.svg)](documentation/)
[![Android](https://img.shields.io/badge/Android-Jetpack%20Compose%20%7C%20Kotlin-3ddc84.svg)](android-app/)
[![Web Portal](https://img.shields.io/badge/Web-React%2018%20%7C%20TypeScript-61dafb.svg)](web-app/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg)](backend/)

---

### Abstract & Overview

Food adulteration is a pervasive global public health crisis that causes severe acute toxicities, malnutrition, and chronic organ damage. Traditional spectroscopic and chemical verification methods are cost-prohibitive, lab-bound, and completely inaccessible to everyday consumers and field inspectors in low-connectivity areas. While Cloud AI solutions exist, they suffer from unacceptable network latency, privacy vulnerabilities, and catastrophic failures in zero-bandwidth rural supply chain corridors.

**NutriScan AI** resolves this paradigm through a **Dew Computing Framework** coupled with **TinyML (Edge Deep Learning)**. By embedding quantized, lightweight neural inference models directly into edge mobile nodes (Android devices running Jetpack Compose and on-device TFLite runtimes), NutriScan AI enables:
1. **Zero-Latency Offline Screening**: On-device food authenticity inspection in sub-80 millisecond response times without requiring an active internet connection.
2. **Dew-to-Cloud Synchronization**: Offline local caching of scan telemetry that seamlessly synchronizes with the centralized cloud backend once network connectivity is re-established.
3. **Cross-Platform Access**: A native Jetpack Compose Android client for field screening and a responsive React/TypeScript Web Application for laboratory verification, analytics, and consumer reporting.

---

### Project Repository Structure

```text
Major Project NutriScan AI/
├── android-app/          # Native Android application (Kotlin, Jetpack Compose, Material 3)
│   ├── app/              # App module with UI, data models, camera, and Dew inference interfaces
│   ├── build.gradle.kts  # Root build configuration
│   └── settings.gradle.kts
├── web-app/              # Responsive Web Application (React, TypeScript, Vite)
│   ├── src/              # Components, pages, services, visual performance charts
│   ├── public/           # Static assets and icons
│   └── package.json
├── backend/              # Centralized Cloud Backend (Node.js, Express, REST API)
│   ├── src/              # Controllers, routes, models, and Dew synchronization engine
│   └── package.json
├── ml-model/             # TinyML model architecture, training, and INT8 quantization scripts
│   ├── configs/          # Hyperparameter and model configuration files
│   ├── src/              # Python scripts for dataset preprocessing, training, and quantization
│   ├── exports/          # Destination for optimized on-device .tflite models
│   └── requirements.txt
├── dataset/              # Food adulteration datasets and data collection protocols
│   ├── raw/              # Raw image and photometric spectral captures
│   ├── processed/        # Standardized, augmented datasets
│   └── DATASET_SCHEMA.md # Formal data acquisition and adulterant classification schema
├── documentation/        # Research papers, system architecture, test reports, and thesis PDF
│   ├── system_architecture/ # Dew Computing framework specifications and data flow diagrams
│   ├── research_papers/     # Literature reviews and published methodologies
│   └── testing_reports/     # Benchmark and latency measurement reports
├── tests/                # Unit, integration, e2e, and TinyML benchmark suites
│   ├── unit/             # Component and controller unit tests
│   ├── integration/      # Cloud sync and API integration tests
│   └── ml_benchmarks/    # Edge latency and quantization drift test specifications
├── assets/               # Logos, vector assets, UI design tokens, and architecture diagrams
├── Release/              # Target directory for release APKs and source archives
│   ├── apks/             # Compiled, signed Android application packages (.apk)
│   └── source_archive/   # Official milestone source code bundles (.zip)
├── README.md             # This document
└── PROJECT_SETUP.md      # Detailed installation and setup guide
```

---

### Architectural Pillars

#### 1. Dew Computing Paradigm
Dew computing extends Cloud and Fog computing by executing computation directly on the independent, lowest-tier edge node without dependency on an upstream server. In NutriScan AI:
- **Autonomous Local Node**: The Android device acts as a Dew server, processing CameraX frames via an embedded TinyML model.
- **Local Persistence**: Scan records and provenance hashes are stored in a local SQLite/Room database.
- **Bi-Directional Eventual Consistency**: As soon as telemetry detects Wi-Fi or cellular connectivity, records are queued and reconciled with the centralized cloud backend.

#### 2. TinyML Optimization
- **Backbone Architectures**: Highly compressed MobileNetV3-Small and custom Depthwise-Separable CNN topologies.
- **Post-Training Quantization**: Full INT8 integer quantization with representative calibration datasets, compressing model memory footprints below 4 MB with < 1.8% accuracy degradation compared to FP32 baselines.

---

### Getting Started

For detailed installation, configuration, and verification commands across Android, Web, and Backend modules, please refer to:
👉 **[PROJECT_SETUP.md](PROJECT_SETUP.md)**

---

### Academic Integrity & Guidelines
- All machine learning scripts and model checkpoints are strictly reproducible.
- No synthetic benchmark numbers or fabricated predictions are utilized.
- All release APKs and ZIP distributions are generated directly from verified builds.
