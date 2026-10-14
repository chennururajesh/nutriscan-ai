"""
NutriScan AI - Dataset Loader & Preprocessing Pipeline
Prepares food adulteration image and photometric dataset for TinyML edge training.
"""

import os
import sys
import logging
from pathlib import Path
import numpy as np
from PIL import Image

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

SUPPORTED_CATEGORIES = {
    "milk": ["pure", "adulterated_detergent", "adulterated_urea", "adulterated_starch"],
    "honey": ["pure", "adulterated_corn_syrup", "adulterated_invert_sugar"],
    "turmeric": ["pure", "adulterated_metanil_yellow", "adulterated_lead_chromate"],
    "chili": ["pure", "adulterated_sudan_red", "adulterated_brick_powder"],
    "edible_oil": ["pure", "adulterated_argemone", "adulterated_mineral_oil"],
}

TARGET_IMAGE_SIZE = (224, 224)

def inspect_dataset_directory(dataset_root_path):
    """
    Inspects whether the raw or processed dataset directories contain required samples.
    """
    root = Path(dataset_root_path)
    raw_dir = root / "raw"
    processed_dir = root / "processed"
    
    summary = {
        "raw_exists": raw_dir.exists(),
        "processed_exists": processed_dir.exists(),
        "categories_found": {},
        "total_samples": 0
    }
    
    if raw_dir.exists():
        for category_dir in raw_dir.iterdir():
            if category_dir.is_dir():
                count = len(list(category_dir.glob("*.*")))
                summary["categories_found"][category_dir.name] = count
                summary["total_samples"] += count
                
    return summary

def preprocess_image(image_path, target_size=TARGET_IMAGE_SIZE):
    """
    Validates, crops to square, and normalizes an image to [0, 1] float32 tensor.
    """
    with Image.open(image_path) as img:
        img = img.convert("RGB")
        width, height = img.size
        min_dim = min(width, height)
        
        # Center crop
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim
        img_cropped = img.crop((left, top, right, bottom))
        
        # Resize with high-quality resampling
        img_resized = img_cropped.resize(target_size, Image.Resampling.BILINEAR)
        tensor = np.asarray(img_resized, dtype=np.float32) / 255.0
        return tensor

if __name__ == "__main__":
    base_dataset = Path(__file__).resolve().parent.parent.parent / "dataset"
    logging.info(f"Inspecting dataset at: {base_dataset}")
    report = inspect_dataset_directory(base_dataset)
    logging.info(f"Dataset Inspection Report: {report}")
