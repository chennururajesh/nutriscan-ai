# Food Adulteration Dataset Schema & Acquisition Protocol

## 1. Scope & Targeted Food Commodities

NutriScan AI targets high-risk, daily consumable commodities prone to economically motivated adulteration (EMA) under FSSAI / AOAC standards:

| Commodity | Target Adulterants | Detection Modality | Safety Severity |
| :--- | :--- | :--- | :--- |
| **Milk & Dairy** | Detergent, Urea, Starch, Synthetic Milk, Excess Water | Optical colorimetric strip & reflectance spectroscopy | Critical (Chemical toxicity) |
| **Honey** | High Fructose Corn Syrup (HFCS), Invert Sugar, Jaggery, C4 Sugars | Refractometric dispersion & visual texture patterns | High (Diabetic & allergen risk) |
| **Spices (Turmeric)** | Metanil Yellow dye, Lead Chromate, Chalk powder | Chromatic shift & acid-reaction reflectance | Critical (Carcinogenic / neurotoxic) |
| **Spices (Chili Powder)**| Sudan Red dye, Brick powder, Rhodamine B | Color consistency & sediment texture | Critical (Carcinogenic) |
| **Edible Oils (Mustard)**| Argemone oil, Mineral oil, Butter yellow dye | Viscosity, fluorescence & nitric acid turbidity | Critical (Epidemic dropsy) |
| **Black Pepper** | Papaya seeds, Light berries | Geometric morphological contours & surface rugosity | Moderate (Economic fraud) |

## 2. Directory Hierarchy

```text
dataset/
├── raw/               # Unprocessed raw camera captures & spectral sensor readings
│   ├── milk/
│   ├── honey/
│   ├── turmeric/
│   ├── chili/
│   └── edible_oil/
├── processed/         # Normalized, cropped, and resized (224x224 RGB) samples
└── annotations/       # Label mapping and JSON metadata schemas
```

## 3. Preprocessing Specifications
- Standard input resolution: `224 x 224 x 3` (RGB)
- Normalization: Scale pixel intensities to `[0.0, 1.0]` or `[-1.0, 1.0]` for MobileNetV3-Small
- Color Calibration: Standardized white-balance patch reference for variable ambient lighting.
