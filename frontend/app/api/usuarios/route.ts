import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    "http://127.0.0.1:8000/usuarios",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const dados = await response.json();

  return NextResponse.json(dados, {
    status: response.status,
  });
}