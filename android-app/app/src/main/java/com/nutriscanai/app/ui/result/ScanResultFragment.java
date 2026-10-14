package com.nutriscanai.app.ui.result;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;
import com.nutriscanai.app.MainActivity;
import com.nutriscanai.app.R;
import com.nutriscanai.app.model.ScanRecord;
import com.nutriscanai.app.ui.scan.ScanFragment;

public class ScanResultFragment extends Fragment {

    private static final String ARG_RECORD = "arg_scan_record";
    private ScanRecord record;

    public static ScanResultFragment newInstance(ScanRecord record) {
        ScanResultFragment fragment = new ScanResultFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_RECORD, record);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            record = (ScanRecord) getArguments().getSerializable(ARG_RECORD);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_scan_result, container, false);

        if (record == null) return v;

        TextView tvDate = v.findViewById(R.id.tv_result_date);
        TextView tvFood = v.findViewById(R.id.tv_detected_food);
        TextView tvFoodConf = v.findViewById(R.id.tv_food_confidence);
        TextView tvCond = v.findViewById(R.id.tv_condition_pred);
        TextView tvCondConf = v.findViewById(R.id.tv_condition_conf);
        TextView tvCondExpl = v.findViewById(R.id.tv_condition_expl);
        TextView tvAdultStatus = v.findViewById(R.id.tv_adult_status);
        TextView tvAdultCat = v.findViewById(R.id.tv_adult_cat);
        TextView tvAdultConf = v.findViewById(R.id.tv_adult_conf);
        TextView tvProcMode = v.findViewById(R.id.tv_proc_mode);
        TextView tvInfTime = v.findViewById(R.id.tv_inf_time);
        TextView tvTotalLat = v.findViewById(R.id.tv_total_latency);
        MaterialButton btnScanAgain = v.findViewById(R.id.btn_scan_again);

        tvDate.setText("Timestamp: " + record.getFormattedDate());
        tvFood.setText("Detected food: " + record.getFoodName());
        tvFoodConf.setText("Model confidence: " + Math.round(record.getFoodConfidence() * 100) + "%");
        tvCond.setText("Predicted condition: " + record.getConditionPrediction());
        tvCondConf.setText("Model confidence: " + Math.round(record.getConditionConfidence() * 100) + "%");
        tvCondExpl.setText(record.getConditionExplanation());
        tvAdultStatus.setText("Screening status: " + record.getAdulterationStatus());
        tvAdultCat.setText("Screened targets: " + record.getAdulterantCategory());
        tvAdultConf.setText("Model confidence: " + Math.round(record.getAdulterationConfidence() * 100) + "%");
        tvProcMode.setText("Processing mode: " + (record.isOffline() ? "Offline Dew Node" : "Cloud Verified"));
        tvInfTime.setText("Inference time: " + record.getInferenceTimeMs() + " ms");
        tvTotalLat.setText("Total latency: " + record.getTotalLatencyMs() + " ms");

        btnScanAgain.setOnClickListener(view -> {
            if (getActivity() instanceof MainActivity) {
                ((MainActivity) getActivity()).loadFragment(new ScanFragment());
            }
        });

        return v;
    }
}
