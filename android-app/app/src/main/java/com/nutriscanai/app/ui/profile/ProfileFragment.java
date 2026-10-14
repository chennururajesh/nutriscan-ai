package com.nutriscanai.app.ui.profile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;
import com.nutriscanai.app.MainActivity;
import com.nutriscanai.app.R;
import com.nutriscanai.app.ui.about.AboutFragment;
import com.nutriscanai.app.ui.settings.SettingsFragment;

public class ProfileFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_profile, container, false);

        MaterialButton btnSettings = v.findViewById(R.id.btn_open_settings);
        MaterialButton btnAbout = v.findViewById(R.id.btn_open_about);

        btnSettings.setOnClickListener(view -> {
            if (getActivity() instanceof MainActivity) {
                ((MainActivity) getActivity()).loadFragment(new SettingsFragment());
            }
        });

        btnAbout.setOnClickListener(view -> {
            if (getActivity() instanceof MainActivity) {
                ((MainActivity) getActivity()).loadFragment(new AboutFragment());
            }
        });

        return v;
    }
}
