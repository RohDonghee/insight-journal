import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkPassword, checkRequiredFields } from "@/lib/api-helpers";

export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { title, industry, source_url, summary, insight, value_chain, password } =
    await request.json();

  const authError = checkPassword(password);
  if (authError) return authError;

  const fieldError = checkRequiredFields({ title, summary, insight });
  if (fieldError) return fieldError;

  const { data, error } = await supabase
    .from("posts")
    .insert([{
      title,
      industry: industry || null,
      source_url: source_url?.trim() || null,
      summary,
      insight,
      value_chain: value_chain || null,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
