// =========================================================================
// VISION BOARD & INSPIRATION REPOSITORIES FOR PROJECT RELICS
// Contains all inspirations, reference artifacts, and sparks that made
// creators curious about each project in the first place.
// =========================================================================

export const PROJECT_VISION_DATA = {
  "relic-1": {
    id: "relic-1",
    title: "ShadowCast — Ephemeral Audio Rooms",
    sparkSubtitle: "The Ephemeral Audio Experiment",
    curiosityOrigin:
      "What if voice conversations disappeared forever at sunrise, like morning mist over an ancient cemetery? No recordings, no surveillance logs, just pure presence and fleeting human resonance.",
    moodboardAtmosphere: "Dark OLED, luminescent emerald waveforms, glowing vacuum tubes, and analog radio hiss.",
    inspirations: [
      {
        id: "insp-1-1",
        title: "Cold-War Number Stations & Shortwave Radio",
        category: "resource",
        type: "Historical Artifact",
        note: "Mysterious shortwave radio broadcasts in the dead of night. The crackle of static and rhythmic chimes sparked the desire for secret, intimate audio frequencies.",
        tags: ["Analog", "Shortwave", "Static Audio"],
        badgeColor: "text-emerald-400 border-emerald-500/50 bg-emerald-950/40",
      },
      {
        id: "insp-1-2",
        title: "Binaural Campfire Acoustics",
        category: "resource",
        type: "Acoustic Reference",
        note: "Studies on how humans open up emotionally around dying embers. Audio rooms shouldn't look like sterile grids; they should feel like gathering in darkness around a single ember.",
        tags: ["Spatial Audio", "Binaural", "Intimacy"],
        badgeColor: "text-amber-400 border-amber-500/50 bg-amber-950/40",
      },
      {
        id: "insp-1-3",
        title: "WebRTC Mesh Signaling Protocols",
        category: "tool",
        type: "Technical Engine",
        note: "Peer-to-peer data channels transmitting raw opus chunks directly between peers with end-to-end encryption, bypassing central eavesdropping servers.",
        tags: ["WebRTC", "E2EE", "P2P"],
        badgeColor: "text-sky-400 border-sky-500/50 bg-sky-950/40",
      },
      {
        id: "insp-1-4",
        title: "Luminescent Oscilloscope UI Kit",
        category: "asset",
        type: "Visual Component",
        note: "CRT phosphor persistence visualizers that draw audio frequency sine waves that slowly glow and decay on an HTML5 canvas.",
        tags: ["Canvas GL", "Phosphor Green", "Oscilloscope"],
        badgeColor: "text-emerald-300 border-emerald-400/50 bg-emerald-950/50",
      },
    ],
    resources: {
      title: "Archive Resources Portal",
      description: "Manuscripts, audio topologies, and spectral palettes ready to be cataloged into the Curiosity Cabinet.",
      itemCount: 4,
      preview: "WebRTC P2P Architecture · CRT Phosphor Shaders · Analog Audio Filter Presets",
    },
  },

  "relic-2": {
    id: "relic-2",
    title: "PhantomGrid — 2D Dungeon Engine",
    sparkSubtitle: "Procedural Retro Labyrinth",
    curiosityOrigin:
      "Can an engine generate infinite gothic catacombs that feel hand-crafted by an architect rather than an indifferent random number generator?",
    moodboardAtmosphere: "16-bit obsidian stone, flickering violet torches, isometric grid lines, and forgotten glyphs.",
    inspirations: [
      {
        id: "insp-2-1",
        title: "Catacombs of Paris Map Folio",
        category: "resource",
        type: "Historical Blueprint",
        note: "18th-century subterranean cartography featuring chiseled ossuary chambers and narrow limestone winding arteries.",
        tags: ["Cartography", "Ossuary", "Labyrinth"],
        badgeColor: "text-purple-400 border-purple-500/50 bg-purple-950/40",
      },
      {
        id: "insp-2-2",
        title: "Cellular Automata Cave Generation",
        category: "tool",
        type: "Algorithmic Engine",
        note: "Simulating geological erosion with 4-5 rule cellular automata passes to create natural organic subterranean grottos.",
        tags: ["Algorithms", "Procedural", "Math"],
        badgeColor: "text-sky-400 border-sky-500/50 bg-sky-950/40",
      },
      {
        id: "insp-2-3",
        title: "16-Bit Gothic Tilemap Spritesheet",
        category: "asset",
        type: "Visual Component",
        note: "Hand-pixeled masonry wall tiles with moss accents, cracked tombstones, and ambient torchlight normal maps.",
        tags: ["Pixel Art", "Tilemap", "Sprites"],
        badgeColor: "text-amber-400 border-amber-500/50 bg-amber-950/40",
      },
      {
        id: "insp-2-4",
        title: "Dynamic 2D Raycast Shadow Cast",
        category: "tool",
        type: "Shader Tool",
        note: "A 2D fragment shader that casts soft atmospheric penumbra shadows from torch points across isometric tile edges.",
        tags: ["GLSL", "Raycast", "Shadows"],
        badgeColor: "text-indigo-400 border-indigo-500/50 bg-indigo-950/40",
      },
    ],
    resources: {
      title: "Archive Resources Portal",
      description: "Tilemap engines, pathfinding matrices, and subterranean sprites for your library.",
      itemCount: 4,
      preview: "Gothic Masonry Sprites · A* Pathfinding Module · 2D Raycasting Shaders",
    },
  },

  "relic-3": {
    id: "relic-3",
    title: "MoonlightJournal — Dream Cartography",
    sparkSubtitle: "Subconscious Dream Mapping",
    curiosityOrigin:
      "Why do vivid dreams evaporate within 90 seconds of waking? What if we could murmur half-asleep into the dark, and an intelligent scribe mapped our dreams into a constellation sky?",
    moodboardAtmosphere: "Midnight navy, celestial star maps, silver crescent moonlight, and ambient binaural chimes.",
    inspirations: [
      {
        id: "insp-3-1",
        title: "Uranometria 1603 Celestial Charts",
        category: "resource",
        type: "Celestial Reference",
        note: "Johann Bayer's copperplate celestial atlas illustrating mythological constellations floating against velvet midnight skies.",
        tags: ["Celestial", "Astronomy", "Star Maps"],
        badgeColor: "text-sky-300 border-sky-400/50 bg-sky-950/40",
      },
      {
        id: "insp-3-2",
        title: "Local Whisper Speech-to-Text Pipeline",
        category: "tool",
        type: "AI Speech Engine",
        note: "On-device quantized whisper model that runs completely offline in WebAssembly, transcribing groggy morning murmurs privately.",
        tags: ["Wasm", "Speech-to-Text", "Whisper"],
        badgeColor: "text-emerald-400 border-emerald-500/50 bg-emerald-950/40",
      },
      {
        id: "insp-3-3",
        title: "Hypnagogic Vector Constellation Nodes",
        category: "asset",
        type: "UI Component",
        note: "Interactive D3 force-directed graph connecting dream themes (flying, oceans, lost keys) with glowing silver filaments.",
        tags: ["D3.js", "Constellations", "Graph UI"],
        badgeColor: "text-amber-300 border-amber-400/50 bg-amber-950/40",
      },
    ],
    resources: {
      title: "Archive Resources Portal",
      description: "Dream taxonomy models, celestial vector charts, and whisper transcription modules.",
      itemCount: 3,
      preview: "Uranometria SVG Constellations · Wasm Whisper Engine · Audio Frequency Visualizer",
    },
  },

  "relic-4": {
    id: "relic-4",
    title: "CryptKeeper — Dormant Repo Archiver",
    sparkSubtitle: "Memorials for Abandoned Code",
    curiosityOrigin:
      "Every developer has dozens of repos gathering digital dust. Why treat them as shameful clutter instead of honoring them with poetic epitaphs and preserving their valuable components?",
    moodboardAtmosphere: "Antique terminal green phosphor, chiseled headstones, git commit trees, and parchment seals.",
    inspirations: [
      {
        id: "insp-4-1",
        title: "Victorian Epitaph Rubbings",
        category: "resource",
        type: "Historical Artifact",
        note: "Charcoal paper rubbings of high Victorian cemetery headstones, celebrating craftsmen and their unfinished life tasks.",
        tags: ["Typography", "Victorian", "Epitaphs"],
        badgeColor: "text-stone-300 border-stone-400/50 bg-stone-900/60",
      },
      {
        id: "insp-4-2",
        title: "GitHub GraphQL API Schema",
        category: "tool",
        type: "Data Ingestion Engine",
        note: "Automated queries traversing commit timelines, contributor streaks, and date of last pulse to calculate dormancy indices.",
        tags: ["GraphQL", "GitHub API", "Automation"],
        badgeColor: "text-sky-400 border-sky-500/50 bg-sky-950/40",
      },
      {
        id: "insp-4-3",
        title: "Terminal ANSI Color Markdown Renderer",
        category: "asset",
        type: "CLI Component",
        note: "A lightweight terminal text parser outputting ornate border boxes, Snell script headers, and commit trees in ASCII.",
        tags: ["CLI", "ANSI Art", "Terminal UI"],
        badgeColor: "text-emerald-400 border-emerald-500/50 bg-emerald-950/40",
      },
    ],
    resources: {
      title: "Archive Resources Portal",
      description: "Dormancy analyzers, terminal box-drawing kits, and markdown memorial templates.",
      itemCount: 3,
      preview: "Terminal UI Toolkit · GraphQL Dormancy Client · Inscribed Epitaph Formatter",
    },
  },
};
