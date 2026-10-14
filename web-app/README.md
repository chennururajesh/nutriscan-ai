# NutriScan AI - Web Application Portal

A responsive laboratory and consumer web portal built in **React 18** and **TypeScript** with Vite, mirroring the Dew Computing screening pipeline.

## Features
- **Responsive Web Interface**: Optimized across mobile, tablet, and widescreen desktop displays.
- **Dual Optical Capture**: WebRTC camera stream (`getUserMedia`) and drag-and-drop file upload.
- **9-Stage Inspection Engine**:
  - Image quality validation (blur variance, exposure nits)
  - Colorimetric chromatic profile extraction
  - On-device tensor evaluation (MobileNetV3-Small INT8)
  - Food condition assessment & adulteration screening
- **Central Food Category Registry**: Filterable browser for 78 food commodities across 6 groups.
- **Research Performance Dashboards**: Comparative latency and model storage footprint visualizations.
- **Local Dew Persistence**: Scans are stored in client-side storage with explicit sync status flags.

## Commands to Run Locally

1. **Install dependencies**:
   ```bash
   cd "Major Project NutriScan AI/web-app"
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Opens by default on: http://localhost:5173*

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
