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

### � Customization & Layout
- **Flexible Card Sizes:** Choose from presets like **Square** (1:1), **Portrait** (Story 9:16), **Landscape** (16:9), or set **Custom Dimensions**.
- **Spotify Branding:** Toggle an authentic Spotify logo in the corner for that official look.
- **Edit Mode:** 
  - **Drag & Drop:** Move the Album Art, Text, Lyrics, and Logo anywhere on the card.
  - **Resize:** Adjust the width of the lyrics or resize the album art freely.
- **Reset Layout:** Quickly restore the default positions with a single click.

### �🌓 Dark Mode Support
- **UI Theme Toggle:** A minimal toggle button (🌙/☀️) to switch between Light and Dark modes.
- **Persistent:** Remembers your preference using local storage.
- **Non-Intrusive:** Changes the interface theme *without* altering your custom card colors.

### 🖼️ Enhanced Export
- Fixed cross-origin (CORS) issues when saving images, ensuring the fetched Spotify album art is correctly included in the downloaded PNG.

![LyricsCardPage](https://github.com/user-attachments/assets/c232baa5-ed8d-4fe3-869a-4c4366a02f02)
