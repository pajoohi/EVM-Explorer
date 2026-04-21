# Software Icons Assets

This directory contains brand logos for software distributions and tools displayed in the EVM Explorer.

## Icon Specifications

To maintain a premium and consistent UI, please follow these guidelines when adding new icons:

- **Resolution**: 
  - Recommended: **128 x 128 px**
  - Minimum: **64 x 64 px**
- **File Format**: 
  - **PNG** (with transparency)
  - **WEBP** (modern, small file size)
  - **SVG** (vector, best for scalability)
- **Background**: 
  - Icons **MUST** have a transparent background. 
  - Avoid icons with baked-in white square backgrounds.
- **Naming Convention**: 
  - Use `[Brand]_logo.[ext]` (e.g., `Android_logo.png`, `Yocto_logo.webp`).
  - Match names used in `AvailableSoftware.jsx` detection logic.
  - Supported Debian codenames: `bookworm`, `bullseye`, `sid`, `trixie`, `forky`.
  - Supported Ubuntu codenames: `noble`, `jammy`, `focal`.

## Current Missing Icons

The following icons are suggested for a complete professional experience:
- `TI_logo.png`
- `Yocto_logo.png`
- `Android_logo.png`
- `BeagleBoard_logo.png`
- `FreeRTOS_logo.png`
