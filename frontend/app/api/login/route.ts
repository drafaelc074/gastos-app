import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { detail: "E-mail ou senha inválidos" },
      { status: 401 }
    );
  }

  const dados = await response.json();

  const resposta = NextResponse.json({
    sucesso: true,
  });

  resposta.cookies.set(
    "access_token",
    dados.access_token,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    }
  );

  return resposta;
}