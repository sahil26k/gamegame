# 📜 Dialogue Script – Pre-Final Arc
## (Internal Monologue + NPC Conversations)

---

## 🌙 GAME START – Internal Monologue

**Trigger:** Game load / player gains control

**Player (internal):**
> “That dream again…”  
> “The river. The flowers.”  
> “And her.”  

(short pause)

> “I don’t even know who she is.”  
> “But it felt… real.”

---

## 🏘️ PHASE 1 – Village Conversations

### 🧓 Old Villager (First Conversation)

**Old Villager:**  
> “You look like someone who didn’t sleep much.”

**Player:**  
> “Yeah… I keep having this strange dream.”

**Old Villager:**  
> “Dreams have a habit of returning when they’re unfinished.”  

**Player:**  
> “Unfinished how?”

**Old Villager:**  
> “That part… you usually find out yourself.”

---

### 🧓 Old Villager (Second Interaction)

**Player:**  
> “Do you think dreams actually mean something?”

**Old Villager:**  
> “Some don’t.”  
> “The ones that stay?”  

(beat)

> “Those usually do.”

---

### 👤 Blue Villager

**Blue Villager:**  
> “You seem distracted.”

**Player:**  
> “Ever feel like you’ve been somewhere before… without actually going there?”

**Blue Villager:**  
> “Hah. All the time.”  
> “The river’s like that for me.”  

**Player:**  
> “The river?”

**Blue Villager:**  
> “Yeah. Feels like it’s hiding something.”

---

### 👤 Orange Villager

**Orange Villager:**  
> “You pacing around again?”

**Player:**  
> “Just thinking.”

**Orange Villager:**  
> “Careful. That’s how people end up somewhere unexpected.”  

(smiles)

> “If you’re curious, go take a walk east.”

---

## 🌉 PHASE 2 – Broken Bridge Discovery

**Trigger:** Player inspects broken bridge

**Player (internal):**
> “This place…”  
> “I’ve seen this before.”

(beat)

> “It was in my dream.”

**Player (internal):**
> “I couldn’t cross it then either.”

➡ **State set:** `bridgeSeen = true`  
➡ **Injured Man becomes visible**

---

## 🐱 PHASE 3 – Injured Man & Cat Quest

### 🧔 Injured Man (First Conversation)

**Injured Man:**  
> “Hey—wait.”  

**Player:**  
> “Are you okay?”

**Injured Man:**  
> “Could be better.”  
> “Leg’s messed up pretty bad.”

**Player:**  
> “What happened?”

**Injured Man:**  
> “Tried crossing the bridge before it gave out.”  

(sighs)

> “My cat bolted when I fell.”  
> “Ran into the bushes.”

**Player:**  
> “I can help you find him.”

**Injured Man:**  
> “You’d do that?”  

(soft smile)

> “Thank you. He ran toward the trees to the south.”

---

### 🐱 Cat (Found in Bushes)

**Player:**  
> “Hey… it’s okay.”  

**Cat:**  
> “Meow…”

**Player:**  
> “Your owner’s worried about you.”

(cat follows)

---

### 🧔 Injured Man (Cat Returned)

**Injured Man:**  
> “You found him…”  

(kneels slightly)

> “I don’t know how to thank you.”

**Player:**  
> “I’m just glad he’s okay.”

**Injured Man:**  
> “Here.”  

(hands key)

> “I’ve been holding onto this for years.”  
> “Never figured out what it was for.”

**Player:**  
> “What about this note?”

**Injured Man:**  
> “A riddle.”  
> “Maybe you’ll have better luck than I did.”

---

## 🗝️ PHASE 4 – Chest & Tools

### 📦 Chest (Locked)

**Player:**  
> “It’s locked.”

---

### 📦 Chest (With Key)

**Player:**  
> “Let’s see if this works…”

(chest opens)

**Player (internal):**
> “Tools…”  
> “Someone tried to fix the bridge.”

(beat)

> “Maybe it’s my turn.”

➡ **State:** `hasTools = true`

---

## 🔨 PHASE 5 – Repairing the Bridge

### 🌉 Bridge (With Tools)

**Player:**  
> “This should hold.”

(repair animation)

**Player (internal):**
> “Funny…”  
> “Some things only break so you can rebuild them.”

➡ **State:** `bridgeFixed = true`

---

## 🌹 PHASE 6 – Other Side NPC & Flower Quest

### 👤 Island Villager (First Conversation)

## Island Villager:
“I didn’t expect to see anyone cross that bridge.”

## Player:
“I almost didn’t.”

## Island Villager:
“You look like you’re searching for something.”

## Player:
“Someone, actually.”
(from a dream.)

## Island Villager:
“…Dreams bring people here for different reasons.”

(short pause)

## Island Villager:
“There is someone who wanders this side of the island.”
“Quiet type.”

## Player:
“…Someone?”

## Island Villager:
“I’ve seen her near the flowers.”
“Always there. Like she belongs to them.”

## Player:
“So you think…”

## Island Villager:
“If dreams led you here?”
“Flowers wouldn’t be a bad place to start.”
“Try the north.”


➡ **Quest Start:** Collect 3 flowers

---

## 🌸 Flower Pickup Dialogue

### 🌸 First Flower
**Player:**  
> “These look familiar.”

### 🌸 Second Flower
**Player:**  
> “Just like in my dream…”

### 🌸 Third Flower
**Player (internal):**
> “I think this is enough.”

---

## 💐 Bouquet Creation

**Player (internal):**
> “I carefully tie them together.”  
> “It feels… important.”

➡ **State:** `bouquetReady = true`  
➡ Player sprite updates (holding bouquet)

---

## 🔚 END OF PRE-FINAL SCRIPT
(The girl interaction begins after this point)
