package com.nutriscanai.app.ui.scan;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;
import com.google.common.util.concurrent.ListenableFuture;
import com.nutriscanai.app.MainActivity;
import com.nutriscanai.app.R;
import com.nutriscanai.app.ml.DewInferenceEngine;
import com.nutriscanai.app.ml.ImagePreprocessor;
import com.nutriscanai.app.model.ScanRecord;
import com.nutriscanai.app.ui.result.ScanResultFragment;

import java.io.File;
import java.util.concurrent.ExecutionException;

public class ScanFragment extends Fragment {

    private PreviewView viewfinder;
    private ImageView imgPreview;
    private LinearLayout layoutPlaceholder, layoutLoading, layoutInputButtons, layoutPreviewControls;
    private TextView tvLoadingStage, tvErrorBanner;
    private MaterialButton btnTakePhoto, btnUploadImage, btnRunAnalysis, btnReplaceImage, btnCancelImage;

    private Bitmap currentBitmap;
    private Uri currentImageUri;
    private ImageCapture imageCapture;

    private ActivityResultLauncher<String> cameraPermissionLauncher;
    private ActivityResultLauncher<PickVisualMediaRequest> photoPickerLauncher;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Camera Permission Launcher with rationale and settings redirection
        cameraPermissionLauncher = registerForActivityResult(
                new ActivityResultContracts.RequestPermission(),
                isGranted -> {
                    if (isGranted) {
                        startCameraX();
                    } else {
                        if (!shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)) {
                            showSettingsRedirectDialog();
                        } else {
                            showPermissionRationaleDialog();
                        }
                    }
                }
        );

        // Modern Android Photo Picker (zero invasive storage permissions)
        photoPickerLauncher = registerForActivityResult(
                new ActivityResultContracts.PickVisualMedia(),
                uri -> {
                    if (uri != null) {
                        handleSelectedImageUri(uri);
                    }
                }
        );
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_scan, container, false);

        viewfinder = v.findViewById(R.id.viewfinder);
        imgPreview = v.findViewById(R.id.img_preview);
        layoutPlaceholder = v.findViewById(R.id.layout_placeholder);
        layoutLoading = v.findViewById(R.id.layout_loading);
        layoutInputButtons = v.findViewById(R.id.layout_input_buttons);
        layoutPreviewControls = v.findViewById(R.id.layout_preview_controls);
        tvLoadingStage = v.findViewById(R.id.tv_loading_stage);
        tvErrorBanner = v.findViewById(R.id.tv_error_banner);

        btnTakePhoto = v.findViewById(R.id.btn_take_photo);
        btnUploadImage = v.findViewById(R.id.btn_upload_image);
        btnRunAnalysis = v.findViewById(R.id.btn_run_analysis);
        btnReplaceImage = v.findViewById(R.id.btn_replace_image);
        btnCancelImage = v.findViewById(R.id.btn_cancel_image);

        btnTakePhoto.setOnClickListener(view -> checkAndRequestCamera());
        btnUploadImage.setOnClickListener(view -> photoPickerLauncher.launch(
                new PickVisualMediaRequest.Builder()
                        .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE)
                        .build()
        ));

        btnRunAnalysis.setOnClickListener(view -> runAnalysis());
        btnReplaceImage.setOnClickListener(view -> btnUploadImage.performClick());
        btnCancelImage.setOnClickListener(view -> resetScanner());

        return v;
    }

    private void checkAndRequestCamera() {
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            startCameraX();
        } else {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA);
        }
    }

    private void showPermissionRationaleDialog() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Camera Access Needed")
                .setMessage(R.string.camera_permission_rationale)
                .setPositiveButton("Grant Permission", (d, w) -> cameraPermissionLauncher.launch(Manifest.permission.CAMERA))
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void showSettingsRedirectDialog() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Camera Permission Disabled")
                .setMessage("Camera permission was permanently denied. Please enable it in App Settings to use real-time food scanning.")
                .setPositiveButton("Open Settings", (d, w) -> {
                    Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    Uri uri = Uri.fromParts("package", requireContext().getPackageName(), null);
                    intent.setData(uri);
                    startActivity(intent);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void startCameraX() {
        layoutPlaceholder.setVisibility(View.GONE);
        viewfinder.setVisibility(View.VISIBLE);
        imgPreview.setVisibility(View.GONE);
        hideError();

        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(requireContext());
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                Preview preview = new Preview.Builder().build();
                preview.setSurfaceProvider(viewfinder.getSurfaceProvider());

                imageCapture = new ImageCapture.Builder()
                        .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
                        .build();

                CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
                cameraProvider.unbindAll();
                cameraProvider.bindToLifecycle(getViewLifecycleOwner(), cameraSelector, preview, imageCapture);

                btnTakePhoto.setText("CAPTURE");
                btnTakePhoto.setOnClickListener(v -> takePhotoFromCamera(cameraProvider));

            } catch (ExecutionException | InterruptedException e) {
                showError("Unable to initialize camera preview: " + e.getMessage());
            }
        }, ContextCompat.getMainExecutor(requireContext()));
    }

    private void takePhotoFromCamera(ProcessCameraProvider cameraProvider) {
        if (imageCapture == null) return;

        File photoFile = new File(requireContext().getCacheDir(), "scan_capture_" + System.currentTimeMillis() + ".jpg");
        ImageCapture.OutputFileOptions options = new ImageCapture.OutputFileOptions.Builder(photoFile).build();

        imageCapture.takePicture(options, ContextCompat.getMainExecutor(requireContext()), new ImageCapture.OnImageSavedCallback() {
            @Override
            public void onImageSaved(@NonNull ImageCapture.OutputFileResults outputFileResults) {
                cameraProvider.unbindAll();
                handleSelectedImageUri(Uri.fromFile(photoFile));
            }

            @Override
            public void onError(@NonNull ImageCaptureException exception) {
                showError("Camera capture failed: " + exception.getMessage());
            }
        });
    }

    private void handleSelectedImageUri(Uri uri) {
        currentImageUri = uri;
        currentBitmap = ImagePreprocessor.decodeSampledBitmapFromUri(requireContext(), uri, 224, 224);

        if (currentBitmap == null) {
            showError("Unable to read selected image. Please try another image.");
            return;
        }

        viewfinder.setVisibility(View.GONE);
        layoutPlaceholder.setVisibility(View.GONE);
        imgPreview.setVisibility(View.VISIBLE);
        imgPreview.setImageBitmap(currentBitmap);

        layoutInputButtons.setVisibility(View.GONE);
        layoutPreviewControls.setVisibility(View.VISIBLE);
        hideError();
    }

    private void runAnalysis() {
        if (currentBitmap == null) return;

        layoutLoading.setVisibility(View.VISIBLE);
        hideError();

        DewInferenceEngine.executePipeline(
                requireContext(),
                currentBitmap,
                currentImageUri != null ? currentImageUri.toString() : "",
                "local_user",
                new DewInferenceEngine.ScanCallback() {
                    @Override
                    public void onProgress(String stageMessage) {
                        requireActivity().runOnUiThread(() -> tvLoadingStage.setText(stageMessage));
                    }

                    @Override
                    public void onSuccess(ScanRecord record) {
                        requireActivity().runOnUiThread(() -> {
                            layoutLoading.setVisibility(View.GONE);
                            ScanResultFragment resultFragment = ScanResultFragment.newInstance(record);
                            ((MainActivity) requireActivity()).loadFragment(resultFragment);
                        });
                    }

                    @Override
                    public void onError(String errorMessage) {
                        requireActivity().runOnUiThread(() -> {
                            layoutLoading.setVisibility(View.GONE);
                            showError(errorMessage);
                        });
                    }
                }
        );
    }

    private void resetScanner() {
        currentBitmap = null;
        currentImageUri = null;
        viewfinder.setVisibility(View.GONE);
        imgPreview.setVisibility(View.GONE);
        layoutPlaceholder.setVisibility(View.VISIBLE);
        layoutInputButtons.setVisibility(View.VISIBLE);
        layoutPreviewControls.setVisibility(View.GONE);
        layoutLoading.setVisibility(View.GONE);
        btnTakePhoto.setText(R.string.btn_take_photo);
        btnTakePhoto.setOnClickListener(v -> checkAndRequestCamera());
        hideError();
    }

    private void showError(String msg) {
        tvErrorBanner.setText(msg);
        tvErrorBanner.setVisibility(View.VISIBLE);
    }

    private void hideError() {
        tvErrorBanner.setVisibility(View.GONE);
    }
}
