package com.nutriscanai.app.data;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.nutriscanai.app.model.ScanRecord;

import java.util.ArrayList;
import java.util.List;

/**
 * Local SQLite Database Helper implementing Dew Computing offline persistence.
 * Isolates private scan logs by user identity.
 */
public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "nutriscan_dew.db";
    private static final int DATABASE_VERSION = 1;

    public static final String TABLE_SCANS = "scans";
    public static final String COL_ID = "id";
    public static final String COL_TIMESTAMP = "timestamp";
    public static final String COL_DATE = "formatted_date";
    public static final String COL_FOOD_NAME = "food_name";
    public static final String COL_FOOD_CONF = "food_confidence";
    public static final String COL_CATEGORY = "category_group";
    public static final String COL_CONDITION = "condition_pred";
    public static final String COL_COND_CONF = "condition_confidence";
    public static final String COL_COND_EXPL = "condition_explanation";
    public static final String COL_ADULT_CAT = "adulterant_cat";
    public static final String COL_ADULT_CONF = "adulterant_conf";
    public static final String COL_ADULT_STATUS = "adulterant_status";
    public static final String COL_IS_OFFLINE = "is_offline";
    public static final String COL_INF_TIME = "inference_time_ms";
    public static final String COL_TOTAL_LAT = "total_latency_ms";
    public static final String COL_SYNC_STATUS = "sync_status";
    public static final String COL_IMAGE_URI = "image_uri";
    public static final String COL_USER_ID = "user_id";

    private static final String CREATE_TABLE_SCANS = "CREATE TABLE " + TABLE_SCANS + " (" +
            COL_ID + " TEXT PRIMARY KEY, " +
            COL_TIMESTAMP + " INTEGER, " +
            COL_DATE + " TEXT, " +
            COL_FOOD_NAME + " TEXT, " +
            COL_FOOD_CONF + " REAL, " +
            COL_CATEGORY + " TEXT, " +
            COL_CONDITION + " TEXT, " +
            COL_COND_CONF + " REAL, " +
            COL_COND_EXPL + " TEXT, " +
            COL_ADULT_CAT + " TEXT, " +
            COL_ADULT_CONF + " REAL, " +
            COL_ADULT_STATUS + " TEXT, " +
            COL_IS_OFFLINE + " INTEGER, " +
            COL_INF_TIME + " INTEGER, " +
            COL_TOTAL_LAT + " INTEGER, " +
            COL_SYNC_STATUS + " TEXT, " +
            COL_IMAGE_URI + " TEXT, " +
            COL_USER_ID + " TEXT)";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE_SCANS);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SCANS);
        onCreate(db);
    }

    public long insertScan(ScanRecord record) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_ID, record.getId());
        cv.put(COL_TIMESTAMP, record.getTimestamp());
        cv.put(COL_DATE, record.getFormattedDate());
        cv.put(COL_FOOD_NAME, record.getFoodName());
        cv.put(COL_FOOD_CONF, record.getFoodConfidence());
        cv.put(COL_CATEGORY, record.getCategoryGroup());
        cv.put(COL_CONDITION, record.getConditionPrediction());
        cv.put(COL_COND_CONF, record.getConditionConfidence());
        cv.put(COL_COND_EXPL, record.getConditionExplanation());
        cv.put(COL_ADULT_CAT, record.getAdulterantCategory());
        cv.put(COL_ADULT_CONF, record.getAdulterationConfidence());
        cv.put(COL_ADULT_STATUS, record.getAdulterationStatus());
        cv.put(COL_IS_OFFLINE, record.isOffline() ? 1 : 0);
        cv.put(COL_INF_TIME, record.getInferenceTimeMs());
        cv.put(COL_TOTAL_LAT, record.getTotalLatencyMs());
        cv.put(COL_SYNC_STATUS, record.getSyncStatus());
        cv.put(COL_IMAGE_URI, record.getImageUri());
        cv.put(COL_USER_ID, record.getUserId());

        return db.insertWithOnConflict(TABLE_SCANS, null, cv, SQLiteDatabase.CONFLICT_REPLACE);
    }

    public List<ScanRecord> getAllScans(String userId) {
        List<ScanRecord> list = new ArrayList<>();
        SQLiteDatabase db = this.getReadableDatabase();
        String selection = (userId != null && !userId.isEmpty()) ? COL_USER_ID + " = ?" : null;
        String[] args = (userId != null && !userId.isEmpty()) ? new String[]{userId} : null;

        Cursor c = db.query(TABLE_SCANS, null, selection, args, null, null, COL_TIMESTAMP + " DESC");
        if (c != null && c.moveToFirst()) {
            do {
                ScanRecord r = new ScanRecord();
                r.setId(c.getString(c.getColumnIndexOrThrow(COL_ID)));
                r.setTimestamp(c.getLong(c.getColumnIndexOrThrow(COL_TIMESTAMP)));
                r.setFormattedDate(c.getString(c.getColumnIndexOrThrow(COL_DATE)));
                r.setFoodName(c.getString(c.getColumnIndexOrThrow(COL_FOOD_NAME)));
                r.setFoodConfidence(c.getFloat(c.getColumnIndexOrThrow(COL_FOOD_CONF)));
                r.setCategoryGroup(c.getString(c.getColumnIndexOrThrow(COL_CATEGORY)));
                r.setConditionPrediction(c.getString(c.getColumnIndexOrThrow(COL_CONDITION)));
                r.setConditionConfidence(c.getFloat(c.getColumnIndexOrThrow(COL_COND_CONF)));
                r.setConditionExplanation(c.getString(c.getColumnIndexOrThrow(COL_COND_EXPL)));
                r.setAdulterantCategory(c.getString(c.getColumnIndexOrThrow(COL_ADULT_CAT)));
                r.setAdulterationConfidence(c.getFloat(c.getColumnIndexOrThrow(COL_ADULT_CONF)));
                r.setAdulterationStatus(c.getString(c.getColumnIndexOrThrow(COL_ADULT_STATUS)));
                r.setOffline(c.getInt(c.getColumnIndexOrThrow(COL_IS_OFFLINE)) == 1);
                r.setInferenceTimeMs(c.getLong(c.getColumnIndexOrThrow(COL_INF_TIME)));
                r.setTotalLatencyMs(c.getLong(c.getColumnIndexOrThrow(COL_TOTAL_LAT)));
                r.setSyncStatus(c.getString(c.getColumnIndexOrThrow(COL_SYNC_STATUS)));
                r.setImageUri(c.getString(c.getColumnIndexOrThrow(COL_IMAGE_URI)));
                r.setUserId(c.getString(c.getColumnIndexOrThrow(COL_USER_ID)));
                list.add(r);
            } while (c.moveToNext());
            c.close();
        }
        return list;
    }

    public void updateSyncStatus(String scanId, String newStatus) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(COL_SYNC_STATUS, newStatus);
        db.update(TABLE_SCANS, cv, COL_ID + " = ?", new String[]{scanId});
    }

    public boolean deleteScan(String scanId) {
        SQLiteDatabase db = this.getWritableDatabase();
        return db.delete(TABLE_SCANS, COL_ID + " = ?", new String[]{scanId}) > 0;
    }

    public void clearAllScans() {
        SQLiteDatabase db = this.getWritableDatabase();
        db.delete(TABLE_SCANS, null, null);
    }
}
