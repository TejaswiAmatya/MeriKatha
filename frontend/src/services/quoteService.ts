import { quotes, FALLBACK_REFLECTIONS } from "../data/quotes";
import type { Mood, Quote } from "../data/quotes";

const API = import.meta.env.VITE_API_URL ?? '';
const RECENT_KEY = "chhaya_recent_quotes";
const MAX_RECENT = 20;

function getRecentIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecentId(id: string) {
  const recent = getRecentIds();
  const updated = [id, ...recent.filter((r) => r !== id)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function filterQuotes(mood: Mood): Quote[] {
  const recent = new Set(getRecentIds());
  const moodFiltered = quotes.filter((q) => q.moods.includes(mood));
  const fresh = moodFiltered.filter((q) => !recent.has(q.id));
  return fresh.length > 0 ? fresh : moodFiltered;
}

function pickRandom(pool: Quote[]): Quote {
  return pool[Math.floor(Math.random() * pool.length)];
}

async function aiReflection(mood: Mood, quote: Quote): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${API}/api/bot/mood-reflection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify({
        mood,
        quoteText: quote.text,
        quoteAuthor: quote.author,
      }),
    });

    clearTimeout(timeout);

    const data = await res.json();
    if (data.success && data.data.reply) {
      return data.data.reply.trim();
    }
  } catch (err) {
    // Timeout, network error, or parsing error — use fallback
  }
  return FALLBACK_REFLECTIONS[mood];
}

export interface CheckInResult {
  quote: Quote;
  aiReflection: string;
}

export async function getCheckInQuote(mood: Mood): Promise<CheckInResult> {
  const pool = filterQuotes(mood);
  const quote = pickRandom(pool);

  addRecentId(quote.id);

  const reflection = await aiReflection(mood, quote);

  return { quote, aiReflection: reflection };
}
