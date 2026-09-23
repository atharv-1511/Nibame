import { NextRequest, NextResponse } from "next/server";

// ── Domain → category mapping (ported from backend/category_rules.json) ──
const DOMAIN_MAP: Record<string, { category: string; label: string; color: string }> = {
  // Video
  "youtube.com": { category: "video_streaming", label: "Video & Streaming", color: "#ff0000" },
  "youtu.be": { category: "video_streaming", label: "Video & Streaming", color: "#ff0000" },
  "vimeo.com": { category: "video_streaming", label: "Video & Streaming", color: "#1ab7ea" },
  "twitch.tv": { category: "video_streaming", label: "Video & Streaming", color: "#9146ff" },
  "netflix.com": { category: "video_streaming", label: "Video & Streaming", color: "#e50914" },
  "primevideo.com": { category: "video_streaming", label: "Video & Streaming", color: "#00a8e0" },
  "hotstar.com": { category: "video_streaming", label: "Video & Streaming", color: "#1f80e0" },

  // Social
  "instagram.com": { category: "social_media", label: "Social Media", color: "#e1306c" },
  "twitter.com": { category: "social_media", label: "Social Media", color: "#1da1f2" },
  "x.com": { category: "social_media", label: "Social Media", color: "#1da1f2" },
  "threads.net": { category: "social_media", label: "Social Media", color: "#000000" },
  "facebook.com": { category: "social_media", label: "Social Media", color: "#1877f2" },
  "reddit.com": { category: "social_media", label: "Social Media", color: "#ff4500" },
  "tiktok.com": { category: "social_media", label: "Social Media", color: "#010101" },
  "snapchat.com": { category: "social_media", label: "Social Media", color: "#fffc00" },
  "discord.com": { category: "social_media", label: "Social Media", color: "#5865f2" },
  "discord.gg": { category: "social_media", label: "Social Media", color: "#5865f2" },

  // Dev / Code
  "github.com": { category: "development_code", label: "Development & Code", color: "#24292e" },
  "gitlab.com": { category: "development_code", label: "Development & Code", color: "#fc6d26" },
  "stackoverflow.com": { category: "development_code", label: "Development & Code", color: "#f48024" },
  "dev.to": { category: "development_code", label: "Development & Code", color: "#3d3d3d" },
  "codeforces.com": { category: "development_code", label: "Development & Code", color: "#1f8dd6" },
  "leetcode.com": { category: "development_code", label: "Development & Code", color: "#ffa116" },
  "codepen.io": { category: "development_code", label: "Development & Code", color: "#000000" },
  "replit.com": { category: "development_code", label: "Development & Code", color: "#667881" },
  "vercel.com": { category: "development_code", label: "Development & Code", color: "#000000" },
  "netlify.com": { category: "development_code", label: "Development & Code", color: "#00c7b7" },
  "npm.io": { category: "development_code", label: "Development & Code", color: "#cb3837" },
  "npmjs.com": { category: "development_code", label: "Development & Code", color: "#cb3837" },
  "pypi.org": { category: "development_code", label: "Development & Code", color: "#3775a9" },
  "docker.com": { category: "development_code", label: "Development & Code", color: "#2496ed" },

  // Learning
  "coursera.org": { category: "learning_education", label: "Learning & Education", color: "#0056d2" },
  "udemy.com": { category: "learning_education", label: "Learning & Education", color: "#a435f0" },
  "edx.org": { category: "learning_education", label: "Learning & Education", color: "#02262b" },
  "khanacademy.org": { category: "learning_education", label: "Learning & Education", color: "#14bf96" },
  "freecodecamp.org": { category: "learning_education", label: "Learning & Education", color: "#0a0a23" },
  "pluralsight.com": { category: "learning_education", label: "Learning & Education", color: "#f15b2a" },
  "skillshare.com": { category: "learning_education", label: "Learning & Education", color: "#00b3a4" },
  "brilliant.org": { category: "learning_education", label: "Learning & Education", color: "#f0693a" },
  "medium.com": { category: "learning_education", label: "Learning & Education", color: "#00ab6c" },
  "hashnode.com": { category: "learning_education", label: "Learning & Education", color: "#2962ff" },
  "substack.com": { category: "learning_education", label: "Learning & Education", color: "#ff6719" },

  // Professional
  "linkedin.com": { category: "professional_network", label: "Professional Network", color: "#0a66c2" },
  "glassdoor.com": { category: "professional_network", label: "Professional Network", color: "#0caa41" },
  "angel.co": { category: "professional_network", label: "Professional Network", color: "#000000" },
  "wellfound.com": { category: "professional_network", label: "Professional Network", color: "#000000" },

  // Research / Docs
  "arxiv.org": { category: "research_papers", label: "Research & Papers", color: "#b31b1b" },
  "scholar.google.com": { category: "research_papers", label: "Research & Papers", color: "#4285f4" },
  "wikipedia.org": { category: "research_papers", label: "Research & Papers", color: "#000000" },
  "notion.so": { category: "cloud_documents", label: "Cloud Documents", color: "#000000" },
  "docs.google.com": { category: "cloud_documents", label: "Cloud Documents", color: "#4285f4" },
  "drive.google.com": { category: "cloud_documents", label: "Cloud Documents", color: "#4285f4" },
  "figma.com": { category: "design_tools", label: "Design & Tools", color: "#f24e1e" },

  // Music
  "spotify.com": { category: "music_audio", label: "Music & Audio", color: "#1db954" },
  "soundcloud.com": { category: "music_audio", label: "Music & Audio", color: "#ff5500" },
  "music.apple.com": { category: "music_audio", label: "Music & Audio", color: "#fc3c44" },
  "podcasts.apple.com": { category: "music_audio", label: "Music & Audio", color: "#9933cc" },

  // Shopping
  "amazon.com": { category: "shopping_commerce", label: "Shopping", color: "#ff9900" },
  "flipkart.com": { category: "shopping_commerce", label: "Shopping", color: "#2874f0" },
  "meesho.com": { category: "shopping_commerce", label: "Shopping", color: "#f43397" },

  // Travel
  "booking.com": { category: "travel_places", label: "Travel & Places", color: "#003580" },
  "airbnb.com": { category: "travel_places", label: "Travel & Places", color: "#ff5a5f" },
  "maps.google.com": { category: "travel_places", label: "Travel & Places", color: "#4285f4" },
  "tripadvisor.com": { category: "travel_places", label: "Travel & Places", color: "#34e0a1" },
  "makemytrip.com": { category: "travel_places", label: "Travel & Places", color: "#de1b2e" },

  // News
  "bbc.com": { category: "news_media", label: "News & Media", color: "#bb1919" },
  "techcrunch.com": { category: "news_media", label: "News & Media", color: "#0a9928" },
  "theverge.com": { category: "news_media", label: "News & Media", color: "#e5007d" },
  "hackernews.com": { category: "news_media", label: "News & Media", color: "#ff6600" },
  "news.ycombinator.com": { category: "news_media", label: "News & Media", color: "#ff6600" },

  // AI / ML
  "huggingface.co": { category: "ai_ml", label: "AI & Machine Learning", color: "#ffbd00" },
  "openai.com": { category: "ai_ml", label: "AI & Machine Learning", color: "#00a67e" },
  "anthropic.com": { category: "ai_ml", label: "AI & Machine Learning", color: "#b95a3f" },
  "kaggle.com": { category: "ai_ml", label: "AI & Machine Learning", color: "#20beff" },
  "paperswithcode.com": { category: "ai_ml", label: "AI & Machine Learning", color: "#21cbce" },
};

// Path-based sub-rules
const PATH_RULES: Array<[string, RegExp, { category: string; label: string; color: string }]> = [
  ["linkedin.com", /^\/jobs/, { category: "jobs_careers", label: "Jobs & Careers", color: "#0a66c2" }],
  ["google.com", /^\/maps/, { category: "travel_places", label: "Travel & Places", color: "#4285f4" }],
  ["youtube.com", /^\/shorts/, { category: "video_streaming", label: "Video & Streaming", color: "#ff0000" }],
];

// File extension rules
const EXT_MAP: Record<string, { category: string; label: string; color: string }> = {
  ".pdf": { category: "cloud_documents", label: "Cloud Documents", color: "#dc2626" },
  ".doc": { category: "cloud_documents", label: "Cloud Documents", color: "#2563eb" },
  ".docx": { category: "cloud_documents", label: "Cloud Documents", color: "#2563eb" },
  ".pptx": { category: "cloud_documents", label: "Cloud Documents", color: "#ea580c" },
  ".xlsx": { category: "cloud_documents", label: "Cloud Documents", color: "#16a34a" },
  ".mp4": { category: "video_streaming", label: "Video & Streaming", color: "#7c3aed" },
  ".mp3": { category: "music_audio", label: "Music & Audio", color: "#1db954" },
  ".ipynb": { category: "development_code", label: "Development & Code", color: "#f97316" },
};

function categorize(rawUrl: string) {
  let url: URL;
  try {
    const normalized =
      rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;
    url = new URL(normalized);
  } catch {
    return { category: "unknown", label: "Unknown", color: "#64748b", domain: rawUrl, tags: [] };
  }

  const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname.toLowerCase();

  // 1. Check file extension
  const ext = path.match(/\.[a-z0-9]+$/)?.[0];
  if (ext && EXT_MAP[ext]) {
    return { ...EXT_MAP[ext], domain: hostname, tags: [ext.slice(1).toUpperCase()] };
  }

  // 2. Check domain+path specific rules
  for (const [domain, regex, result] of PATH_RULES) {
    if (hostname.includes(domain) && regex.test(path)) {
      return { ...result, domain: hostname, tags: [result.label] };
    }
  }

  // 3. Check exact domain match
  const exact = DOMAIN_MAP[hostname];
  if (exact) {
    return { ...exact, domain: hostname, tags: [exact.label] };
  }

  // 4. Partial match (subdomain)
  for (const [key, value] of Object.entries(DOMAIN_MAP)) {
    if (hostname.endsWith(`.${key}`) || hostname === key) {
      return { ...value, domain: hostname, tags: [value.label] };
    }
  }

  return { category: "unknown", label: "Uncategorized", color: "#64748b", domain: hostname, tags: [] };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { url?: string };
    const rawUrl = body?.url?.trim() ?? "";

    if (!rawUrl || rawUrl.length > 4096) {
      return NextResponse.json({ detail: "Invalid URL" }, { status: 400 });
    }

    const result = categorize(rawUrl);
    return NextResponse.json({
      input_url: rawUrl,
      domain: result.domain,
      category: result.category,
      category_label: result.label,
      color: result.color,
      tags: result.tags,
    });
  } catch {
    return NextResponse.json({ detail: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "nibame categorizer API v1.0" });
}
