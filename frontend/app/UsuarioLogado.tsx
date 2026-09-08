"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export default function UsuarioLogado() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  async function carregarUsuario() {
    const response = await fetch("/api/me");

    if (!response.ok) {
      return;
    }

    const dados = await response.json();

    setUsuario(dados);
  }

  async function sair() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    carregarUsuario();
  }, []);

  if (!usuario) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium">
          Olá, {usuario.nome}
        </p>

        <p className="text-xs text-gray-500">
          {usuario.email}
        </p>
      </div>

      <button
        type="button"
        onClick={sair}
        className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
      >
        Sair
      </button>
    </div>
  );
}