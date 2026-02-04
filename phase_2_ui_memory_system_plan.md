# Phase 2 UI & Memory System Plan

## Project Codename: **Memory Device**

A short (10–15 minute) narrative experience with a **retro Game Boy–inspired UI**, **Kuromi-style cute-dark aesthetics**, and an **in-game memory fragment system** instead of traditional save files.

---

## 1. Core Design Philosophy

### What This Is
- A single-sitting experience
- Emotion-first design
- UI is *part of the story*, not just a container

### What This Is NOT
- No traditional save/load system
- No mid-game resume
- No explicit checkpoints

> The player does not save progress.
> The device remembers moments.

---

## 2. Overall UX Flow

1. Boot Device
2. Main Menu
3. Begin Memory (gameplay)
4. Memory Fragments unlock during play
5. In-game Memory Viewer accessible anytime
6. End of game → Full Memory unlocked

---

## 3. Visual Style

### Aesthetic Direction
- Game Boy / Game Boy Color inspiration
- Pixel-perfect rendering (160×144 base, scaled)
- Kuromi / cute-dark / pastel goth UI language

### Color Palette (Conceptual)
- Deep charcoal / near-black background
- Soft lavender or muted off-white text
- Dusty pink & pale purple highlights
- Accent icons: hearts, skulls, bows (minimal, subtle)

### Visual Rules
- Rounded pixel UI boxes
- Low saturation
- No modern UI elements
- Cute UI contrasted with quiet, emotional content

---

## 4. Boot Screen

### Purpose
- Establish nostalgia
- Introduce the device fiction

### Behavior
- Fade in from black
- Text appears:
  "MEMORY DEVICE v1.0"
- Soft click / hum sound
- Transitions to main menu

---

## 5. Main Menu

### Menu Items
- Begin Memory
- View Fragments (locked initially)
- Settings

### Rules
- Keyboard-first navigation
- Pixel cursor (heart or skull icon)
- Locked items selectable but non-functional

### Copy Examples
- Locked message: "No memories recovered yet."

---

## 6. Gameplay Structure

### Session-Based Design
- Always starts from the beginning
- World resets every playthrough
- Emotional tone may subtly change on replays

---

## 7. Memory Fragments (Checkpoint System)

### Concept
Memory Fragments replace checkpoints.

They represent:
- Emotional beats
- Important locations
- Character moments

### Unlock Flow
- Player reaches a key moment
- Subtle screen pulse
- Toast notification appears:
  "♡ Memory Fragment Recovered ♡"

Fragments are immediately viewable.

---

## 8. In-Game Menu (Pause / Device Menu)

### Access
- Keyboard button (e.g. M / Start)

### Menu Items
- Continue Memory
- View Fragments (X / Total)
- Settings
- Exit Memory

---

## 9. Memory Viewer

### Layout
- Grid or list of fragment tiles
- Rounded squares
- Cute-dark UI framing

### Fragment States

**Locked**
- Blurred tile
- "???"
- Broken heart or muted skull icon

**Unlocked**
- Small image or vignette
- One line of text
- Optional ambient sound loop

Fragments feel incomplete until the end.

---

## 10. End of Game Payoff

### Final Moment
- Fade to black
- Device hum
- Text:
  "Memory fully reconstructed."

### Result
- All fragments unlock
- Gallery shows full images
- Text becomes complete
- Optional hidden fragment unlocks

---

## 11. Persistence (Lightweight)

### What Is Stored
- Which fragments were unlocked
- Whether the full memory was completed

### What Is NOT Stored
- Player position
- Scene progress
- Inventory

Persistence exists only to:
> Prove the player was here before.

---

## 12. Technical Direction

### Engine
- Phaser

### State Management
- Global fragment registry
- Optional localStorage for meta persistence

### Scenes
- BootScene
- MenuScene
- GameScene(s)
- FragmentViewerScene
- SettingsScene

---

## 13. Development Milestones

### Milestone 1: UI Foundation
- Boot screen
- Main menu
- Visual system locked

### Milestone 2: Memory System
- Fragment unlock logic
- Toast notifications
- In-game menu

### Milestone 3: Viewer & Payoff
- Memory Viewer UI
- End-of-game unlock logic
- Polish & sound pass

---

## 14. Guiding Principle (Final)

> Cute things can hurt more.
> Short memories can last longer.
> This device does not save games.
> It remembers feelings.

