# 🎮 Adventure Game: The Bridge & The Bouquet

A beautiful top-down adventure game built with **Phaser 3**. Explore a mysterious island, help villagers, and complete a romantic quest through a series of connected story acts.

---

## 🏗️ Technical Architecture

The game uses a modular, scalable architecture to separate logic, state, and UI.

### 📁 Project Structure
```
load map/
├── src/
│   ├── scenes/
│   │   └── GameScene.js          # Core game logic, entities, and flow
│   ├── systems/
│   │   ├── GameState.js          # Singleton state manager (Flags & Inventory)
│   │   ├── DialogueSystem.js     # HTML/CSS Typewriter dialogue system
│   │   ├── InteractionManager.js # Proximity-based interaction system
│   │   └── UIOverlay.js          # Dynamic Quest & Inventory HUD
│   ├── ui/
│   │   └── dialogue.css          # Styling for the dialogue box
│   └── main.js                   # Game configuration
├── assets/                       # Sprites, Tilesets, Maps, and Audio
├── game.html                     # Entry point
└── README.md                     # You are here
```

### ⚙️ Core Systems
*   **Dialogue System**: Premium HTML/CSS overlay with smooth animations, typing effects, and character-specific styling.
*   **State Management**: Centralized `GameState` tracks every player action via flags (e.g., `bridgeSeen`, `catFound`) and manages the player's inventory.
*   **UI Overlay**: A persistent HUD that displays the current **Active Objective** and emojis for collected **Inventory Items**.
*   **Interaction System**: Spatial detection allows players to interact with NPCs and map elements (like the bridge or flowers) by pressing **[E]**.

---

## 🗺️ Complete Game Flow

The game is structured into seven distinct acts:

### 📍 Phase 1: The Village Corner
*   **Starting Villager**: Greets you near the spawn point.
*   **Village Life**: Meet your neighbors (NPC 1 & NPC 2 and NPC3) who give hints about the island.
*   **The Mission**: Your quest hint directs you to explore the river to the East.

### 🌉 Phase 2: The Broken Bridge
*   Inspect the old bridge spanning the river. It's broken, and you recall it from a dream.
*   Inspecting the bridge triggers the appearance of an **Injured Man**.

### 🐱 Phase 3: The Injured Man's Favor
*   Find the man near the bridge. He's hurt and his cat ran into the nearby bushes.
*   Search the thickets to find the **Cat**. Return the cat to receive an **Old Key**.

### 🗝️ Phase 4: The Hidden Chest
*   With the key in hand, a hidden **Chest** becomes visible to the South.
*   Unlock the chest to find the **Repair Tools**.

### 🔨 Phase 5: Fixing the Path
*   Return to the bridge with your tools.
*   A "Repair" interaction triggers, physically fixing the bridge and allowing you to cross the water.

### 🌹 Phase 6: The Rose Bouquet
*   Cross to the other side and meet a new **Villager**.
*   He asks you to collect **3 Wild Roses** from the island.
*   **Flower Picking**: Interact with rose tiles on the map. Once you have three, they transform into a **Bouquet**.
*   **Visual Polish**: Your character's sprite changes to show you holding the flowers!

### ❤️ Phase 7: The Final Meeting
*   Once the bouquet is ready, a **Girl** appears in a quiet corner of the island.
*   Give her the flowers to complete the story!

---

## 👥 NPC Directory

| NPC | Location | Role |
| :--- | :--- | :--- |
| **Old Villager** | Start (100, 300) | Initial guide. |
| **Blue Villager** | Up-Right (200, 200) | Friendly neighbor. |
| **Orange Villager** | Down-Right (200, 400) | Town gossip. |
| **Injured Man** | Near Bridge | Gives Key quest. |
| **Island Villager** | Other Side | Gives Flower quest. |
| **The Girl** | Far East | Final objective. |

---

## 🎮 Controls

*   **Move**: `WASD` or `Arrow Keys`
*   **Interact**: `E`
*   **Advance Dialogue**: `E`

---

## 🚀 Getting Started

1.  Start a local server: `python -m http.server 8000`
2.  Open your browser to: `http://localhost:8000/game.html`
3.  Ensure you perform a **Hard Refresh** (`Ctrl+F5`) after updates to clear cached assets.
