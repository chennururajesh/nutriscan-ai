# NutriScan AI - Food Adulteration Dataset Guidelines

This directory houses dataset acquisition protocols, manifest specifications, and calibration standards for the NutriScan AI Dew Computing and TinyML framework.

## Files
- `dataset_manifest.csv`: Tabular catalog of commodities, target sample counts, adulterants, and model readiness status.
- `DATASET_SCHEMA.md`: Scientific definition of targeted food groups, optical detection modalities, and safety severity levels.
- `food_category_registry.json`: Canonical registry of all 78 food commodities across 6 groups.

## Data Quality & Leakage Prevention Rules
1. **Resolution & Normalization**: All incoming training images must be standardized to `224x224x3` RGB.
2. **Stratified Splitting**: 70% Train, 15% Validation, 15% Test.
3. **Deduplication**: Perceptual hashing (`split_dataset.py`) must be executed prior to model training to prevent near-identical captures from leaking across training and evaluation splits.
