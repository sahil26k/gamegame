#!/usr/bin/env python3
"""
Convert map.json with .tsx references to embedded PNG format
"""

import json
from PIL import Image
from pathlib import Path

# Tileset mapping: tsx name -> png filename
TILESET_MAPPING = {
  "decor.tsx": "decor.png",
  "grass.tsx": "grass.png",
  "bush.tsx": "bush.png",
  "bridge.tsx": "bridge.png",
  "broken-bridge.tsx": "broken-bridge.png",
  "fence.tsx": "fence.png",

  "soil.tsx": "soil.png",
  "tree1.tsx": "tree1.png",
  "tree3.tsx": "tree3.png",
  "flowers.tsx": "flowers.png",
  "nametag.tsx": "nametag.png",
  "treetrunk.tsx": "treetrunk.png",
  "weed.tsx": "weed.png",
  "flowergrass2.tsx": "flowergrass2.png",
  "flowergrass.tsx": "flowergrass.png",
  "ground-decor.tsx": "ground-decor.png",
  "stones.tsx": "stones.png",
  "nametagnishi.tsx": "nametagnishi.png"
};


def create_embedded_tileset(tsx_name, firstgid, tilesets_dir, tile_size=32):
    """Create embedded tileset from PNG"""
    
    png_name = TILESET_MAPPING.get(tsx_name)
    if not png_name:
        print(f"❌ Unknown tileset: {tsx_name}")
        return None
    
    png_path = tilesets_dir / png_name
    if not png_path.exists():
        print(f"❌ PNG not found: {png_path}")
        return None
    
    # Get image dimensions
    with Image.open(png_path) as img:
        width, height = img.size
    
    # Calculate properties
    columns = width // tile_size
    rows = height // tile_size
    tilecount = columns * rows
    
    tileset = {
        "firstgid": firstgid,
        "name": png_name.replace('.png', ''),
        "image": png_name,
        "imagewidth": width,
        "imageheight": height,
        "tilewidth": tile_size,
        "tileheight": tile_size,
        "tilecount": tilecount,
        "columns": columns,
        "margin": 0,
        "spacing": 0
    }
    
    print(f"  ✅ {tsx_name} -> {png_name}")
    print(f"     Size: {width}x{height}, Tiles: {tilecount}, GID: {firstgid}-{firstgid + tilecount - 1}")
    
    return tileset

# Load original map
print("📖 Loading original map.json...")
with open('map.json', 'r') as f:
    map_data = json.load(f)

print(f"   Map size: {map_data['width']}x{map_data['height']}")
print(f"   Layers: {len(map_data['layers'])}")

# Convert tilesets
print("\n🔄 Converting tilesets...")
tilesets_dir = Path('assets/tilesets')
new_tilesets = []

for tileset in map_data['tilesets']:
    if 'source' in tileset:
        tsx_name = tileset['source']
        firstgid = tileset['firstgid']
        
        embedded = create_embedded_tileset(tsx_name, firstgid, tilesets_dir)
        if embedded:
            new_tilesets.append(embedded)
    else:
        new_tilesets.append(tileset)

# Update map
map_data['tilesets'] = new_tilesets

# Save to assets/maps/
output_path = Path('assets/maps/map.json')
print(f"\n💾 Saving to {output_path}...")

# Use compact formatting (no extra spaces)
with open(output_path, 'w') as f:
    json.dump(map_data, f, indent=2, separators=(',', ': '))

print(f"\n✅ Conversion complete!")
print(f"\n📋 Final tilesets:")
for ts in new_tilesets:
    print(f"  - {ts['name']}: {ts['image']} (GID {ts['firstgid']}-{ts['firstgid'] + ts['tilecount'] - 1})")

print(f"\n🎉 Your map is ready! Open http://localhost:8000/game.html to test it!")
