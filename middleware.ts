import { NextRequest, NextResponse } from "next/server";

function unauthorized(message: string, status = 401) {
  return new NextResponse(message, {
    status,
    headers: status === 401 ? { "WWW-Authenticate": 'Basic realm="Designer InBody Admin"' } : undefined,
  });
}

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return unauthorized("관리자 인증 환경변수가 설정되지 않았습니다.", 503);
  }

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized("관리자 인증이 필요합니다.");

  try {
    const [providedUsername, providedPassword] = atob(authorization.slice(6)).split(":", 2);
    if (providedUsername === username && providedPassword === password) return NextResponse.next();
  } catch {
    // Invalid Basic authentication payloads are handled as unauthorized.
  }

  return unauthorized("관리자 인증 정보가 올바르지 않습니다.");
}

export const config = {
  matcher: ["/admin/:path*"],
};
