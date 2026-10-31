from pathlib import Path

LABEL_DIRS = [
    Path("dataset/labels/train"),
    Path("dataset/labels/val"),
    Path("dataset/labels/test"),
]

CLASS_NAMES = {
    0: "crack",
    1: "pothole",
    2: "waterlogging"
}

errors = []
class_counts = {}

for label_dir in LABEL_DIRS:

    for file in label_dir.glob("*.txt"):

        for line_no, line in enumerate(
            file.read_text().splitlines(), start=1
        ):

            if not line.strip():
                continue

            parts = line.split()

            if len(parts) != 5:
                errors.append(
                    f"{file}:{line_no} -> wrong number of values"
                )
                continue

            try:
                class_id = int(parts[0])
                values = [float(x) for x in parts[1:]]
            except ValueError:
                errors.append(
                    f"{file}:{line_no} -> invalid number"
                )
                continue

            if class_id not in CLASS_NAMES:
                errors.append(
                    f"{file}:{line_no} -> invalid class {class_id}"
                )
                continue

            if not all(0 <= x <= 1 for x in values):
                errors.append(
                    f"{file}:{line_no} -> coordinate outside 0-1"
                )

            class_counts[class_id] = (
                class_counts.get(class_id, 0) + 1
            )


print("=" * 55)
print("SMARTROAD FINAL LABEL VERIFICATION")
print("=" * 55)

print("\nClass counts:")

for class_id in sorted(CLASS_NAMES):
    print(
        f"{class_id} = {CLASS_NAMES[class_id]}: "
        f"{class_counts.get(class_id, 0)}"
    )

print("\nErrors:", len(errors))

if errors:
    print("\nFirst 10 errors:")
    for error in errors[:10]:
        print(error)
else:
    print("All labels are valid!")

print("=" * 55)