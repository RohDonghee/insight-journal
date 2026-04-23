import { NextResponse } from "next/server";

export function checkPassword(password: string): NextResponse | null {
  if (password !== process.env.WRITE_PASSWORD) {
    return NextResponse.json({ error: "잘못된 비밀번호입니다." }, { status: 401 });
  }
  return null;
}

export function checkRequiredFields(fields: Record<string, unknown>): NextResponse | null {
  const missing = Object.entries(fields).some(([, v]) => !v);
  if (missing) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }
  return null;
}
