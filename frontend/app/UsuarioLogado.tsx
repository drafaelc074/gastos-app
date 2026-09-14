"use client";

import { useRouter } from "next/navigation";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export default function UsuarioLogado({
  usuario,
}: {
  usuario: Usuario;
}) {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
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