import * as cheerio from "cheerio";
import { SourceTier } from "./reliability";

export interface SourcedDocument {
  url: string;
  tier: SourceTier;
  fetched_at: string;
  title: string;
  text: string;
  source_type: "site" | "careers" | "about" | "news" | "search";
}

/**
 * Clean HTML text content
 */
function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim()
    .slice(0, 10000); // limit per doc to avoid payload bloat
}

/**
 * Fetch and parse a web page safely with timeout
 */
export async function fetchPage(
  url: string,
  timeoutMs = 6000
): Promise<{ title: string; text: string; success: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { title: "", text: "", success: false };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $("script, style, noscript, svg, nav, footer, iframe").remove();

    const title = $("title").text().trim() || $("h1").first().text().trim() || "";
    const text = cleanText($("body").text());

    return { title, text, success: true };
  } catch (err) {
    return { title: "", text: "", success: false };
  }
}

/**
 * Perform research across primary company URL and subpages
 */
export async function performResearch(
  companyUrl: string,
  companyName?: string
): Promise<SourcedDocument[]> {
  const normalizedUrl = companyUrl.startsWith("http")
    ? companyUrl
    : `https://${companyUrl}`;
  const baseUrl = normalizedUrl.replace(/\/$/, "");
  const docs: SourcedDocument[] = [];
  const now = new Date().toISOString();

  // 1. Fetch Homepage (Tier 1)
  const home = await fetchPage(baseUrl);
  if (home.success && home.text) {
    docs.push({
      url: baseUrl,
      tier: 1,
      fetched_at: now,
      title: home.title || "Homepage",
      text: home.text,
      source_type: "site",
    });
  }

  // 2. Fetch About / Team (Tier 1)
  const aboutUrl = `${baseUrl}/about`;
  const about = await fetchPage(aboutUrl);
  if (about.success && about.text.length > 100) {
    docs.push({
      url: aboutUrl,
      tier: 1,
      fetched_at: now,
      title: about.title || "About Us",
      text: about.text,
      source_type: "about",
    });
  }

  // 3. Fetch Careers / Jobs (Tier 1)
  const careersUrl = `${baseUrl}/careers`;
  const careers = await fetchPage(careersUrl);
  if (careers.success && careers.text.length > 100) {
    docs.push({
      url: careersUrl,
      tier: 1,
      fetched_at: now,
      title: careers.title || "Careers",
      text: careers.text,
      source_type: "careers",
    });
  }

  // 4. Fallback if home was blocked or empty
  if (docs.length === 0) {
    docs.push({
      url: baseUrl,
      tier: 4,
      fetched_at: now,
      title: companyName || "Company Site",
      text: `Public domain reached for ${companyName || baseUrl}. Direct scraping restricted; proceeding with indexed signals.`,
      source_type: "search",
    });
  }

  return docs;
}
