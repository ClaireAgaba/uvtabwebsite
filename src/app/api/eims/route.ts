import { NextRequest, NextResponse } from "next/server";

const EIMS_BASE = "https://eims.uvtab.go.ug/api/v1";
const EIMS_API_KEY = "UVTAB-VRF-K9mXpQ2nLdWsYhJcTbFzAeRuNvGi7Ok";
const EIMS_API_SECRET = "sk_uvtab_3xHnP8qWmKjRdVtYcLbFzAeNvGuTiOsM2pQk9rE";

export async function GET(request: NextRequest) {
  const regNo = request.nextUrl.searchParams.get("reg_no");

  if (!regNo) {
    return NextResponse.json({ error: "reg_no parameter is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${EIMS_BASE}/verify/candidate?reg_no=${encodeURIComponent(regNo)}`,
      {
        headers: {
          "X-API-Key": EIMS_API_KEY,
          "X-API-Secret": EIMS_API_SECRET,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "EIMS API error", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to reach EIMS API", message: error.message },
      { status: 502 }
    );
  }
}
