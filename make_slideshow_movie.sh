#!/usr/bin/env bash
# Backpacker in Australia – short movie from 5 images + music.
# Needs: ffmpeg, curl. Run from project root.

set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$DIR/assets"
OUTPUT="$DIR/backpacker_australia_slideshow.mp4"
CACHE="$DIR/music_cache"
MUSIC_URL="https://www.free-stock-music.com/music/savfk/mp3/savfk-hourglass.mp3"
MUSIC_FILE="$CACHE/savfk-hourglass.mp3"
DURATION=5

mkdir -p "$CACHE"
if [[ ! -f "$MUSIC_FILE" ]]; then
  echo "Downloading music..."
  curl -sL -o "$MUSIC_FILE" "$MUSIC_URL"
fi

echo "Creating movie..."
ffmpeg -y \
  -loop 1 -t $DURATION -i "$ASSETS/1-flying-to-australia.png" \
  -loop 1 -t $DURATION -i "$ASSETS/2-hostel-party.png" \
  -loop 1 -t $DURATION -i "$ASSETS/3-checking-bank-balance.png" \
  -loop 1 -t $DURATION -i "$ASSETS/4-applying-for-jobs.png" \
  -loop 1 -t $DURATION -i "$ASSETS/5-flying-home.png" \
  -i "$MUSIC_FILE" \
  -filter_complex "[0:v][1:v][2:v][3:v][4:v]concat=n=5:v=1:a=0[outv];[5:a]atrim=0:25,afade=t=out:st=23:d=2[outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -c:a aac -shortest -r 24 -pix_fmt yuv420p \
  "$OUTPUT"

echo "Movie saved to: $OUTPUT"
echo "Music: Hourglass by Savfk (CC BY 4.0)"
