# PHYTEC Handheld One

The **PHYTEC Handheld One** is a functional handheld gaming device developed in under six weeks as a proof-of-concept for PHYTEC's System-on-Module (SoM) design approach, and showcased at **Embedded World**. It demonstrates how pre-engineered hardware can accelerate the journey from a breadboard prototype to a custom, bootable system.

## Overview

This repository contains the design files and documentation used to build the Handheld One. The project highlights the advantages of using a SOM over a discrete chip-down design, allowing for rapid iteration and scalability.

## Key Features

* **Rapid prototyping:** Concept to custom carrier board in under six weeks.
* **Gaming-ready Linux stack:** RetroArch (GLES3) with libretro cores, Freedoom, Chocolate Doom, SuperTuxKart, and Neverball, all launched from a custom touchscreen UI.
* **Integrated peripherals:** Touchscreen, gamepad inputs (D-pad / face buttons) via the MSPM0 companion MCU.

## Hardware Architecture

The Handheld One is built around the PHYTEC SOM ecosystem. By utilizing a standardized footprint, the carrier board can accommodate different performance tiers without requiring a complete redesign.

Designed in **KiCad 9.0**, the Schematics (`.kicad_sch`) and PCB layout (`.kicad_pcb`) live in the hardware repo below.

## Software

The Handheld One runs a **Yocto** based Linux distribution (scarthgap). The `meta-handheld-one` layer pulls in the launcher, retro gaming stack, Wayland/Weston graphics, and the AM62Px 3D demo.

## Repositories

- **[`phytec-handheld-one`](https://github.com/phytec-labs/phytec-handheld-one)** — Hardware design (KiCad schematics and PCB layout)
- **[`meta-handheld-one`](https://github.com/phytec-labs/meta-handheld-one/tree/scarthgap)** — Yocto meta-layer that builds the full image (use the `manifests` branch for repo-based checkout)
- **[`phytec-handheld-launcher`](https://github.com/phytec-labs/phytec-handheld-launcher/tree/scarthgap)** — Touchscreen launcher that runs at boot and starts the gaming stack
- **[`phytec-handheld-mspm0-driver`](https://github.com/phytec-labs/phytec-handheld-mspm0-driver)** — Firmware/drivers for the MSPM0 companion MCU (flashed manually, outside Yocto)


## Getting Started

Clone whichever piece you need:

```bash
# Hardware (KiCad 9.0+)
git clone https://github.com/phytec-labs/phytec-handheld-one.git

# Yocto BSP layer (scarthgap)
git clone -b scarthgap https://github.com/phytec-labs/meta-handheld-one.git

# Launcher
git clone -b scarthgap https://github.com/phytec-labs/phytec-handheld-launcher.git

# MSPM0 firmware
git clone https://github.com/phytec-labs/phytec-handheld-mspm0-driver.git
```

For a full Yocto build, use the `manifests` branch of `meta-handheld-one` to fetch all required layers via `phyLinux init -x`.

