
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (carregando) return;

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      if (!response.ok) {
        throw new Error("E-mail ou senha inválidos");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao fazer login"
      );
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
            Seu dinheiro, seu controle
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
            Mais clareza para suas
            <span className="block bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-transparent">
              decisões financeiras.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
            Organize suas receitas, acompanhe suas despesas
            e visualize sua evolução financeira em um só lugar.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-4 text-3xl text-emerald-300">
                ↗
              </div>
              <h3 className="font-semibold">
                Controle financeiro
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Receitas e despesas organizadas.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="mb-4 text-3xl text-sky-300">
                ◉
              </div>
              <h3 className="font-semibold">
                Visão inteligente
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Gráficos e histórico em seu dashboard.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-slate-400">
          Gastos App — Simplicidade para cuidar do seu dinheiro.
        </p>
      </section>

      {/* Área de login */}
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
                Bem-vindo de volta
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Entre na sua conta
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Acesse seu painel e acompanhe suas finanças.
              </p>
            </div>

            <form onSubmit={fazerLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="email"
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
                  htmlFor="senha"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Senha
                </label>

                <div className="relative">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-24 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute inset-y-0 right-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
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
                {carregando ? "Entrando..." : "Entrar na minha conta →"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Ainda não possui uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="font-bold text-teal-700 hover:underline"
                >
                  Criar conta grátis
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
