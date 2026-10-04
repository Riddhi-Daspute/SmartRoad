from pathlib import Path

BASE = Path("dataset")

folders = [
    BASE / "images" / "train",
    BASE / "images" / "val",
    BASE / "images" / "test",
    BASE / "labels" / "train",
    BASE / "labels" / "val",
    BASE / "labels" / "test",
]

print("SMARTROAD DATASET CHECK")
print("=" * 40)

for folder in folders:
    if folder.exists():
        files = list(folder.iterdir())
        print(f"OK   {folder} -> {len(files)} files")
    else:
        print(f"ERROR {folder} -> folder missing")

print("=" * 40)
print("Dataset structure check completed.")