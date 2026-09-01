"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaDespesa() {
  const router = useRouter();

  const [aberto, setAberto] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarDespesa(event: FormEvent) {
    event.preventDefault();

    setSalvando(true);

    const response = await fetch("http://127.0.0.1:8000/despesas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descricao,
        valor: Number(valor.replace(",", ".")),
        categoria,
        data,
      }),
    });

    setSalvando(false);

    if (!response.ok) {
      alert("Não foi possível cadastrar a despesa.");
      return;
    }

    setDescricao("");
    setValor("");
    setCategoria("");
    setData("");
    setAberto(false);

    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="rounded-xl bg-black px-5 py-3 text-white"
      >
        + Nova despesa
      </button>

      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h2 className="text-2xl font-bold">
              Nova despesa
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Cadastre um novo gasto.
            </p>

            <form
              onSubmit={salvarDespesa}
              className="mt-6 space-y-4"
            >

              <div>
                <label className="text-sm font-medium">
                  Descrição
                </label>

                <input
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="mt-1 w-full rounded-lg border p-3"
                  placeholder="Ex: Supermercado"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Valor
                </label>

                <input
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="mt-1 w-full rounded-lg border p-3"
                  placeholder="250,50"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Categoria
                </label>

                <select
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="mt-1 w-full rounded-lg border p-3"
                >
                  <option value="">
                    Selecione
                  </option>

                  <option>Alimentação</option>
                  <option>Casa</option>
                  <option>Transporte</option>
                  <option>Saúde</option>
                  <option>Lazer</option>
                  <option>Educação</option>
                  <option>Outros</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  Data
                </label>

                <input
                  required
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="mt-1 w-full rounded-lg border p-3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setAberto(false)}
                  className="rounded-lg border px-4 py-2"
                >
                  Cancelar
                </button>

                <button
                  disabled={salvando}
                  type="submit"
                  className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  {salvando ? "Salvando..." : "Salvar despesa"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}