# Fairy Candyland

A colorful 3D web game prototype built with Python + Flask + Three.js.

Features:
- Neon candyland environment
- 3D collectible ice cream cones
- Floating fairy companions
- WASD movement
- Simple score HUD and win condition

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open:

http://localhost:5000

## Project structure

- `app.py` — Flask app
- `templates/index.html` — page shell
- `static/css/styles.css` — styling
- `static/js/game.js` — 3D game logic

## Notes

This is a playable starter prototype inspired by a dreamy candy world with fluorescent colors and magical fairies. You can expand it with enemies, pickups, sound effects, jump mechanics, or a full quest system.
