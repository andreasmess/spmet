"""Rebuild web images from the original JPGs. Requires Pillow; no site runtime dependencies."""

import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

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


def social_font(override, bold=False):
    """Use an explicit font or a common Greek-capable system font."""
    if override:
        return str(override)
    candidates = (
        ["/System/Library/Fonts/Supplemental/Arial Bold.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
        if bold else
        ["/System/Library/Fonts/Supplemental/Arial.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    )
    for candidate in candidates:
        if Path(candidate).is_file():
            return candidate
    raise RuntimeError("Provide --social-font and --social-bold-font with Greek-capable TTF files.")


def export_social(regular, bold):
    """The composition is source-controlled here; never replace it with a logo resize."""
    image = Image.new("RGB", (1200, 630), "#004d61")
    draw = ImageDraw.Draw(image)
    draw.rectangle((56, 60, 66, 568), fill="#88395b")
    draw.rounded_rectangle((1000, 52, 1144, 206), radius=12, fill="white")
    with Image.open(ROOT / "logo.jpg") as original:
        logo = ImageOps.exif_transpose(original).convert("RGB")
        logo.thumbnail((120, 130), Image.Resampling.LANCZOS)
        image.paste(logo, (1072 - logo.width // 2, 129 - logo.height // 2))

    def line(text, xy, size, font, color="white"):
        face = ImageFont.truetype(font, size)
        bounds = draw.textbbox(xy, text, font=face)
        if bounds[2] > 1144 or bounds[3] > 600:
            raise ValueError("Social text exceeds the canvas: " + text)
        draw.text(xy, text, font=face, fill=color)

    line("ΜΗΧΑΝΙΚΟΙ ΕΝΕΡΓΕΙΑΚΗΣ ΤΕΧΝΟΛΟΓΙΑΣ", (100, 72), 25, bold)
    line("Το πτυχίο δεν", (100, 172), 78, bold)
    line("αρκεί πάντα.", (100, 264), 78, bold)
    line("Το εμπόδιο στις επαγγελματικές", (100, 394), 38, regular)
    line("εγγραφές και άδειες", (100, 444), 38, regular)
    line("spmet.gr", (100, 546), 30, bold, "#b7e1e5")
    path = OUTPUT / "social.jpg"
    image.save(path, "JPEG", quality=90, optimize=True, progressive=True)
    print("{}: 1200 × 630, {:,} bytes".format(path, path.stat().st_size))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--social-only", action="store_true", help="Only rebuild the sharing card")
    parser.add_argument("--social-font", type=Path, help="Greek-capable regular TTF font")
    parser.add_argument("--social-bold-font", type=Path, help="Greek-capable bold TTF font")
    args = parser.parse_args()
    export_social(social_font(args.social_font), social_font(args.social_bold_font, bold=True))
    if not args.social_only:
        export("logo.jpg", "logo-small.webp", 96)
        export("logo.jpg", "logo.webp", 384)
        for source in ["synantisi.jpg", "synantisi2.jpg", "epistoles.jpg"]:
            stem = Path(source).stem
            export(source, stem + ".webp", 1000)
            export(source, stem + "-480.webp", 480)


if __name__ == "__main__":
    main()
