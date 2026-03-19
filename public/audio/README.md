# Gallery music (optional)

Place **two** MP3 files here for the soundtrack after family login:

- `family-1.mp3` — first track  
- `family-2.mp3` — second track  

They play on **`/gallery`** and album pages, in order, then loop.

**Custom paths or URLs:** set in `.env.local`:

```bash
# Comma-separated paths (under `public/`) or full HTTPS URLs to MP3s
NEXT_PUBLIC_GALLERY_AUDIO_TRACKS=/audio/my-song-a.mp3,/audio/my-song-b.mp3
```

Use only audio you have the rights to use.
