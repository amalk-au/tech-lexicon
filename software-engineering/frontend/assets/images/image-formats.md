# Frontend Image Formats — Practical Guide

[Back to the topic index](./README.md)
[Back to Main Index](../../../topics-index.md)

A practical reference for choosing image formats in modern frontend development.

> **TL;DR:** For most modern web applications, use **AVIF** or **WebP** for raster images, **SVG** for icons and vector graphics, and **PNG** when you specifically need lossless quality or reliable transparency. Keep **JPEG** around for legacy compatibility and workflows where AVIF/WebP aren't appropriate.

---

## Quick Reference

| Format          | Type   | Compression          | Transparency | Animation | Best For                                | Recommendation                    |
| --------------- | ------ | -------------------- | ------------ | --------- | --------------------------------------- | --------------------------------- |
| **AVIF**        | Raster | Lossy / Lossless     | ✅           | ✅        | Photos, hero images, modern web         | ⭐ Default for modern raster      |
| **WebP**        | Raster | Lossy / Lossless     | ✅           | ✅        | General web images                      | ⭐ Excellent default              |
| **JPEG / JPG**  | Raster | Lossy                | ❌           | ❌        | Photos, legacy compatibility            | Good fallback                     |
| **PNG**         | Raster | Lossless             | ✅           | ❌        | UI assets, screenshots, transparency    | Use when needed                   |
| **SVG**         | Vector | N/A                  | ✅           | ✅        | Icons, logos, illustrations             | ⭐ Default for vectors            |
| **GIF**         | Raster | Lossy-ish / limited  | 1-bit        | ✅        | Simple legacy animations                | Avoid for new work                |
| **APNG**        | Raster | Lossless             | ✅           | ✅        | High-quality animations                 | Niche                             |
| **JPEG XL**     | Raster | Lossy / Lossless     | ✅           | ✅        | High-quality archival / specialized use | Don't rely on it for web delivery |
| **HEIC / HEIF** | Raster | Lossy / Lossless     | ✅           | ✅        | Apple/device ecosystems                 | Avoid as primary web format       |
| **BMP**         | Raster | Usually uncompressed | ❌           | ❌        | Legacy/raw images                       | Avoid                             |
| **TIFF**        | Raster | Lossy / Lossless     | ✅           | ❌        | Print, photography, source assets       | Avoid for web delivery            |

---

# 1\. AVIF

**AVIF** (AV1 Image File Format) is a modern image format based on the AV1 video codec.

```text
.jpg  →  image.jpg
.avif →  image.avif
```

### Pros

- Excellent compression

- Usually smaller than JPEG at similar visual quality

- Often smaller than WebP at comparable quality

- Supports lossy compression

- Supports lossless compression

- Supports alpha transparency

- Supports animation

- Supports HDR and wide-gamut color

- Excellent for bandwidth-sensitive applications

### Cons

- Encoding can be slower than JPEG/WebP

- Decoding can be more CPU-intensive in some situations

- Tooling is newer than JPEG/PNG

- Some older browsers and environments may not support it

- Not ideal when maximum compatibility is required

### Best use cases

- Hero images

- Product photography

- Blog images

- Marketing pages

- Large photographic assets

- Image-heavy applications

### Recommendation

**Use AVIF as a primary format for modern web applications when your image pipeline supports it.**

For production applications, consider providing a WebP/JPEG fallback when compatibility matters.

---

# 2\. WebP

**WebP** was developed by Google and is now widely supported across modern browsers.

```text
.webp
```

### Pros

- Excellent compression

- Smaller than JPEG in many cases

- Supports lossy compression

- Supports lossless compression

- Supports transparency

- Supports animation

- Very good browser support

- Mature tooling and CDN support

- Good balance between quality, size and compatibility

### Cons

- Can still be larger than AVIF for some images

- Encoding/decoding isn't always as efficient as newer formats

- Not ideal for every type of image

- Some specialized image-processing workflows still prefer PNG/JPEG/TIFF

### Best use cases

- General web images

- Product images

- Blog images

- Thumbnails

- UI assets

- Marketing websites

### Recommendation

**WebP is an excellent general-purpose default.**

If you don't want to deal with multiple formats, WebP is a very safe choice for modern web development.

---

# 3\. JPEG / JPG

JPEG is one of the oldest and most widely supported web image formats.

```text
.jpg
.jpeg
```

JPEG uses **lossy compression**.

### Pros

- Extremely widespread support

- Excellent for photographs

- Small file sizes

- Very mature tooling

- Fast encoding/decoding

- Supported virtually everywhere

### Cons

- Lossy only

- No alpha transparency

- Compression artifacts can appear

- Poor choice for text-heavy images

- Poor choice for logos/icons

- Less efficient than modern formats such as AVIF and WebP

### Best use cases

- Photographs

- Legacy browser support

- External integrations requiring JPEG

- Source material where JPEG is already required

### Recommendation

**Don't choose JPEG automatically for new web projects.**

Prefer:

```text
AVIF → WebP → JPEG fallback
```

when your tooling and browser-support requirements justify it.

---

# 4\. PNG

PNG is a lossless raster image format.

```text
.png
```

PNG is particularly useful when image fidelity and transparency matter.

### Pros

- Lossless compression

- Excellent image quality

- Supports alpha transparency

- Excellent for screenshots

- Excellent for UI assets

- Excellent for diagrams

- Excellent for images containing text

- Very mature format

### Cons

- Often significantly larger than WebP/AVIF

- Not suitable for most photographs

- No native animation in standard PNG

- Can negatively affect page weight if overused

### Best use cases

- Screenshots

- Logos requiring raster output

- UI graphics

- Images with sharp edges

- Images containing text

- Transparent assets

- Pixel-perfect graphics

### Recommendation

**Use PNG when you actually need lossless raster output.**

Don't use PNG simply because it "looks better."

For many assets:

```text
PNG → WebP/AVIF
```

can produce a substantially smaller file while maintaining visually equivalent quality.

---

# 5\. SVG

SVG (Scalable Vector Graphics) is fundamentally different from JPEG, PNG, WebP and AVIF.

It is a **vector** format rather than a raster format.

```text
.svg
```

Example:

```xml
<svg viewBox="0 0 24 24">
  ...
</svg>
```

### Pros

- Infinitely scalable

- Usually extremely small for simple graphics

- Perfect for icons

- Perfect for logos

- Can be styled with CSS

- Can be manipulated with JavaScript

- Supports animation

- Supports transparency

- Excellent for responsive designs

- No pixelation when scaled

### Cons

- Not suitable for photographs

- Complex SVGs can become large

- Complex SVGs can be expensive to render

- SVG can contain JavaScript

- Untrusted SVG files can create security risks

- Some image-processing pipelines don't handle SVG as easily as raster formats

### Best use cases

- Icons

- Logos

- UI illustrations

- Diagrams

- Charts

- Simple illustrations

- Brand assets

### Recommendation

**Use SVG whenever the source artwork is naturally vector-based.**

For example:

```text
Icon      → SVG
Logo      → SVG
UI symbol → SVG
Chart     → SVG
Photo     → AVIF/WebP
```

---

# 6\. GIF

GIF is an old raster image format that is best known for animation.

```text
.gif
```

### Pros

- Very widely supported

- Supports animation

- Simple format

- Easy to create and display

### Cons

- Limited to 256 colors per frame

- Poor image quality for photographs

- Large compared with modern video/image formats

- Transparency is limited

- Poor compression compared with modern formats

### Best use cases

- Existing legacy GIFs

- Very simple animations

- Compatibility with old systems

### Recommendation

**Avoid GIF for new animations whenever possible.**

For animations, consider:

```text
Video → MP4/WebM
Animation → WebP/AVIF
Simple vector animation → SVG
```

A short video can be dramatically smaller and higher quality than an equivalent animated GIF.

---

# 7\. APNG

**APNG** = Animated PNG.

It extends PNG to support animation.

```text
.apng
```

### Pros

- Lossless

- Supports transparency

- High-quality animation

- Full color

- Better quality than GIF

- Useful for UI animations

### Cons

- Can produce large files

- Not as universally useful as WebP

- Not appropriate for photographs

- Usually unnecessary for simple web animations

### Best use cases

- High-quality animated UI graphics

- Animated stickers

- Assets requiring transparency + animation

### Recommendation

Use APNG when you specifically need its combination of:

```text
lossless + alpha + animation
```

Otherwise, WebP or video may be a better choice.

---

# 8\. JPEG XL

JPEG XL (`.jxl`) is a modern image format designed as a successor to JPEG with advanced compression and image features.

### Pros

- Excellent compression

- Lossless JPEG recompression

- Lossy and lossless modes

- HDR support

- Wide color gamut

- High image quality

- Useful for archival workflows

### Cons

- Browser support has historically been inconsistent

- Web delivery ecosystem is less mature than WebP/AVIF

- CDN/tooling support is less universal

### Best use cases

- Image archives

- Professional image workflows

- Specialized applications

- JPEG preservation/recompression

### Recommendation

**Don't make JPEG XL your only web-delivery format unless you control your target environment.**

For general web applications, AVIF/WebP remain safer choices.

---

# 9\. HEIF / HEIC

HEIF is a container format commonly associated with Apple's HEIC image files.

```text
.heif
.heic
```

### Pros

- Excellent compression

- High image quality

- Supports modern image features

- Common on Apple devices

- Good for device storage

### Cons

- Browser support is inconsistent

- Web tooling is less universal

- Not a good universal web delivery format

- Licensing/ecosystem considerations can complicate deployment

### Best use cases

- Native/mobile applications

- Camera/device storage

- Apple ecosystem workflows

- Original user-uploaded images before server-side conversion

### Recommendation

**Accept HEIC uploads if useful, but convert them to a web-friendly format before delivery.**

For example:

```text
iPhone
   │
   ▼
HEIC upload
   │
   ▼
Image processing pipeline
   │
   ├── AVIF
   ├── WebP
   └── JPEG fallback
```

---

# 10\. BMP

BMP is a legacy bitmap format.

```text
.bmp
```

### Pros

- Very simple

- Lossless/raw pixel representation

- Easy to process

### Cons

- Very large files

- Poor compression

- Not designed for modern web delivery

- Usually unnecessary

### Recommendation

**Avoid BMP on the web.**

---

# 11\. TIFF

TIFF is primarily used in professional imaging and print workflows.

```text
.tif
.tiff
```

### Pros

- Excellent image quality

- Lossless options

- Supports high bit depths

- Supports professional imaging workflows

- Widely used in print/scanning

### Cons

- Very large files

- Poor choice for web delivery

- Browser support isn't intended as a general web delivery solution

- More complex than typical web formats

### Best use cases

```text
Photography workflow
Printing
Scanning
Archival
Professional image editing
```

### Recommendation

**Keep TIFF as a source/master format rather than a web delivery format.**

---

# Choosing the Right Format

## Photographs

Use:

```text
AVIF
  ↓ fallback
WebP
  ↓ fallback
JPEG
```

Example:

```html
<picture>
  <source srcset="/images/hero.avif" type="image/avif" />
  <source srcset="/images/hero.webp" type="image/webp" />

  <img src="/images/hero.jpg" alt="Description of the image" />
</picture>
```

---

## Logos

Use:

```text
SVG
```

Example:

```html
<img src="/logo.svg" alt="Company name" />
```

If the logo is genuinely raster artwork:

```text
AVIF/WebP
```

can be appropriate.

---

## Icons

Prefer:

```text
SVG
```

or an icon system that ultimately renders SVG.

Avoid using:

```text
PNG
GIF
JPEG
```

for simple icons unless there is a specific reason.

---

## Screenshots

Good choices:

```text
PNG
WebP
AVIF
```

For screenshots containing lots of text, UI elements and sharp edges, compare visually before switching away from PNG.

---

## Transparent Images

Good choices:

```text
SVG
AVIF
WebP
PNG
```

Choose based on the asset:

```text
Vector → SVG
Photo with transparency → AVIF/WebP
Pixel-perfect UI graphic → PNG
```

---

## Animation

Consider:

```text
Video
WebP
AVIF
APNG
SVG
```

Avoid GIF for new projects unless compatibility or an existing workflow requires it.

---

# Format Decision Tree

```text
                    What kind of image?
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Vector                       Raster
             │                           │
       ┌─────┴─────┐             ┌───────┴────────┐
       │           │             │                │
    Icon/Logo   Illustration   Photo          Screenshot
       │           │             │                │
       └─────┬─────┘             │                │
             │                   │                │
            SVG               AVIF/WebP       PNG/WebP/AVIF
```

For raster images:

```text
Need maximum modern compression?
        │
       YES
        │
       AVIF
        │
        └── Need broad compatibility?
                    │
                   YES
                    │
                  WebP
                    │
                    └── JPEG fallback
```

---

# Modern HTML Image Delivery

Don't just select a format.

**Image dimensions and responsive delivery matter just as much.**

A 4000×3000 image displayed at 400×300 is still potentially a huge download.

Use:

- `srcset`

- `sizes`

- `<picture>`

- appropriate dimensions

- lazy loading

- CDN/image transformation

- compression

Example:

```html
<picture>
  <source
    type="image/avif"
    srcset="
      /images/product-400.avif   400w,
      /images/product-800.avif   800w,
      /images/product-1200.avif 1200w
    "
  />

  <source
    type="image/webp"
    srcset="
      /images/product-400.webp   400w,
      /images/product-800.webp   800w,
      /images/product-1200.webp 1200w
    "
  />

  <img
    src="/images/product-800.jpg"
    srcset="
      /images/product-400.jpg   400w,
      /images/product-800.jpg   800w,
      /images/product-1200.jpg 1200w
    "
    sizes="(max-width: 768px) 100vw, 50vw"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
    alt="Product description"
  />
</picture>
```

---

# `loading="lazy"`

For images that aren't immediately visible:

```html
<img src="/images/photo.webp" loading="lazy" alt="..." />
```

This allows the browser to defer loading images until they're near the viewport.

### Don't blindly lazy-load everything

For above-the-fold / LCP images, lazy loading can hurt performance.

For example, your hero image generally should **not** be lazy-loaded.

```html
<img src="/images/hero.avif" width="1600" height="900" alt="..." />
```

---

# Always Specify Image Dimensions

Prefer:

```html
<img src="/image.webp" width="800" height="600" alt="..." />
```

This helps the browser reserve layout space and reduces **Cumulative Layout Shift (CLS)**.

CSS can still make the image responsive:

```css
img {
  max-width: 100%;
  height: auto;
}
```

---

# Image Format vs Compression

The file extension isn't the whole story.

These are all different variables:

```text
Format
+
Dimensions
+
Quality
+
Compression settings
+
Color space
+
Metadata
```

For example:

```text
4000 × 3000 AVIF @ high quality
```

can still be unnecessarily large.

A properly resized:

```text
1200 × 900 AVIF @ appropriate quality
```

may be much more efficient.

---

# Recommended Production Strategy

For a modern frontend application, a practical strategy is:

```text
                    Original image
                          │
                          ▼
                   Image processing
                          │
              ┌───────────┴───────────┐
              │                       │
             AVIF                    WebP
              │                       │
              └───────────┬───────────┘
                          │
                     JPEG fallback
```

Generate multiple sizes:

```text
400px
800px
1200px
1600px
2000px
```

depending on your application.

Then let the browser select the appropriate resource with `srcset` and `sizes`.

---

# My Default Recommendations

## New web application

| Asset                     | Recommended                                 |
| ------------------------- | ------------------------------------------- |
| Photos                    | **AVIF**                                    |
| General raster images     | **WebP / AVIF**                             |
| Icons                     | **SVG**                                     |
| Logos                     | **SVG**                                     |
| Illustrations             | **SVG**                                     |
| Screenshots               | **PNG / WebP / AVIF**                       |
| Transparent photos        | **AVIF / WebP**                             |
| Animation                 | **Video / WebP / AVIF**                     |
| Legacy compatibility      | **JPEG / PNG**                              |
| Source/master photography | **RAW/TIFF/etc.**                           |
| User uploads              | **Accept broadly → normalize for delivery** |

---

# If You Want One Simple Rule

For most modern frontend projects:

```text
                 ┌─────────────────┐
                 │  Is it a vector?│
                 └────────┬────────┘
                          │
                   ┌──────┴──────┐
                  YES            NO
                   │              │
                   ▼              ▼
                  SVG         Is it a photo?
                                 │
                          ┌──────┴──────┐
                         YES            NO
                          │              │
                          ▼              ▼
                        AVIF       WebP / AVIF
                                         │
                              Need lossless raster?
                                         │
                                        YES
                                         │
                                         ▼
                                        PNG
```

---

# Practical Frontend Cheat Sheet

```text
SVG
→ Icons
→ Logos
→ Vector illustrations
→ Diagrams

AVIF
→ Photos
→ Hero images
→ Large raster images
→ Performance-sensitive pages

WebP
→ General-purpose raster images
→ Thumbnails
→ Product images
→ Great default when AVIF isn't available

JPEG
→ Photos
→ Legacy compatibility
→ External systems requiring JPEG

PNG
→ Lossless images
→ Screenshots
→ Sharp UI graphics
→ Transparency where appropriate

GIF
→ Legacy animations
→ Existing content

APNG
→ Specialized lossless animations

HEIC
→ Device/source uploads
→ Convert before web delivery

TIFF
→ Source/master/print workflows
→ Don't serve directly to users

BMP
→ Avoid
```

---

# Final Recommendation

For a **2026-era frontend stack**, my default hierarchy would be:

### 1\. SVG for vectors

```text
Icons
Logos
Illustrations
Diagrams
```

### 2\. AVIF for modern raster delivery

```text
Photos
Hero images
Product images
Large images
```

### 3\. WebP as the practical general-purpose alternative

```text
Thumbnails
General images
Transparent raster assets
```

### 4\. PNG when lossless raster is actually required

```text
Screenshots
Pixel-perfect graphics
Specialized transparent assets
```

### 5\. JPEG as a compatibility/fallback format

```text
Legacy systems
Legacy browser requirements
External integrations
```

### 6\. Avoid GIF for new animation

Use:

```text
Video / WebP / AVIF / SVG
```

instead, depending on the content.

---

## The bigger performance rule

**Don't optimize only the image format. Optimize the entire image delivery pipeline.**

A good production pipeline looks like:

```text
Original
   │
   ▼
Resize
   │
   ▼
Compress
   │
   ├──────────────┐
   ▼              ▼
 AVIF            WebP
   │              │
   └──────┬───────┘
          ▼
     Responsive
       images
          │
          ▼
        CDN
          │
          ▼
       Browser
```

The biggest wins often come from **serving the right dimensions**, not merely changing `.jpg` to `.webp`.

---

## Quick Rule of Thumb

> **SVG for vectors. AVIF for modern photos. WebP for broad modern raster delivery. PNG for lossless raster. JPEG for compatibility. Avoid GIF for new work.**

This gives you a strong default without turning image optimization into an unnecessarily complicated decision tree.
