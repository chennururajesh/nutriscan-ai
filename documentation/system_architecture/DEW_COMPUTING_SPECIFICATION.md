# Dew Computing Framework Specification

## Project Title
**A Lightweight TinyML-Based Dew Computing Framework for Offline and Low-Latency Food Adulteration Detection**

---

## 1. Architectural Philosophy

Traditional distributed systems rely on Cloud Computing (centralized servers) or Fog Computing (localized edge gateways). However, in field food safety inspections (e.g., rural mandis, local grocery markets, transit warehouses), network connectivity is frequently intermittent or non-existent.

**Dew Computing** positions the mobile edge device (Android smartphone) as a **fully self-reliant, autonomous micro-server**. The device executes:
1. Optical image acquisition and real-time quality validation.
2. Tensor preprocessing and quantization mapping.
3. On-device TinyML deep neural inference using embedded ARM NEON hardware acceleration.
4. Local persistence in a transactional Room database.
5. Delayed, idempotent telemetry synchronization whenever network connectivity becomes available.

---

## 2. System Architecture Diagram

```mermaid
graph TD
    subgraph DEW_NODE ["DEW COMPUTING NODE (Android Smartphone)"]
        Cam["CameraX Sensor / Photo Picker"] --> Val["Stage 1: Image Validation Engine (Blur & Exposure)"]
        Val --> Pre["Preprocessing (Bilinear Crop to 224x224x3, INT8 Cast)"]
        Pre --> TinyML["TinyML Dew Inference Engine (MobileNetV3-Small INT8)"]
        TinyML --> S2["Stage 2: Food Object Detection"]
        S2 --> S3["Stage 3: Food Category Identification"]
        S3 --> S4["Stage 4: Visible Condition Assessment"]
        S4 --> S5["Stage 5: Supported Adulteration Screening"]
        S5 --> S6["Stage 6: Uncertainty & Confidence Filter"]
        S6 --> UI["Stage 7: Jetpack Compose Result Cards"]
        S6 --> Room["Stage 8: Room SQLite Database (Offline Records)"]
        Room --> SyncWorker["WorkManager Sync Engine"]
    end

    subgraph CLOUD_BACKEND ["CLOUD BACKEND (Central Server)"]
        SyncWorker -.->|"Stage 9: POST /api/sync/dew (Online Only)"| CloudAPI["Express.js REST Gateway"]
        CloudAPI --> CloudDB["Central Food Safety Repository"]
        CloudAPI --> CloudVerif["Secondary Verification & Regional Analytics"]
    end

    subgraph WEB_PORTAL ["RESPONSIVE WEB PORTAL (React / TS)"]
        WebBrowser["Browser Client (Laboratory / Consumer)"] -->|"REST Queries"| CloudAPI
    end
```

---

## 3. End-to-End Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Field Inspector / Consumer
    participant App as Android UI (Jetpack Compose)
    participant Engine as Dew Image Pipeline
    participant TFLite as On-Device TinyML Runtime
    participant DB as Local Room DB
    participant Sync as Background Sync Worker
    participant Cloud as Cloud REST Backend

    User->>App: Tap "TAKE PHOTO" or "UPLOAD IMAGE"
    App->>App: Request Camera Permission (Only when camera chosen)
    App->>Engine: Stream captured image buffer
    Engine->>Engine: Stage 1: Check blur (Laplacian) & exposure
    alt Image is Blurry / Dark
        Engine-->>App: Return "Image unsuitable. Please retake."
        App-->>User: Display guidance to recapture
    else Image is Valid
        Engine->>Engine: Crop & resize to 224x224x3
        Engine->>TFLite: Invoke INT8 inference (offline)
        Note over TFLite: Inference time < 50ms via ARM NEON
        TFLite-->>Engine: Raw logits & softmax probabilities
        Engine->>Engine: Stage 2-6: Category, condition, & screening check
        Engine-->>App: Multi-stage result payload
        App->>DB: Save record (sync_status = "PENDING")
        App-->>User: Render result cards with measured latencies
    end

    opt Network Connectivity Re-established
        Sync->>DB: Query records with sync_status = "PENDING"
        DB-->>Sync: Return pending records
        Sync->>Cloud: POST /api/sync/dew (Batch upload)
        Cloud-->>Sync: HTTP 200 OK (Sync confirmed)
        Sync->>DB: Update status to "SYNCHRONIZED"
    end
```

---

## 4. Dew Sync State Machine

Every scan record in the local database maintains one of three explicit sync states:
- `PENDING`: Saved locally on device; awaiting network connectivity or user consent.
- `SYNCHRONIZED`: Confirmed received by the cloud backend with matching server UUID.
- `FAILED`: Synchronization attempted but rejected or timed out; queued with exponential backoff.

### Privacy & Consent Protection
In accordance with consumer privacy standards, scan records are **never uploaded automatically by default**. Users must toggle "Enable Cloud Sync" in Settings, ensuring local on-device screening remains completely private.
