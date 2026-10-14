"""
NutriScan AI - TinyML Post-Training Quantization Pipeline
Converts trained Keras/SavedModel to INT8 TensorFlow Lite for Dew Computing nodes.
"""

import os
import sys
import logging
from pathlib import Path
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

def representative_dataset_generator():
    """
    Yields representative calibration samples for full INT8 quantization.
    Requires at least 100 diverse images from the training split.
    """
    dataset_dir = Path(__file__).resolve().parent.parent.parent / "dataset" / "processed"
    if not dataset_dir.exists():
        logging.warning("Processed dataset directory not found. Yielding synthetic calibration tensor for shape verification only.")
        for _ in range(10):
            yield [np.random.uniform(0.0, 1.0, (1, 224, 224, 3)).astype(np.float32)]
        return

    sample_files = list(dataset_dir.glob("*/*.*"))[:100]
    if len(sample_files) == 0:
        logging.warning("No calibration images found in dataset/processed. Yielding shape verification tensor.")
        for _ in range(10):
            yield [np.random.uniform(0.0, 1.0, (1, 224, 224, 3)).astype(np.float32)]
        return

    try:
        from PIL import Image
        for p in sample_files:
            with Image.open(p) as img:
                img = img.convert("RGB").resize((224, 224))
                arr = np.expand_dims(np.asarray(img, dtype=np.float32) / 255.0, axis=0)
                yield [arr]
    except Exception as e:
        logging.error(f"Error reading representative images: {e}")

def convert_to_tflite_int8(saved_model_path, export_tflite_path):
    """
    Converts a saved model into an INT8 quantized TFLite flatbuffer for ARM NEON Dew nodes.
    """
    try:
        import tensorflow as tf
    except ImportError:
        logging.error("TensorFlow is required for TFLite conversion. Please install requirements.txt")
        return False

    saved_path = Path(saved_model_path)
    if not saved_path.exists():
        logging.error(f"Trained model not found at {saved_model_path}. Training must be executed first.")
        return False

    logging.info(f"Loading model from {saved_model_path} for INT8 quantization...")
    converter = tf.lite.TFLiteConverter.from_saved_model(str(saved_path))
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.representative_dataset = representative_dataset_generator
    converter.target_spec.supported_ops = [tf.lite.OpsSet.TFLITE_BUILTINS_INT8]
    converter.inference_input_type = tf.uint8
    converter.inference_output_type = tf.uint8

    try:
        tflite_quant_model = converter.convert()
        export_path = Path(export_tflite_path)
        export_path.parent.mkdir(parents=True, exist_ok=True)
        with open(export_path, "wb") as f:
            f.write(tflite_quant_model)
        size_kb = len(tflite_quant_model) / 1024.0
        logging.info(f"Quantized INT8 model successfully exported to: {export_path} ({size_kb:.2f} KB)")
        return True
    except Exception as e:
        logging.error(f"Quantization conversion failed: {e}")
        return False

if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent.parent
    saved_model = base_dir / "checkpoints" / "saved_model"
    export_target = base_dir / "exports" / "nutriscan_tinyml_int8.tflite"
    
    logging.info("Checking prerequisites for TinyML quantization...")
    if not saved_model.exists():
        logging.info(
            f"Checkpoint directory {saved_model} is currently empty. "
            "Model training must be completed on labeled food images before generating the INT8 binary."
        )
    else:
        convert_to_tflite_int8(saved_model, export_target)
