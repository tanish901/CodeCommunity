import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Catch-all for API routes that no longer exist
  app.use("/api/*", (req, res) => {
    res.status(404).json({ 
      message: "API endpoint not found. This application now uses client-side storage." 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
