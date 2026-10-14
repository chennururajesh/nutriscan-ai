# NutriScan AI - Firebase Authentication & Cloud Firestore Setup Guide

This guide outlines the step-by-step instructions to configure Firebase Authentication and Cloud Firestore for NutriScan AI.

## Step 1: Create Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `NutriScan-AI`.
3. Disable Google Analytics or select default account, then click **Create Project**.

## Step 2: Configure Authentication
1. In the left navigation, go to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password**.
4. (Optional) Enable **Anonymous** auth for guest field inspectors.

## Step 3: Configure Cloud Firestore Database
1. Go to **Build > Firestore Database**.
2. Click **Create Database**.
3. Select your preferred database location (e.g., `asia-south1` or `us-central1`).
4. Select **Start in production mode** (all reads and writes denied by default).
5. In the **Rules** tab, deploy the contents of `backend/firestore.rules`.

## Step 4: Add Android App
1. Click the **Android** icon in the project overview.
2. Package name: `com.nutriscanai.app`.
3. App nickname: `NutriScan AI Android`.
4. Download `google-services.json` and place it in:
   `Major Project NutriScan AI/android-app/app/google-services.json`.

## Step 5: Add Web App
1. Click the **Web** icon `</>` in the project overview.
2. App nickname: `NutriScan AI Web`.
3. Copy the configuration object into `web-app/.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=nutriscan-ai.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nutriscan-ai
   VITE_FIREBASE_STORAGE_BUCKET=nutriscan-ai.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Security Checklist
- [x] Service account private keys are NOT committed to version control.
- [x] Client apps access Firestore only through authenticated user UIDs.
- [x] Open database rules (`allow read, write: if true;`) are strictly forbidden.
