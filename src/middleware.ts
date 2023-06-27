import { type NextRequest, NextResponse } from "next/server";
import { verify_auth } from "@/services/jwt";
// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/p/:path*"],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // validate the user is authenticated
  try {
    const cookie = await request.cookies.get("jwt");
    if (cookie) {
      const verifiedToken = await verify_auth(cookie.value);
      console.log("middleware+++", verifiedToken);
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "authentication failed" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    console.log("middleware---");
    return NextResponse.redirect(new URL("/", request.url));
  }
}
