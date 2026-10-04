from pathlib import Path
import shutil
import random

SOURCE = Path(r"C:\SmartRoad\RDD2022")
DEST = Path(r"C:\SmartRoad\AI\dataset")

TRAIN_LIMIT = 3000
VAL_LIMIT = 500
TEST_LIMIT = 500

random.seed(42)

# Clean old SmartRoad dataset
if DEST.exists():
    shutil.rmtree(DEST)

# Create folders
for split in ["train", "val", "test"]:
    (DEST / "images" / split).mkdir(parents=True, exist_ok=True)
    (DEST / "labels" / split).mkdir(parents=True, exist_ok=True)


def convert_label(source_label, destination_label):
    converted = []

    with open(source_label, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split()

            if len(parts) != 5:
                continue

            old_class = int(parts[0])

            # RDD2022:
            # 0 = Longitudinal
            # 1 = Transverse
            # 2 = Alligator
            # 3 = Pothole

            # SmartRoad:
            # 0 = crack
            # 1 = pothole

            if old_class in [0, 1, 2]:
                new_class = 0
            elif old_class == 3:
                new_class = 1
            else:
                continue

            converted.append(
                f"{new_class} "
                f"{parts[1]} {parts[2]} {parts[3]} {parts[4]}\n"
            )

    if not converted:
        return False

    with open(destination_label, "w", encoding="utf-8") as f:
        f.writelines(converted)

    return True


def get_labeled_images(split):
    image_dir = SOURCE / split / "images"
    label_dir = SOURCE / split / "labels"

    valid = []

    for image in image_dir.glob("*.jpg"):
        label = label_dir / f"{image.stem}.txt"

        if not label.exists():
            continue

        valid.append((image, label))

    return valid


def copy_items(items, split):
    destination_images = DEST / "images" / split
    destination_labels = DEST / "labels" / split

    count = 0

    for image, label in items:

        new_image = destination_images / image.name
        new_label = destination_labels / label.name

        shutil.copy2(image, new_image)

        if convert_label(label, new_label):
            count += 1
        else:
            new_image.unlink(missing_ok=True)

    return count


print("=" * 60)
print("SMARTROAD DATASET PREPARATION")
print("=" * 60)

# -----------------------------
# TRAIN
# -----------------------------

train_items = get_labeled_images("train")
random.shuffle(train_items)

# First 3000 = training
train_selection = train_items[:TRAIN_LIMIT]

# Next 500 = testing
test_selection = train_items[TRAIN_LIMIT:TRAIN_LIMIT + TEST_LIMIT]

train_count = copy_items(train_selection, "train")
test_count = copy_items(test_selection, "test")

# -----------------------------
# VALIDATION
# -----------------------------

val_items = get_labeled_images("val")
random.shuffle(val_items)

val_selection = val_items[:VAL_LIMIT]

val_count = copy_items(val_selection, "val")


print("\nTRAIN")
print("-" * 40)
print(f"Selected images : {train_count}")

print("\nVALIDATION")
print("-" * 40)
print(f"Selected images : {val_count}")

print("\nTEST")
print("-" * 40)
print(f"Selected images : {test_count}")


# -----------------------------
# DATA YAML
# -----------------------------

yaml_content = """path: C:/SmartRoad/AI/dataset

train: images/train
val: images/val
test: images/test

names:
  0: crack
  1: pothole
"""

with open(DEST / "data.yaml", "w", encoding="utf-8") as f:
    f.write(yaml_content)

print("\n" + "=" * 60)
print("SMARTROAD DATASET READY")
print("=" * 60)

print("0 = crack")
print("1 = pothole")
print("2 = waterlogging (will be added later)")