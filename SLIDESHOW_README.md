# Backpacker in Australia – slideshow movie

Short movie (5 images + music) built with Python (MoviePy) or ffmpeg.

## Option A – Python (recommended)

```bash
python3 -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements-slideshow.txt
python slideshow.py
```

Output: `backpacker_australia_slideshow.mp4` (music is downloaded into `music_cache/` on first run).

## Option B – ffmpeg only

Requires [ffmpeg](https://ffmpeg.org/) and the 5 images in `assets/`:

```bash
./make_slideshow_movie.sh
```

## Assets

Place these 5 images in `assets/` (or generate them with an image model):

- `1-flying-to-australia.png`
- `2-hostel-party.png`
- `3-checking-bank-balance.png`
- `4-applying-for-jobs.png`
- `5-flying-home.png`

Music: **Hourglass** by Savfk (CC BY 4.0) – https://www.free-stock-music.com/savfk-hourglass.html
