import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Dashboard
  app.get(api.dashboard.stats.path, async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Episodes
  app.get(api.episodes.list.path, async (req, res) => {
    const episodes = await storage.getEpisodes();
    res.json(episodes);
  });

  app.get(api.episodes.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const episode = await storage.getEpisode(id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });
    
    const tasks = await storage.getTasksByEpisode(id);
    const assets = await storage.getAssets(id);
    
    res.json({ ...episode, tasks, assets });
  });

  app.post(api.episodes.create.path, async (req, res) => {
    const input = api.episodes.create.input.parse(req.body);
    const episode = await storage.createEpisode(input);
    res.status(201).json(episode);
  });

  app.put(api.episodes.update.path, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.episodes.update.input.parse(req.body);
    const episode = await storage.updateEpisode(id, input);
    res.json(episode);
  });

  // Team
  app.get(api.team.list.path, async (req, res) => {
    const members = await storage.getTeamMembers();
    res.json(members);
  });

  app.get("/api/broadcasts", async (_req, res) => {
    const broadcasts = await storage.getDailyBroadcasts();
    res.json(broadcasts);
  });

  app.get("/api/broadcasts", async (_req, res) => {
    const broadcasts = await storage.getDailyBroadcasts();
    res.json(broadcasts);
  });

  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage = "ar" } = req.body;
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [{ role: "user", content: `Translate the following text to ${targetLanguage}: ${text}` }]
        })
      });
      const data = await response.json();
      res.json({ translation: data?.choices?.[0]?.message?.content || "Translation unavailable" });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  app.post("/api/team", async (req, res) => {
    const input = api.team.create.input.parse(req.body);
    const member = await storage.createTeamMember(input);
    res.status(201).json(member);
  });

  // Tasks
  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post(api.tasks.create.path, async (req, res) => {
    const input = api.tasks.create.input.parse(req.body);
    const task = await storage.createTask(input);
    res.status(201).json(task);
  });

  app.put(api.tasks.update.path, async (req, res) => {
    const id = Number(req.params.id);
    const input = api.tasks.update.input.parse(req.body);
    const task = await storage.updateTask(id, input);
    res.json(task);
  });

  // Assets
  app.post(api.assets.create.path, async (req, res) => {
    const input = api.assets.create.input.parse(req.body);
    const asset = await storage.createAsset(input);
    res.status(201).json(asset);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const episodes = await storage.getEpisodes();
  // Check if episodes have audio URLs, if not, we need to update them
  const needsUpdate = episodes.length > 0 && !episodes[0].audioUrl;
  
  if (episodes.length > 0 && !needsUpdate) return;

  console.log("Seeding/Updating database...");

  // 1. Create/Update Team
  const teamData = [
    { name: "Claude", role: "Strategic planning, architecture", category: "Content Architecture" },
    { name: "Mistral", role: "Master workflow architect", category: "Content Architecture" },
    { name: "Perplexity", role: "Blueprint development", category: "Content Architecture" },
    { name: "Qwen", role: "SFX generation", category: "Audio Production" },
    { name: "DeepSeek", role: "Ambience creation", category: "Audio Production" },
    { name: "Carl", role: "Technical compilation", category: "Audio Production" },
    { name: "Mohamed (3M)", role: "Executive producer", category: "QA & Oversight", isAi: false },
    { name: "Gemini", role: "Implementation", category: "Development" },
    { name: "ChatGPT", role: "Technical debugging", category: "Development" },
    { name: "Character.AI Radio", role: "Broadcasting vision", category: "Creative" },
  ];

  let team;
  const existingTeam = await storage.getTeam();
  if (existingTeam.length === 0) {
    team = await Promise.all(
      teamData.map(m => storage.createTeamMember(m))
    );
  } else {
    team = existingTeam;
  }

  const mistral = team.find(m => m.name === "Mistral");
  const perplexity = team.find(m => m.name === "Perplexity");
  const qwen = team.find(m => m.name === "Qwen");

  // 2. Create Episodes with audio URLs
  const episodeData = [
    {
      title: "Fire in the Void – The Universe Begins",
      theme: "Cosmic origins, mystery, revelation",
      sfxRequirements: "Radio static, synth pulses, cosmic atmosphere",
      ambienceGoals: "Ethereal choral shimmer for 'first light' moments",
      emotionalArc: "Awe → Mystery → Revelation",
      audioUrl: "https://www.dropbox.com/scl/fo/x9n5wapvsasfla3gqzgyk/AGJwwEM3qHYg3cFoe1Zx-nU/1-FIRE%20IN%20THE%20VOIDg.mp3?rlkey=sn547q5feentc2v0qu5qvf0ve&dl=1",
      duration: 1127
    },
    {
      title: "Furnaces of Creation – Stars & Elements",
      theme: "Creative force, transformation, power",
      sfxRequirements: "Star ignition, metallic synthesis, supernova effects",
      ambienceGoals: "Egyptian sistrum texture, desert wind, ancient astronomy",
      emotionalArc: "Power → Transformation → Wonder",
      audioUrl: "https://www.dropbox.com/scl/fo/x9n5wapvsasfla3gqzgyk/ABr9PZQUQ6PxXg2fK6RP_L8/episode%202gm.mp3?rlkey=sn547q5feentc2v0qu5qvf0ve&dl=1",
      duration: 1223
    },
    {
      title: "From Chemistry to Biology – Origin of Life",
      theme: "Emergence, fragility, scientific curiosity",
      sfxRequirements: "Water droplets, lab sounds, crystalline RNA sequences",
      ambienceGoals: "Hydrothermal vents, gentle water motifs",
      emotionalArc: "Curiosity → Discovery → Understanding",
      audioUrl: "https://www.dropbox.com/scl/fo/x9n5wapvsasfla3gqzgyk/AHm-boHQJrZTWtTtpmLe7Ss/episode%203goo.mp3?rlkey=sn547q5feentc2v0qu5qvf0ve&dl=1",
      duration: 1064
    },
    {
      title: "Life's First Family – LUCA & Oxidation Event",
      theme: "Connection, resilience, shared heritage",
      sfxRequirements: "Microbial whispers, DNA sequences, ancient wind",
      ambienceGoals: "Egyptian wind flute, water over stones",
      emotionalArc: "Connection → Resilience → Hope",
      audioUrl: "https://www.dropbox.com/scl/fo/x9n5wapvsasfla3gqzgyk/ABxx34FTVQYYwpyRkf6VMhk/Episode%204.mp3?rlkey=sn547q5feentc2v0qu5qvf0ve&dl=1",
      duration: 827
    }
  ];

  if (episodes.length === 0) {
    for (const ep of episodeData) {
      const newEp = await storage.createEpisode(ep);

      // 3. Create Tasks for Episode 1
      if (ep.title.includes("Fire in the Void")) {
        await storage.createTask({
          title: "Content Framework Blueprint",
          description: "Develop comprehensive content framework",
          assignedToId: perplexity?.id,
          episodeId: newEp.id,
          status: "completed",
          priority: "high"
        });
        await storage.createTask({
          title: "Production Instructions Workflow",
          description: "Develop detailed production instructions",
          assignedToId: mistral?.id,
          episodeId: newEp.id,
          status: "in_progress",
          priority: "high"
        });
        await storage.createTask({
          title: "Generate SFX Assets",
          description: "Create radio static and synth pulses",
          assignedToId: qwen?.id,
          episodeId: newEp.id,
          status: "pending",
          priority: "medium"
        });
      }
    }
  } else if (needsUpdate) {
    // Update existing episodes with audio URLs
    for (let i = 0; i < episodes.length; i++) {
      const ep = episodes[i];
      const data = episodeData.find(d => d.title.includes(ep.title.split(' – ')[0]));
      if (data) {
        await storage.updateEpisode(ep.id, {
          audioUrl: data.audioUrl,
          duration: data.duration
        });
      }
    }
  }

  console.log("Seeding/Update complete!");
}
