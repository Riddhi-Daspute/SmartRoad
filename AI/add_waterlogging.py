from pathlib import Path
import shutil

# ============================================================
# ADD WATERLOGGING TO SMARTROAD DATASET
#
# Existing SmartRoad:
# 0 = crack
# 1 = pothole
#
# Waterlogging dataset:
# 0 = water_logging
#
# New SmartRoad:
# 0 = crack
# 1 = pothole
# 2 = waterlogging
# ============================================================

SOURCE = Path(r"C:\SmartRoad\Waterlogging")
DEST = Path(r"C:\SmartRoad\AI\dataset")


def add_split(source_split, destination_split):

    source_images = SOURCE / source_split / "images"
    source_labels = SOURCE / source_split / "labels"

    destination_images = DEST / "images" / destination_split
    destination_labels = DEST / "labels" / destination_split

    destination_images.mkdir(parents=True, exist_ok=True)
    destination_labels.mkdir(parents=True, exist_ok=True)

    count = 0

    for image in source_images.glob("*"):

        if image.suffix.lower() not in [".jpg", ".jpeg", ".png"]:
            continue

        label = source_labels / f"{image.stem}.txt"

        if not label.exists():
            continue

        # Prefix filename to avoid collisions
        new_name = f"water_{image.name}"
        new_label_name = f"water_{label.name}"

        destination_image = destination_images / new_name
        destination_label = destination_labels / new_label_name

        shutil.copy2(image, destination_image)

        # Convert waterlogging class 0 -> SmartRoad class 2
        new_lines = []

        with open(label, "r", encoding="utf-8") as f:

            for line in f:

                parts = line.strip().split()

                if len(parts) != 5:
                    continue

                # Waterlogging source class = 0
                parts[0] = "2"

                new_lines.append(" ".join(parts) + "\n")

        if new_lines:

            with open(destination_label, "w", encoding="utf-8") as f:
                f.writelines(new_lines)

            count += 1

        else:
            destination_image.unlink(missing_ok=True)

    print(f"{source_split} -> {destination_split}: {count} waterlogging images added")


print("=" * 60)
print("ADDING WATERLOGGING TO SMARTROAD")
print("=" * 60)

# Waterlogging dataset uses:
# train -> train
# valid -> val
# test  -> test

add_split("train", "train")
add_split("valid", "val")
add_split("test", "test")


# Update SmartRoad data.yaml

yaml_content = """path: C:/SmartRoad/AI/dataset

train: images/train
val: images/val
test: images/test

names:
  0: crack
  1: pothole
  2: waterlogging
"""

with open(DEST / "data.yaml", "w", encoding="utf-8") as f:
    f.write(yaml_content)

print()
print("=" * 60)
print("SMARTROAD DATASET UPDATED")
print("=" * 60)
print("0 = crack")
print("1 = pothole")
print("2 = waterlogging")
print("=" * 60)