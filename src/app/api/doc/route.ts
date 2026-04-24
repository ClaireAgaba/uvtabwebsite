import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "nice-books-5133946fb0.media.strapiapp.com",
  "nice-books-5133946fb0.strapiapp.com",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "File not found" }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const filename = decodeURIComponent(parsed.pathname.split("/").pop() || "document");
    // Strip the Strapi hash suffix (e.g., _b638de7147) from filename
    const cleanName = filename.replace(/_[a-f0-9]{10}(\.\w+)$/, "$1");

    const body = res.body;
    return new NextResponse(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${cleanName}"`,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }
}
