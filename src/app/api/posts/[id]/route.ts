import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { checkPassword, checkRequiredFields } from "@/lib/api-helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { password, title, industry, source_url, summary, insight, value_chain } =
    await request.json();

  const authError = checkPassword(password);
  if (authError) return authError;

  const fieldError = checkRequiredFields({ title, summary, insight });
  if (fieldError) return fieldError;

  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      industry: industry || null,
      source_url: source_url?.trim() || null,
      summary,
      insight,
      value_chain: value_chain || null,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { password } = await request.json();

  const authError = checkPassword(password);
  if (authError) return authError;

  const { error } = await supabase.from("posts").delete().eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
