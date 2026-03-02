"""
Backpacker in Australia – short movie with 5-image slideshow and music.
Downloads a royalty-free track and exports an MP4.
"""

import urllib.request
from pathlib import Path

from moviepy.editor import (
    AudioFileClip,
    ImageSequenceClip,
    concatenate_videoclips,
)

# Paths
ASSETS = Path(__file__).resolve().parent / "assets"
OUTPUT = Path(__file__).resolve().parent / "backpacker_australia_slideshow.mp4"
MUSIC_CACHE = Path(__file__).resolve().parent / "music_cache"
# Captivating, cinematic travel vibe – CC BY 4.0 (attribution in README)
MUSIC_URL = "https://www.free-stock-music.com/music/savfk/mp3/savfk-hourglass.mp3"
MUSIC_FILE = MUSIC_CACHE / "savfk-hourglass.mp3"

# Image order and duration per slide (seconds)
IMAGE_NAMES = [
    "1-flying-to-australia.png",
    "2-hostel-party.png",
    "3-checking-bank-balance.png",
    "4-applying-for-jobs.png",
    "5-flying-home.png",
]
DURATION_PER_IMAGE = 5  # seconds each


def ensure_music():
    """Download royalty-free music if not already cached."""
    MUSIC_CACHE.mkdir(exist_ok=True)
    if MUSIC_FILE.exists():
        return str(MUSIC_FILE)
    print("Downloading music...")
    urllib.request.urlretrieve(MUSIC_URL, MUSIC_FILE)
    return str(MUSIC_FILE)


def main():
    image_paths = [str(ASSETS / name) for name in IMAGE_NAMES]
    for p in image_paths:
        if not Path(p).exists():
            raise FileNotFoundError(f"Image not found: {p}")

    # Build video from images
    clips = []
    for path in image_paths:
        clip = ImageSequenceClip([path], durations=[DURATION_PER_IMAGE])
        clips.append(clip)

    video = concatenate_videoclips(clips, method="compose")
    duration = video.duration

    # Add music: load, trim to video length, fade out at end
    music_path = ensure_music()
    audio = AudioFileClip(music_path)
    if audio.duration > duration:
        audio = audio.subclip(0, duration)
    else:
        # Loop if track is shorter than video
        from moviepy.audio.AudioClip import concatenate_audioclips
        n_loops = int(duration / audio.duration) + 1
        audio = concatenate_audioclips([audio] * n_loops).subclip(0, duration)
    # Gentle fade out over last 2 seconds
    audio = audio.audio_fadeout(2.0)
    video = video.set_audio(audio)

    video.write_videofile(
        str(OUTPUT),
        fps=24,
        codec="libx264",
        audio_codec="aac",
        verbose=False,
        logger=None,
    )
    video.close()
    audio.close()
    print(f"Movie saved to: {OUTPUT}")
    print("Music: Hourglass by Savfk (CC BY 4.0) – https://www.free-stock-music.com/savfk-hourglass.html")


if __name__ == "__main__":
    main()
