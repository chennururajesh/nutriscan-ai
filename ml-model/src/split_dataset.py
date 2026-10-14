"""
NutriScan AI - Dataset Splitting and Leakage Prevention Module
Performs stratified splitting into Train (70%), Validation (15%), and Test (15%) splits
while applying perceptual deduplication to prevent near-duplicate sample leakage.
"""

import os
import sys
import hashlib
import json
import logging
from pathlib import Path
from collections import defaultdict

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def compute_image_fingerprint(image_path):
    """
    Computes a content hash using normalized pixel downsampling
    to identify exact and near-identical duplicate captures.
    """
    try:
        from PIL import Image
        with Image.open(image_path) as img:
            # Resize to small 16x16 grayscale thumb for fast structural hash
            thumb = img.convert("L").resize((16, 16), Image.Resampling.BILINEAR)
            pixels = list(thumb.getdata())
            avg = sum(pixels) / len(pixels)
            bits = "".join(["1" if p > avg else "0" for p in pixels])
            return hex(int(bits, 2))[2:]
    except Exception as e:
        # Fallback to standard MD5 hash of raw bytes
        hasher = hashlib.md5()
        with open(image_path, "rb") as f:
            hasher.update(f.read())
        return hasher.hexdigest()

def split_dataset(raw_dir, processed_dir, split_ratios=(0.70, 0.15, 0.15)):
    raw_path = Path(raw_dir)
    processed_path = Path(processed_dir)
    
    if not raw_path.exists():
        logging.error(f"Raw dataset directory not found at: {raw_path}")
        return False

    classes = [d for d in raw_path.iterdir() if d.is_dir()]
    if not classes:
        logging.warning(f"No class subdirectories found in {raw_path}.")
        return False

    split_manifest = {
        "train": defaultdict(list),
        "validation": defaultdict(list),
        "test": defaultdict(list)
    }
    
    seen_hashes = {}
    duplicates_dropped = 0

    for cls_dir in classes:
        class_name = cls_dir.name
        files = list(cls_dir.glob("*.*"))
        unique_files = []

        for f in files:
            fprint = compute_image_fingerprint(f)
            if fprint in seen_hashes:
                duplicates_dropped += 1
                logging.debug(f"Dropping duplicate image: {f} (matches {seen_hashes[fprint]})")
                continue
            seen_hashes[fprint] = str(f)
            unique_files.append(f)

        n = len(unique_files)
        if n == 0:
            continue

        n_train = int(n * split_ratios[0])
        n_val = int(n * split_ratios[1])
        
        train_files = unique_files[:n_train]
        val_files = unique_files[n_train:n_train + n_val]
        test_files = unique_files[n_train + n_val:]

        split_manifest["train"][class_name] = [str(f) for f in train_files]
        split_manifest["validation"][class_name] = [str(f) for f in val_files]
        split_manifest["test"][class_name] = [str(f) for f in test_files]

    logging.info(f"Deduplication complete. Dropped {duplicates_dropped} duplicate or leaking images.")
    
    manifest_path = processed_path / "split_manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump(split_manifest, f, indent=2)
        
    logging.info(f"Split manifest written to: {manifest_path}")
    return True

if __name__ == "__main__":
    base = Path(__file__).resolve().parent.parent.parent / "dataset"
    raw = base / "raw"
    processed = base / "processed"
    logging.info("Validating dataset splits...")
    split_dataset(raw, processed)
