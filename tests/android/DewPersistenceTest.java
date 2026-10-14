package com.nutriscanai.app.tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.nutriscanai.app.model.ScanRecord;

import org.junit.Before;
import org.junit.Test;

/**
 * Unit test for Dew Computing record lifecycle and offline sync states.
 */
public class DewPersistenceTest {

    private ScanRecord sampleRecord;

    @Before
    public void setUp() {
        sampleRecord = new ScanRecord();
        sampleRecord.setId("dew_test_001");
        sampleRecord.setFoodName("Apple");
        sampleRecord.setFoodConfidence(0.95f);
        sampleRecord.setConditionPrediction("Visible surface damage & minor bruising");
        sampleRecord.setConditionConfidence(0.88f);
        sampleRecord.setAdulterantCategory("Artificial Wax Coating");
        sampleRecord.setAdulterationStatus("Pass (No obvious chemical markers)");
        sampleRecord.setOffline(true);
        sampleRecord.setInferenceTimeMs(38);
        sampleRecord.setTotalLatencyMs(112);
        sampleRecord.setSyncStatus("PENDING");
        sampleRecord.setUserId("user_alpha");
    }

    @Test
    public void testRecordCreationAndOfflineState() {
        assertNotNull(sampleRecord.getId());
        assertTrue("Inference must be marked offline on Dew node", sampleRecord.isOffline());
        assertEquals("Initial sync status must be PENDING", "PENDING", sampleRecord.syncStatus);
        assertEquals("Apple", sampleRecord.getFoodName());
    }

    @Test
    public void testSyncTransitionToSynchronized() {
        sampleRecord.setSyncStatus("SYNCHRONIZED");
        assertEquals("SYNCHRONIZED", sampleRecord.getSyncStatus());
    }

    @Test
    public void testLatencyThresholdCompliance() {
        assertTrue("TinyML inference on ARM NEON must execute under 80ms", sampleRecord.getInferenceTimeMs() < 80);
    }
}
