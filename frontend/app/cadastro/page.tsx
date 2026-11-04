
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (carregando) return;

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        const dados = await response.json().catch(() => null);

        const detalhe = dados?.detail;
        const mensagem =
          typeof detalhe === "string"
            ? detalhe
            : "Não foi possível criar a conta";

        throw new Error(mensagem);
      }

      router.push("/login");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao criar conta"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 text-slate-900 lg:grid lg:grid-cols-2">

      {/* Área de apresentação */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-12 text-white lg:flex xl:p-16">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-400 text-2xl font-black shadow-lg">
            G
          </div>

          <span className="text-xl font-bold tracking-tight">
            Gastos App
          </span>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            Comece hoje
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
            Seu futuro financeiro
            <span className="block bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
              começa aqui.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
            Crie sua conta e comece a acompanhar suas receitas,
            despesas e evolução financeira em um só lugar.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-4 text-3xl text-emerald-300">
                ↗
              </div>

              <h3 className="font-semibold">
                Organize seu dinheiro
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Registre suas movimentações com facilidade.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-4 text-3xl text-sky-300">
                ◉
              </div>

              <h3 className="font-semibold">
                Acompanhe sua evolução
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Visualize seus resultados em gráficos.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          Gastos App — Simplicidade para cuidar do seu dinheiro.
        </p>
      </section>

      {/* Área de cadastro */}
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 font-black text-white shadow-lg">
              G
            </div>

            <span className="text-xl font-bold">
              Gastos App
            </span>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl shadow-slate-900/5 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                Sua jornada começa aqui
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Crie sua conta
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Comece a organizar suas finanças de forma simples.
              </p>
            </div>

            <form onSubmit={cadastrar} className="space-y-5">
              <div>
                <label
                  htmlFor="cadastro-nome"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nome
                </label>

                <input
                  id="cadastro-nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="cadastro-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="cadastro-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="cadastro-senha"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="cadastro-senha"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-24 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Utilize pelo menos 6 caracteres.
                </p>
              </div>

              {erro && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 px-5 py-4 font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:from-teal-800 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? "Criando conta..." : "Criar minha conta →"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="font-bold text-teal-700 hover:underline"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            Organize seu dinheiro. Planeje seu futuro.
          </p>
        </div>
      </section>
    </main>
  );
}
