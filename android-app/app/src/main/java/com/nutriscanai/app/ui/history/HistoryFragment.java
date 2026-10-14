package com.nutriscanai.app.ui.history;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.nutriscanai.app.R;
import com.nutriscanai.app.data.DatabaseHelper;
import com.nutriscanai.app.model.ScanRecord;

import java.util.List;

public class HistoryFragment extends Fragment {

    private RecyclerView recyclerView;
    private TextView tvEmpty;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_history, container, false);

        recyclerView = v.findViewById(R.id.recycler_history);
        tvEmpty = v.findViewById(R.id.tv_empty_history);

        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        loadHistory();

        return v;
    }

    private void loadHistory() {
        DatabaseHelper db = new DatabaseHelper(requireContext());
        List<ScanRecord> scans = db.getAllScans("local_user");

        if (scans.isEmpty()) {
            tvEmpty.setVisibility(View.VISIBLE);
            recyclerView.setVisibility(View.GONE);
        } else {
            tvEmpty.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            recyclerView.setAdapter(new HistoryAdapter(scans));
        }
    }

    private static class HistoryAdapter extends RecyclerView.Adapter<HistoryViewHolder> {
        private final List<ScanRecord> list;

        public HistoryAdapter(List<ScanRecord> list) {
            this.list = list;
        }

        @NonNull
        @Override
        public HistoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_history_card, parent, false);
            return new HistoryViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull HistoryViewHolder holder, int position) {
            ScanRecord item = list.get(position);
            holder.tvFood.setText(item.getFoodName());
            holder.tvStatus.setText(item.getSyncStatus());
            holder.tvCond.setText("Condition: " + item.getConditionPrediction());
            holder.tvDate.setText(item.getFormattedDate());
            holder.tvLatency.setText(item.getInferenceTimeMs() + " ms");
        }

        @Override
        public int getItemCount() {
            return list.size();
        }
    }

    private static class HistoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvFood, tvStatus, tvCond, tvDate, tvLatency;

        public HistoryViewHolder(@NonNull View itemView) {
            super(itemView);
            tvFood = itemView.findViewById(R.id.item_food_name);
            tvStatus = itemView.findViewById(R.id.item_sync_status);
            tvCond = itemView.findViewById(R.id.item_condition);
            tvDate = itemView.findViewById(R.id.item_date);
            tvLatency = itemView.findViewById(R.id.item_latency);
        }
    }
}
