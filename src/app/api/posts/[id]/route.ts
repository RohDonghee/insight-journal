import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { password, title, industry, source_url, summary, insight } = body;

  if (password !== process.env.WRITE_PASSWORD) {
    return NextResponse.json({ error: "잘못된 비밀번호입니다." }, { status: 401 });
  }

  if (!title || !summary || !insight) {
    return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ title, industry: industry || null, source_url: source_url || null, summary, insight })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { password } = body;

  if (password !== process.env.WRITE_PASSWORD) {
    return NextResponse.json({ error: "잘못된 비밀번호입니다." }, { status: 401 });
  }

  const { error } = await supabase.from("posts").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
