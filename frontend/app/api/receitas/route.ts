import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Não autenticado" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/receitas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const dados = await response.json();

  return NextResponse.json(
    dados,
    { status: response.status }
  );
}