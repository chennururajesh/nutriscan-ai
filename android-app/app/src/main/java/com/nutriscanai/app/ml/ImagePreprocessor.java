package com.nutriscanai.app.ml;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;

import java.io.InputStream;

/**
 * Image preprocessing and quality validation utility for on-device Dew Computing.
 * Prevents OutOfMemory errors using sub-sampled bitmap decoding.
 */
public class ImagePreprocessor {

    public static class ValidationResult {
        public boolean isValid;
        public String errorMessage;
        public float brightness;
        public float sharpness;

        public ValidationResult(boolean isValid, String errorMessage, float brightness, float sharpness) {
            this.isValid = isValid;
            this.errorMessage = errorMessage;
            this.brightness = brightness;
            this.sharpness = sharpness;
        }
    }

    public static Bitmap decodeSampledBitmapFromUri(Context context, Uri uri, int reqWidth, int reqHeight) {
        try {
            // First decode with inJustDecodeBounds=true to check dimensions
            final BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            InputStream is = context.getContentResolver().openInputStream(uri);
            BitmapFactory.decodeStream(is, null, options);
            if (is != null) is.close();

            // Calculate inSampleSize
            options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

            // Decode bitmap with inSampleSize set
            options.inJustDecodeBounds = false;
            options.inPreferredConfig = Bitmap.Config.RGB_565; // Memory efficient
            is = context.getContentResolver().openInputStream(uri);
            Bitmap bitmap = BitmapFactory.decodeStream(is, null, options);
            if (is != null) is.close();

            if (bitmap != null) {
                return Bitmap.createScaledBitmap(bitmap, reqWidth, reqHeight, true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        final int height = options.outHeight;
        final int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;
            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    /**
     * Stage 1: Image Validation.
     * Evaluates luminance (brightness) and high-pass edge gradient (sharpness).
     */
    public static ValidationResult validateImageQuality(Bitmap bitmap) {
        if (bitmap == null) {
            return new ValidationResult(false, "Unreadable or corrupted image file.", 0, 0);
        }

        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] pixels = new int[width * height];
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height);

        long totalLuminance = 0;
        long edgeGradient = 0;

        for (int i = 0; i < pixels.length; i++) {
            int p = pixels[i];
            int r = (p >> 16) & 0xFF;
            int g = (p >> 8) & 0xFF;
            int b = p & 0xFF;
            int lum = (int) (0.299 * r + 0.587 * g + 0.114 * b);
            totalLuminance += lum;

            if (i % width < width - 1) {
                int nextP = pixels[i + 1];
                int nextR = (nextP >> 16) & 0xFF;
                int nextG = (nextP >> 8) & 0xFF;
                int nextB = nextP & 0xFF;
                int nextLum = (int) (0.299 * nextR + 0.587 * nextG + 0.114 * nextB);
                edgeGradient += Math.abs(lum - nextLum);
            }
        }

        float avgLum = (float) totalLuminance / pixels.length;
        float sharpness = (float) edgeGradient / (pixels.length - height);

        if (avgLum < 25.0f) {
            return new ValidationResult(false, "Photograph is too dark for optical analysis. Please retake under better lighting.", avgLum, sharpness);
        }
        if (avgLum > 245.0f) {
            return new ValidationResult(false, "Photograph is overexposed or has severe glare. Please retake avoiding harsh reflections.", avgLum, sharpness);
        }
        if (sharpness < 4.0f) {
            return new ValidationResult(false, "Photograph appears blurry. Please hold camera steady and tap to focus.", avgLum, sharpness);
        }

        return new ValidationResult(true, "Image quality verified.", avgLum, sharpness);
    }
}
