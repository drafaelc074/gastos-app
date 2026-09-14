import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(
    `${BACKEND_URL}/usuarios`,
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