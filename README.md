# Lyric Cards Generator

A website for creating Lyric Cards, inspired by Spotify Lyric Cards!

**Live Demo:** [https://abdur-rafay-ar.github.io/lyrics-card-generator/](https://abdur-rafay-ar.github.io/lyrics-card-generator/)

*(Forked from [asiiapiazza/Lyrics-Card-Generator](https://github.com/asiiapiazza/Lyrics-Card-Generator))*

## New Features Added

This version includes several enhancements over the original project:

### 🎵 Auto-Fetch from Spotify
- **Paste & Go:**  Simply paste a Spotify Track URL (e.g., `https://open.spotify.com/track/...`) and click "Fetch".
- **Smart Data Extraction:** Automatically retrieves:
  - **Album Art:** High-quality cover image.
  - **Song Title:** Accurate track name.
  - **Artist Name:** Fetched directly from Spotify metadata.
  - **Card Color:** Automatically extracts the **dominant color** from the album art and sets it as the card background.
- **Robustness:** Uses `corsproxy.io` and parses Spotify's embed page JSON to reliably get data without hitting API limits or CORS errors.

### 🌓 Dark Mode Support
- **UI Theme Toggle:** A minimal toggle button (🌙/☀️) to switch between Light and Dark modes.
- **Persistent:** Remembers your preference using local storage.
- **Non-Intrusive:** Changes the interface theme *without* altering your custom card colors.

### 🖼️ Enhanced Export
- Fixed cross-origin (CORS) issues when saving images, ensuring the fetched Spotify album art is correctly included in the downloaded PNG.

![LyricsCardPage](https://github.com/user-attachments/assets/abc01e3d-847d-4773-abb5-5163409c9ee8)

