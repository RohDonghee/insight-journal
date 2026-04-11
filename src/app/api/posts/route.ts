import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, industry, source_url, summary, insight, password } = body;

  // 비밀번호 검증 (서버 사이드)
  if (password !== process.env.WRITE_PASSWORD) {
    return NextResponse.json({ error: "잘못된 비밀번호입니다." }, { status: 401 });
  }

  if (!title || !summary || !insight) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, industry: industry || null, source_url: source_url || null, summary, insight }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
