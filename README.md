# DesktopCommander

A modern desktop automation tool combining computer control with smart clipboard management.
![image](https://github.com/user-attachments/assets/74e4d537-aa96-4541-bae5-f105b1c8252b)


## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - shadcn/ui (Built on Radix UI)
  - Lucide Icons
  - Sonner (Toast notifications)

### Computer Control
- **Screenpipe**: For mouse/keyboard control and system automation
- **API Integration**: REST API communication

### State Management
- React Hooks
- Local Storage for persistence

### Development Tools
- **Package Manager**: npm/pnpm
- **Development Server**: Next.js dev server
- **Build Tool**: Next.js build system

## Core Features

1. **Computer Control**
   - Mouse movement and clicks
   - Text input automation
   - Command-based interface

2. **Smart Clipboard**
   - Automatic clipboard monitoring
   - History management
   - Quick copy functionality
   - Google Translate integration

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
- Modern web browser
- Nebius API key for AI features

## License

MIT
