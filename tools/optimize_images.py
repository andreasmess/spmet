"""Rebuild web images from the original JPGs. Requires Pillow; no site runtime dependencies."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets"
OUTPUT.mkdir(exist_ok=True)


def export(source, name, width, format="WEBP", quality=82):
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
        options = {"quality": quality}
        if format == "WEBP":
            options["method"] = 6
        else:
            options.update(optimize=True, progressive=True)
        path = OUTPUT / name
        image.save(path, format, **options)
        print("{}: {} × {}, {:,} bytes".format(name, *image.size, path.stat().st_size))


export("logo.jpg", "logo-small.webp", 96)
export("logo.jpg", "logo.webp", 384)
export("logo.jpg", "social.jpg", 600, "JPEG", 85)
for source in ["synantisi.jpg", "synantisi2.jpg", "epistoles.jpg"]:
    stem = Path(source).stem
    export(source, stem + ".webp", 1000)
    export(source, stem + "-480.webp", 480)
