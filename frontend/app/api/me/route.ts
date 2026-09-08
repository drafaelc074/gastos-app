import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "Não autenticado" },
      { status: 401 }
    );
  }

  const response = await fetch(
    "http://127.0.0.1:8000/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const dados = await response.json();

  return NextResponse.json(dados, {
    status: response.status,
  });
}