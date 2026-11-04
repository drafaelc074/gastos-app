
"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function NovaReceita() {
  const router = useRouter();

  const [aberto, setAberto] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function fecharComEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !salvando) {
        setAberto(false);
      }
    }

    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, [aberto, salvando]);

  async function salvarReceita(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (salvando) return;

    setSalvando(true);

    try {
      const response = await fetch("/api/receitas", {
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

      if (!response.ok) {
        throw new Error("Erro ao cadastrar receita");
      }

      setDescricao("");
      setValor("");
      setCategoria("");
      setData("");
      setAberto(false);

      router.refresh();
    } catch {
      alert("Não foi possível cadastrar a receita.");
    } finally {
      setSalvando(false);
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !salvando) {
          setAberto(false);
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-nova-receita"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl sm:max-h-[calc(100dvh-3rem)]"
      >
        {/* Cabeçalho do modal */}
        <div className="shrink-0 border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="titulo-nova-receita"
                className="text-2xl font-bold"
              >
                Nova receita
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Cadastre uma nova entrada financeira.
              </p>
            </div>

            <button
              type="button"
              disabled={salvando}
              onClick={() => setAberto(false)}
              aria-label="Fechar"
              className="rounded-lg px-3 py-1 text-2xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Formulário com rolagem independente */}
        <form
          id="form-nova-receita"
          onSubmit={salvarReceita}
          className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-7"
        >
          <div>
            <label
              htmlFor="receita-descricao"
              className="text-sm font-semibold"
            >
              Descrição
            </label>

            <input
              id="receita-descricao"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500"
              placeholder="Ex: Salário"
            />
          </div>

          <div>
            <label
              htmlFor="receita-valor"
              className="text-sm font-semibold"
            >
              Valor
            </label>

            <input
              id="receita-valor"
              required
              inputMode="decimal"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500"
              placeholder="8500,00"
            />
          </div>

          <div>
            <label
              htmlFor="receita-categoria"
              className="text-sm font-semibold"
            >
              Categoria
            </label>

            <select
              id="receita-categoria"
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-emerald-500"
            >
              <option value="">Selecione</option>
              <option>Salário</option>
              <option>Freelance</option>
              <option>Investimentos</option>
              <option>Benefícios</option>
              <option>Vendas</option>
              <option>Outros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="receita-data"
              className="text-sm font-semibold"
            >
              Data
            </label>

            <input
              id="receita-data"
              required
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500"
            />
          </div>
        </form>

        {/* Rodapé sempre visível */}
        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            disabled={salvando}
            onClick={() => setAberto(false)}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="form-nova-receita"
            disabled={salvando}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar receita"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
      >
        + Nova receita
      </button>

      {aberto && createPortal(modal, document.body)}
    </>
  );
}
