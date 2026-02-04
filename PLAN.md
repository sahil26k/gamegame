# 🌸 Game Plan – Valentine Mini RPG

## Working Title
**Where the Flowers Bloom**

---

## 🎮 Game Overview

A short, top-down 2D browser RPG where the player follows a recurring dream, helps villagers, repairs a broken bridge, gathers flowers, and finally meets the girl from the dream.

**Genre:** Narrative / Exploration  
**Tone:** Cozy, emotional, romantic  
**Estimated Playtime:** 10–15 minutes  
**Platform:** Browser (Phaser)

---

## 🧍 Player

- Quiet protagonist
- Lives alone in a small village
- Haunted by a recurring dream of a girl near flowers
- No combat, movement + interaction only

---

## 🌙 Core Theme

- Destiny
- Kindness unlocks paths
- Love is found, not rushed
- Dreams guide action

---

## 🗺️ World Structure

Single large map divided into logical zones:

- Player House (start)
- Village center (NPCs)
- Broken bridge area
- Forest / bushes (cat quest)
- River crossing
- Flower fields (north)
- Final meeting area (girl)

---

## 📖 Story Flow (Acts)

### ACT 0 – The Dream (Introduction)

**Location:** Player house + nearby village

- Player wakes up
- Can talk to random NPCs about dreams
- NPCs hint that dreams might have meaning
- No quests yet (atmosphere only)
Example NPC lines (short, optional):

NPC 1:

“You look tired. Bad dreams again?”

NPC 2:

“Dreams don’t mean anything… or maybe they do.”

NPC 3:

“If you keep seeing her… maybe she’s waiting.”

---

### ACT 1 – Discovery

**Trigger:** Player discovers broken bridge

- Text:  
  “This bridge is broken… I’ve seen this place in my dream.”
- Unlocks next phase of the game
- Cat owner NPC becomes visible

---

### ACT 2 – The Injured Man & the Lost Cat

**NPC:** Injured villager near bridge

- NPC explains:
  - His leg is broken
  - His cat ran into the woods
- He points the player toward bushes

**Objective:**
- Find the cat
- Bring it back

**Reward:**
- Old key
- Riddle hinting at chest location

---

### ACT 3 – The Chest

**Location:** Near river / trees

- Chest requires key
- Contains:
  - Bridge repair tools
  - Note about rebuilding paths

---

### ACT 4 – Repairing the Bridge

**Gameplay:**
- Broken bridge layer hidden
- Fixed bridge layer shown
- Collision updated

**Effect:**
- Player can cross river
- Music / mood subtly changes

---

### ACT 5 – The Other Side

**NPC:** Villager across the bridge

- Player asks about the girl
- NPC confirms:
  - He’s seen someone like her
  - She’s always around flowers
- Suggests going north to gather flowers

---

### ACT 6 – Gathering Flowers

**Objective:**
- Pick 3 flowers from flower field
- Bouquet is created automatically

**Note:**
- Flowers are picked, not bought
- Emphasizes effort over currency

---

### ACT 7 – Final Meeting

**Location:** Flower area / meadow

- Player meets the girl from the dream
- Dialogue exchange
- Player gives bouquet

**Ending Text:**
> “I don’t know if destiny is real…  
> But I know I want to walk this path with you.”

**Final Prompt:**
> **Will you be my Valentine?**

---

## 🎯 Gameplay Mechanics

- Movement (WASD / Arrow keys)
- Interact (E / Space)
- Simple dialogue boxes
- Item collection
- Quest state tracking
- Layer visibility toggling

No combat.

---

## 🧠 Quest State Flags

```js
bridgeDiscovered
catOwnerVisible
catFound
hasKey
chestOpened
bridgeRepaired
flowersCollected (count)
bouquetReady
