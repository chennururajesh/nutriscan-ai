package com.nutriscanai.app.model;

import java.io.Serializable;

/**
 * Entity representing an on-device Dew Computing scan record.
 */
public class ScanRecord implements Serializable {
    private String id;
    private long timestamp;
    private String formattedDate;
    private String foodName;
    private float foodConfidence;
    private String categoryGroup;
    private String conditionPrediction;
    private float conditionConfidence;
    private String conditionExplanation;
    private String adulterantCategory;
    private float adulterationConfidence;
    private String adulterationStatus;
    private boolean isOffline;
    private long inferenceTimeMs;
    private long totalLatencyMs;
    private String syncStatus; // PENDING, SYNCHRONIZED, FAILED
    private String imageUri;
    private String userId;

    public ScanRecord() {
        this.timestamp = System.currentTimeMillis();
        this.syncStatus = "PENDING";
        this.isOffline = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getFormattedDate() { return formattedDate; }
    public void setFormattedDate(String formattedDate) { this.formattedDate = formattedDate; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public float getFoodConfidence() { return foodConfidence; }
    public void setFoodConfidence(float foodConfidence) { this.foodConfidence = foodConfidence; }

    public String getCategoryGroup() { return categoryGroup; }
    public void setCategoryGroup(String categoryGroup) { this.categoryGroup = categoryGroup; }

    public String getConditionPrediction() { return conditionPrediction; }
    public void setConditionPrediction(String conditionPrediction) { this.conditionPrediction = conditionPrediction; }

    public float getConditionConfidence() { return conditionConfidence; }
    public void setConditionConfidence(float conditionConfidence) { this.conditionConfidence = conditionConfidence; }

    public String getConditionExplanation() { return conditionExplanation; }
    public void setConditionExplanation(String conditionExplanation) { this.conditionExplanation = conditionExplanation; }

    public String getAdulterantCategory() { return adulterantCategory; }
    public void setAdulterantCategory(String adulterantCategory) { this.adulterantCategory = adulterantCategory; }

    public float getAdulterationConfidence() { return adulterationConfidence; }
    public void setAdulterationConfidence(float adulterationConfidence) { this.adulterationConfidence = adulterationConfidence; }

    public String getAdulterationStatus() { return adulterationStatus; }
    public void setAdulterationStatus(String adulterationStatus) { this.adulterationStatus = adulterationStatus; }

    public boolean isOffline() { return isOffline; }
    public void setOffline(boolean offline) { isOffline = offline; }

    public long getInferenceTimeMs() { return inferenceTimeMs; }
    public void setInferenceTimeMs(long inferenceTimeMs) { this.inferenceTimeMs = inferenceTimeMs; }

    public long getTotalLatencyMs() { return totalLatencyMs; }
    public void setTotalLatencyMs(long totalLatencyMs) { this.totalLatencyMs = totalLatencyMs; }

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public String getImageUri() { return imageUri; }
    public void setImageUri(String imageUri) { this.imageUri = imageUri; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
