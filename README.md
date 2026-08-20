# ALGA — Worship Presentation, Bible & Chord Studio

A modern, high-performance Christian worship application crafted with **React 19**, **TypeScript**, **Tailwind CSS**, and **Express / WebSockets**. 

ALGA combines an interactive **Holy Bible Reader**, a **Praise & Worship Chord Library** with real-time transposition and ambient pads, and a **Live Presentation Projection Studio** with dual-screen WebSocket synchronization.

---

## ✨ Features

### 📖 Holy Bible Reader
- **Multi-Translation Support**: English (WEB, KJV, ASV, BBE, YLT, Darby, OEB) and Tamil (தமிழ்).
- **Navigation & Filtering**: Fast testament toggles (OT, NT, All) and real-time book/chapter search.
- **Copy & Share**: Quick verse selection and one-click copy to clipboard.

### 🎵 Praise & Worship Song Library
- **Chords with Transposition**: Dynamic transpose tool (+ / - semitones) adjusting chords in real-time.
- **Interactive Chord Visualizer**: Instant visual fingering reference for major, minor, and 7th chords.
- **Ambient Pad Synthesizer**: Continuous warm atmospheric drone pads across all 12 musical keys with custom waveform synthesis.
- **Song Management**: Add custom songs, manage favorites, and categorize praise vs. worship sets.
- **AI Song Suggestions**: Gemini-powered song finder to match sermon themes, scriptures, and styles.

### 🖥️ Live Presentation & Projection Studio
- **Dual-Screen Live Projection**: Independent second-screen projection window with real-time WebSockets synchronization (`/ws/presentation`).
- **Flexible Source Modes**:
  - **Default Mode**: Custom presentations with text, subtitles, custom backgrounds, and media imports.
  - **Bible Mode**: Instant Scripture projection with chapter and verse navigation.
  - **Songs Mode**: Line-by-line lyric projection with auto-advance and live status indicators.
- **Curated Visual Themes**: Cinematic, Minimal Dark, Gold Ember, Royal Velvet, and Sapphire Deep.
- **Custom Backgrounds**: Gradient presets, custom solid colors, and direct image/video media upload.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/alga-worship-presentation.git
cd alga-worship-presentation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Add your Gemini API Key (optional, for AI-assisted song suggestions and chapter insights):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Build & Deployment

### Full-Stack Production Build (Node.js / Cloud Server)
Builds the client bundle and compiles the Express + WebSocket server:
```bash
npm run build
npm start
```

### Static Client-Only Build (GitHub Pages / Vercel / Netlify)
If deploying only the static frontend:
```bash
npm run build:client
```
The output will be generated inside the `dist/` directory.

### Deploying to GitHub Pages
1. Push your repository to GitHub.
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Run the **Deploy Client to GitHub Pages** workflow under the **Actions** tab.

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       ├── ci.yml            # Automated CI lint & build verification
│       └── deploy-pages.yml  # Automated GitHub Pages static deployment
├── src/
│   ├── components/
│   │   ├── Bible/            # Scripture reading & book navigation
│   │   ├── Presentation/     # Live presentation projector & themes
│   │   ├── Songs/            # Chord sheets, transposer, and pad player
│   │   └── Navbar.tsx        # Top navigation header
│   ├── data/                 # Bible books data & song databases
│   ├── utils/                # WebSockets sync, audio synth, and storage
│   ├── types.ts              # TypeScript data interfaces
│   ├── App.tsx               # Root application component
│   └── main.tsx              # React DOM entrypoint
├── server.ts                 # Express & WebSockets backend server
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Project dependencies and scripts
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
