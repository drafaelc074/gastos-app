"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

export default function AcoesDespesa({
  despesa,
}: {
  despesa: Despesa;
}) {
  const router = useRouter();

  const [editando, setEditando] = useState(false);
  const [descricao, setDescricao] = useState(despesa.descricao);
  const [valor, setValor] = useState(String(despesa.valor));
  const [categoria, setCategoria] = useState(despesa.categoria);
  const [data, setData] = useState(despesa.data);
  const [salvando, setSalvando] = useState(false);

  async function excluir() {
    const confirmar = window.confirm(
      `Deseja realmente excluir "${despesa.descricao}"?`
    );

    if (!confirmar) return;

    const response = await fetch(
      `http://127.0.0.1:8000/despesas/${despesa.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      alert("Erro ao excluir despesa.");
      return;
    }

    router.refresh();
  }

  async function salvar() {
    setSalvando(true);

    const response = await fetch(
      `http://127.0.0.1:8000/despesas/${despesa.id}`,
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

    setSalvando(false);

    if (!response.ok) {
      alert("Erro ao atualizar despesa.");
      return;
    }

    setEditando(false);
    router.refresh();
  }

  return (
    <>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => setEditando(true)}
          className="text-sm font-medium text-blue-600"
        >
          Editar
        </button>

        <button
          onClick={excluir}
          className="text-sm font-medium text-red-600"
        >
          Excluir
        </button>
      </div>

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-bold">
              Editar despesa
            </h2>

            <div className="mt-6 space-y-4">

              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Descrição"
              />

              <input
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Valor"
              />

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-lg border p-3"
              >
                <option>Alimentação</option>
                <option>Casa</option>
                <option>Transporte</option>
                <option>Saúde</option>
                <option>Lazer</option>
                <option>Educação</option>
                <option>Outros</option>
              </select>

              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full rounded-lg border p-3"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setEditando(false)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  onClick={salvar}
                  disabled={salvando}
                  className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}