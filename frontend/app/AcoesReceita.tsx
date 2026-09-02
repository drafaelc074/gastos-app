"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Receita = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

export default function AcoesReceita({
  receita,
}: {
  receita: Receita;
}) {
  const router = useRouter();

  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(receita.descricao);
  const [valor, setValor] = useState(String(receita.valor));
  const [categoria, setCategoria] = useState(receita.categoria);
  const [data, setData] = useState(receita.data);
  const [salvando, setSalvando] = useState(false);

  async function salvarEdicao() {
    setSalvando(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/receitas/${receita.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            descricao,
            valor: Number(valor.replace(",", ".")),
            categoria,
            data,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar receita");
      }

      setEditando(false);
      router.refresh();
    } catch {
      alert("Não foi possível editar a receita.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirReceita() {
    const confirmar = confirm(
      `Deseja realmente excluir "${receita.descricao}"?`
    );

    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/receitas/${receita.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir receita");
      }

      router.refresh();
    } catch {
      alert("Não foi possível excluir a receita.");
    }
  }

  if (editando) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-32 rounded border p-2"
        />

        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-24 rounded border p-2"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded border p-2"
        >
          <option>Salário</option>
          <option>Freelance</option>
          <option>Investimentos</option>
          <option>Benefícios</option>
          <option>Vendas</option>
          <option>Outros</option>
        </select>

        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded border p-2"
        />

        <button
          onClick={salvarEdicao}
          disabled={salvando}
          className="text-green-600"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>

        <button
          onClick={() => setEditando(false)}
          className="text-gray-500"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => setEditando(true)}
        className="text-blue-600"
      >
        Editar
      </button>

      <button
        onClick={excluirReceita}
        className="text-red-600"
      >
        Excluir
      </button>
    </div>
  );
}