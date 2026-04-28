import axios from "axios";

const API_URL = "https://nice-books-5133946fb0.strapiapp.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Generic Strapi fetch
export async function fetchStrapi<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T[]> {
  const query = new URLSearchParams({ "populate": "*", ...params }).toString();
  const { data } = await api.get(`/${endpoint}?${query}`);
  return data.data || [];
}

// Get single item
export async function fetchStrapiSingle<T>(
  endpoint: string
): Promise<T | null> {
  const { data } = await api.get(`/${endpoint}?populate=*`);
  return data.data || null;
}

// Helper to extract Strapi media URL
export function getStrapiMediaUrl(media: any): string {
  if (!media?.data?.attributes?.url) return "";
  const url = media.data.attributes.url;
  if (url.startsWith("http")) return url;
  return `https://nice-books-5133946fb0.strapiapp.com${url}`;
}

// Helper to extract attributes
export function getStrapiAttributes(item: any) {
  return item?.attributes || item || {};
}

// Announcements
export interface Announcement {
  id: number;
  Title: string;
  Content: string;
  Priority: number;
  isActive?: boolean;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const items = await fetchStrapi<any>("marquee-announcements", {
    sort: "Priority:desc",
  });
  return items.map((item: any) => ({
    id: item.id,
    ...getStrapiAttributes(item),
  }));
}

// Hero slides
export interface HeroSlide {
  id: number;
  Title: string;
  Description: any;
  ReadMoreUrl?: string;
  Active: boolean;
  Media: any[];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const items = await fetchStrapi<any>("updates-heroes", { sort: "createdAt:desc" });
  return items
    .map((item: any) => ({
      id: item.id,
      ...getStrapiAttributes(item),
    }))
    .filter((s: any) => s.Active !== false);
}

// News
export interface NewsItem {
  id: number;
  documentId: string;
  Title: string;
  Content: string;
  Description: string | any[];
  Image: any;
  createdAt: string;
  publishedAt: string;
}

export async function getNews(limit?: number): Promise<NewsItem[]> {
  const params: Record<string, string> = {
    sort: "publishedAt:desc",
  };
  if (limit) params["pagination[limit]"] = String(limit);
  const items = await fetchStrapi<any>("news-stories", params);
  return items
    .map((item: any) => ({
      id: item.id,
      documentId: item.documentId || item.id,
      ...getStrapiAttributes(item),
    }))
    .sort(
      (a: NewsItem, b: NewsItem) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );
}

// Mandate & Services
export interface MandateService {
  id: number;
  OurMandate: string;
  OurServices: string;
}

export async function getMandateAndServices(): Promise<MandateService | null> {
  return fetchStrapiSingle<MandateService>("mandate-and-service");
}

// ── Rich text helpers ──
export interface RichTextChild {
  type: string;
  text: string;
}
export interface RichTextBlock {
  type: string;
  children: RichTextChild[];
}

export function extractText(richText: (RichTextBlock | null)[]): string {
  if (!Array.isArray(richText)) return "";
  return richText
    .map((block) => block?.children?.map((c) => c.text).join(" ") ?? "")
    .join("\n\n");
}

// ── About Us ──
export interface AboutUs {
  id: number;
  Introduction: RichTextBlock[];
  Mission: { Title: string; Description: RichTextBlock[] };
  Vision: { Title: string; Description: RichTextBlock[] };
  CoreValues: { id: number; Title: string; Description: string }[];
}

export async function getAboutUs(): Promise<AboutUs | null> {
  return fetchStrapiSingle<AboutUs>("about-us");
}

// ── Board Members ──
export interface BoardMember {
  id: number;
  Name: string;
  Position: string;
  Description?: string;
  Order: number;
  ProfileImage?: { url: string; alternativeText?: string };
}

export async function getBoardMembers(): Promise<BoardMember[]> {
  const items = await fetchStrapi<any>("board-members", { sort: "Order:asc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Top Management ──
export interface TopManager {
  id: number;
  Name: string;
  Position: string;
  Description?: string;
  Order: number;
  ProfileImage?: { url: string };
}

export async function getTopManagement(): Promise<TopManager[]> {
  const items = await fetchStrapi<any>("top-managements", { sort: "Order:asc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Board Functions ──
export interface BoardFunction {
  id: number;
  Title: string;
  Introduction: RichTextBlock[];
  Functions: RichTextBlock[];
}

export async function getBoardFunctions(): Promise<BoardFunction[]> {
  const items = await fetchStrapi<any>("board-functions");
  return items.map((item: any) => ({
    id: item.id,
    Title: item.Title,
    Introduction: item.Introduction || [],
    Functions: item.Functions || [],
  }));
}

// ── Legal Framework ──
export interface LegalDocument {
  id: number;
  title: string;
  description: RichTextBlock[];
  documentUrl: string;
  documentName: string;
  coverImageUrl: string;
  category: string;
  publicationDate: string;
}

export async function getLegalDocuments(): Promise<LegalDocument[]> {
  const items = await fetchStrapi<any>("legal-framework-documents");
  return items.map((item: any) => {
    const raw = item.attributes || item;
    const docFile = raw.DocumentFile || raw.documentFile;
    let docUrl = "";
    let docName = "";
    if (docFile?.data?.attributes?.url) {
      docUrl = docFile.data.attributes.url;
      docName = docFile.data.attributes.name || "";
    } else if (Array.isArray(docFile) && docFile.length > 0) {
      docUrl = docFile[0].url || "";
      docName = docFile[0].name || "";
    } else if (docFile?.url) {
      docUrl = docFile.url;
      docName = docFile.name || "";
    }
    const cover = raw.CoverImage || raw.coverImage;
    const coverUrl =
      cover?.url || cover?.data?.attributes?.url || cover?.data?.attributes?.formats?.thumbnail?.url || "";
    return {
      id: item.id,
      title: raw.Title || raw.title || "",
      description: raw.Description || raw.description || [],
      documentUrl: proxyUrl(docUrl),
      documentName: docName,
      coverImageUrl: proxyUrl(coverUrl),
      category: raw.Category || raw.category || "",
      publicationDate: raw.PublicationDate || raw.publicationDate || "",
    };
  });
}

// ── News (full single item) ──
export async function getNewsById(documentId: string): Promise<any | null> {
  try {
    const { data } = await api.get(`/news-stories/${documentId}?populate=*`);
    return data.data || null;
  } catch {
    // try newss endpoint
    try {
      const { data } = await api.get(`/newss/${documentId}?populate=*`);
      return data.data || null;
    } catch {
      return null;
    }
  }
}

// ── News stories (listing) ──
export async function getNewsStories(limit?: number): Promise<any[]> {
  const params: Record<string, string> = { sort: "publishedAt:desc" };
  if (limit) params["pagination[limit]"] = String(limit);
  const items = await fetchStrapi<any>("news-stories", params);
  return items.map((item: any) => ({
    id: item.id,
    documentId: item.documentId || item.id,
    ...getStrapiAttributes(item),
  }));
}

// ── Gallery ──
export interface GalleryAlbum {
  id: number;
  Title: string;
  Description?: string;
  Media: any[];
  createdAt: string;
}

export async function getGallery(): Promise<GalleryAlbum[]> {
  const items = await fetchStrapi<any>("galleries", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Press Releases ──
export async function getPressReleases(): Promise<any[]> {
  const items = await fetchStrapi<any>("press-releases", { sort: "publishedAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Events ──
export async function getEvents(): Promise<any[]> {
  const items = await fetchStrapi<any>("events", { sort: "EventDate:desc", "pagination[pageSize]": "100" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Programs ──
export async function getPrograms(): Promise<any[]> {
  const items = await fetchStrapi<any>("programs", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Timetables ──
export async function getTimetables(): Promise<any[]> {
  const items = await fetchStrapi<any>("timetables", { sort: "createdAt:desc" });
  return items
    .map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        ExamSeries: attrs.ExamSeries || "",
        ProgramLevel: attrs.ProgramLevel || "",
        FileSize: attrs.FileSize || "",
        Active: attrs.Active !== false,
        Document: attrs.Document || [],
        Description: attrs.Description || [],
        createdAt: attrs.createdAt || item.createdAt,
        publishedAt: attrs.publishedAt || item.publishedAt,
      };
    })
    .filter((t: any) => t.Active);
}

// ── Summary Sheets ──
export async function getSummarySheets(): Promise<any[]> {
  const items = await fetchStrapi<any>("summary-sheets", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const attrs = item.attributes || item;
    return {
      id: item.id,
      ExamSeries: attrs.ExamSeries || "",
      Category: attrs.Category || "",
      FileSize: attrs.FileSize || "",
      Active: attrs.Active !== false,
      Description: attrs.Description || [],
      Media: attrs.Media || [],
      createdAt: attrs.createdAt || item.createdAt,
      publishedAt: attrs.publishedAt || item.publishedAt,
    };
  });
}

// ── Circulars ──
export async function getCirculars(): Promise<any[]> {
  const items = await fetchStrapi<any>("circulars", { sort: "createdAt:desc" });
  return items
    .map((item: any) => {
      const attrs = item.attributes || item;
      return {
        id: item.id,
        ExamSeries: attrs.ExamSeries || "",
        FileSize: attrs.FileSize || "",
        Active: attrs.Active !== false,
        Document: attrs.Document || null,
        Description: attrs.Description || [],
        createdAt: attrs.createdAt || item.createdAt,
        publishedAt: attrs.publishedAt || item.publishedAt,
      };
    })
    .filter((c: any) => c.Active);
}

// ── Curriculum ──
export async function getCurriculum(): Promise<any[]> {
  const items = await fetchStrapi<any>("curriculums", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Notice Board ──
export async function getNotices(): Promise<any[]> {
  const items = await fetchStrapi<any>("notice-boards", { sort: "publishedAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── FAQs ──
export async function getFaqs(): Promise<any[]> {
  const items = await fetchStrapi<any>("faqs");
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Career (Jobs, Internships, Activities) ──
export async function getJobs(): Promise<any[]> {
  const items = await fetchStrapi<any>("jobs", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

export async function getInternships(): Promise<any[]> {
  const items = await fetchStrapi<any>("internships", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

export async function getActivities(): Promise<any[]> {
  const items = await fetchStrapi<any>("uvtab-activities", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Reports & Downloads ──
export async function getReports(): Promise<any[]> {
  const items = await fetchStrapi<any>("reports", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const doc = Array.isArray(item.Document) && item.Document.length > 0 ? item.Document[0] : (item.Document && !Array.isArray(item.Document) ? item.Document : null);
    return {
      id: item.id,
      title: item.Title || "",
      description: item.Description || "",
      documentUrl: proxyUrl(doc?.url || null),
      fileName: doc?.name || "",
      fileSize: doc?.size || 0,
      fileExt: doc?.ext || "",
      publishedAt: item.publishedAt || item.createdAt,
    };
  });
}

export async function getDownloads(): Promise<any[]> {
  const items = await fetchStrapi<any>("downloads", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const doc = Array.isArray(item.Document) && item.Document.length > 0 ? item.Document[0] : (item.Document && !Array.isArray(item.Document) ? item.Document : null);
    return {
      id: item.id,
      title: item.Title || "",
      description: item.Description || "",
      documentUrl: proxyUrl(doc?.url || null),
      fileName: doc?.name || "",
      fileSize: doc?.size || 0,
      fileExt: doc?.ext || "",
      publishedAt: item.publishedAt || item.createdAt,
    };
  });
}

// ── Speeches ──
export async function getSpeeches(): Promise<any[]> {
  const items = await fetchStrapi<any>("speeches", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const doc = Array.isArray(item.Doc) && item.Doc.length > 0 ? item.Doc[0] : (item.Doc && !Array.isArray(item.Doc) ? item.Doc : null);
    return {
      id: item.id,
      title: item.Title || "",
      documentUrl: proxyUrl(doc?.url || null),
      fileName: doc?.name || "",
      fileSize: doc?.size || 0,
      fileExt: doc?.ext || "",
      publishedAt: item.publishedAt || item.createdAt,
    };
  });
}

// ── Bids & Tenders ──
export async function getBidsTenders(): Promise<any[]> {
  const items = await fetchStrapi<any>("bidtenders", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const doc = Array.isArray(item.Doc) && item.Doc.length > 0 ? item.Doc[0] : (item.Doc && !Array.isArray(item.Doc) ? item.Doc : null);
    return {
      id: item.id,
      title: item.Title || "",
      documentUrl: proxyUrl(doc?.url || null),
      fileName: doc?.name || "",
      fileSize: doc?.size || 0,
      fileExt: doc?.ext || "",
      publishedAt: item.publishedAt || item.createdAt,
    };
  });
}

// ── Innovation ──
export async function getInnovations(): Promise<any[]> {
  const items = await fetchStrapi<any>("innovations", { sort: "createdAt:desc" });
  return items.map((item: any) => ({ id: item.id, documentId: item.documentId || item.id, ...getStrapiAttributes(item) }));
}

// ── Centers ──
export async function getCenters(): Promise<any[]> {
  const items = await fetchStrapi<any>("centers");
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Newsletters ──
export async function getNewsletters(): Promise<any[]> {
  const items = await fetchStrapi<any>("newsletters", { sort: "PublicationDate:desc" });
  return items.map((item: any) => ({ id: item.id, ...getStrapiAttributes(item) }));
}

// ── Newsletter subscribers ──
export async function subscribeNewsletter(email: string): Promise<boolean> {
  try {
    await api.post("/newsletter-subscribers", { data: { Email: email } });
    return true;
  } catch {
    return false;
  }
}

// ── QMS (Quality Management System) ──
export async function getQMS(): Promise<any[]> {
  const items = await fetchStrapi<any>("qmss", { sort: "createdAt:desc" });
  return items.map((item: any) => {
    const doc = Array.isArray(item.Doc) && item.Doc.length > 0 ? item.Doc[0] : (item.Doc && !Array.isArray(item.Doc) ? item.Doc : null);
    return {
      id: item.id,
      title: item.Title || "",
      documentUrl: proxyUrl(doc?.url || null),
      fileName: doc?.name || "",
      fileSize: doc?.size || 0,
      fileExt: doc?.ext || "",
      publishedAt: item.publishedAt || item.createdAt,
    };
  });
}

// ── Proxy Strapi media URLs through our domain ──
const STRAPI_MEDIA_HOSTS = [
  "nice-books-5133946fb0.media.strapiapp.com",
  "nice-books-5133946fb0.strapiapp.com",
];

export function proxyUrl(url: string | null): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (STRAPI_MEDIA_HOSTS.includes(parsed.hostname)) {
      // Clean path: /docs/filename.pdf (proxied by Next.js rewrites)
      const path = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
      return `/docs/${path}`;
    }
  } catch {}
  return url;
}

// ── Media URL helper (handles both nested & flat) ──
export function getMediaUrl(media: any): string {
  if (!media) return "";
  let url = "";
  // Array of media
  if (Array.isArray(media) && media.length > 0) {
    url = media[0].url || "";
  }
  // Direct url
  else if (media.url) url = media.url;
  // Nested data.attributes
  else if (media.data?.attributes?.url) url = media.data.attributes.url;
  return proxyUrl(url);
}
