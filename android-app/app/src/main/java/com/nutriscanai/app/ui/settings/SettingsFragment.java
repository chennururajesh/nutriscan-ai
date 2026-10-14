package com.nutriscanai.app.ui.settings;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;
import com.nutriscanai.app.R;
import com.nutriscanai.app.data.DatabaseHelper;

public class SettingsFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_settings, container, false);

        MaterialButton btnClear = v.findViewById(R.id.btn_clear_history);
        btnClear.setOnClickListener(view -> {
            new AlertDialog.Builder(requireContext())
                    .setTitle("Clear All History?")
                    .setMessage("This will remove all locally stored Dew scan records from your device.")
                    .setPositiveButton("Clear", (d, w) -> {
                        DatabaseHelper db = new DatabaseHelper(requireContext());
                        db.clearAllScans();
                        Toast.makeText(requireContext(), "History cleared.", Toast.LENGTH_SHORT).show();
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
        });

        return v;
    }
}
