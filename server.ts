import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "5mb" }));

// Server-authoritative presentation state
let currentAuthoritativeState: any = null;

// Helper to get Gemini instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes

// 1. Fetch or Generate Full Bible Chapter text if needed
app.post("/api/bible/chapter", async (req, res) => {
  try {
    const { book, chapter, translation } = req.body;
    if (!book || !chapter) {
      return res.status(400).json({ error: "Book and chapter required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ verses: [] });
    }

    const prompt = `Provide the verses for ${book} chapter ${chapter} in ${translation || "World English Bible"}. Return a JSON object with a "verses" array where each element is an object with "verse": number and "text": string. Ensure accurate verse numbers and text for ${book} ${chapter}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || '{"verses":[]}');
    return res.json(data);
  } catch (err: any) {
    console.error("Error in /api/bible/chapter:", err);
    return res.status(500).json({ error: "Failed to load chapter text" });
  }
});

// 3. AI Worship Song Finder & Chords Generator
app.post("/api/songs/suggest", async (req, res) => {
  try {
    const { theme, scriptureReference, genre } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        suggestions: [
          {
            title: "How Great Is Our God",
            artist: "Chris Tomlin",
            key: "G",
            category: "Worship",
            reason: "A classic declaration of God's majesty and power.",
          },
          {
            title: "What A Beautiful Name",
            artist: "Hillsong Worship",
            key: "D",
            category: "Praise",
            reason: "Focuses on the supreme authority and glory of Jesus Christ.",
          },
        ],
      });
    }

    const prompt = `You are an expert Christian Worship Leader and Songwriter.
    Suggest 3-4 worship songs matching this request:
    - Sermon Theme or Keyword: ${theme || "General Worship"}
    - Related Scripture: ${scriptureReference || "None"}
    - Preferred Style: ${genre || "Contemporary / Hymn"}

    Return a JSON object with key "suggestions" which is an array of items:
    Each item must have:
    - "title": string
    - "artist": string
    - "key": string (e.g. "G", "C", "D")
    - "tempo": string (e.g., "72 BPM", "Medium")
    - "category": string (e.g., "Worship", "Praise", "Hymn", "Acoustic")
    - "reason": string (short 1-sentence note why it fits this theme)
    - "sampleLyricsWithChords": string (A verse and chorus formatted with brackets like [G] Great is the [Em] Lord, etc.)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || '{"suggestions":[]}');
    return res.json(data);
  } catch (err: any) {
    console.error("Error in /api/songs/suggest:", err);
    return res.status(500).json({ error: "Failed to generate song recommendations" });
  }
});

async function startServer() {
  const server = http.createServer(app);

  // WebSocket server for ultra-low latency real-time presentation synchronization
  const wss = new WebSocketServer({ server, path: "/ws/presentation" });

  wss.on("connection", (ws: WebSocket) => {
    // Send immediate authoritative state if exists
    if (currentAuthoritativeState) {
      try {
        ws.send(
          JSON.stringify({
            type: "STATE_INIT",
            payload: currentAuthoritativeState,
          })
        );
      } catch (e) {
        console.error("Error sending initial WS state:", e);
      }
    }

    ws.on("message", (raw: string | Buffer) => {
      try {
        const message = JSON.parse(raw.toString());
        if (message.type === "STATE_UPDATE" && message.payload) {
          currentAuthoritativeState = message.payload;
          const broadcastData = JSON.stringify({
            type: "STATE_UPDATE",
            payload: message.payload,
          });

          // Broadcast real-time update to all connected screens/windows/tabs
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        } else if (message.type === "SCREEN_STATUS") {
          const broadcastData = JSON.stringify({
            type: "SCREEN_STATUS",
            status: message.status,
          });
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        } else if (message.type === "GET_STATE") {
          if (currentAuthoritativeState && ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "STATE_UPDATE",
                payload: currentAuthoritativeState,
              })
            );
          }
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    });

    ws.on("error", (err) => {
      console.warn("WebSocket client error:", err.message);
    });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`ALGA Christian App Server running on http://localhost:${PORT} with WebSockets enabled at /ws/presentation`);
  });
}

startServer();
