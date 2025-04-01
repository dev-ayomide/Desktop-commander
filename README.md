# DesktopPilot

A powerful desktop automation tool that combines computer control with AI-powered text processing.

## Features

### Computer Control
- Type text anywhere on your screen
- Move mouse to specific coordinates
- Click at current mouse position
- Simple command interface

### Smart Clipboard
- Automatic clipboard history
- AI-powered text processing:
  - Summarize long texts
  - Translate to English
  - Enhance writing
- Persistent storage
- Quick copy back to clipboard

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start Screenpipe:
```bash
screenpipe serve
```

## Using AI Features

1. Get your Nebius API key:
   - Sign up at https://nebius.ai
   - Navigate to API Keys section
   - Create a new API key

2. In the app:
   - Click the settings icon in the Clipboard tab
   - Enter your Nebius API key
   - Start using the AI features!

## Commands

- `type [text]` - Types the specified text
- `move [x] [y]` - Moves mouse to coordinates
- `click` - Clicks at current position

## Requirements

- Node.js 18+
- Screenpipe installed and running
- Nebius API key for AI features

## License

MIT