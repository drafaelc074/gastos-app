import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import NovaDespesa from "./NovaDespesa";
import AcoesDespesa from "./AcoesDespesa";
import NovaReceita from "./NovaReceita";
import AcoesReceita from "./AcoesReceita";
import GraficoDespesasCategoria from "./GraficoDespesasCategoria";
import GraficoEvolucaoMensal from "./GraficoEvolucaoMensal";
import UsuarioLogado from "./UsuarioLogado";

import { BACKEND_URL } from "@/lib/backend";

type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

type Receita = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
};

type Lancamento = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: "receita" | "despesa";
};

type ResumoMensal = {
  mes: string;
  receitas: number;
  despesas: number;
};

async function buscarUsuario(token: string) {
  const response = await fetch(`${BACKEND_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar usuário");
  }

  return response.json();
}

async function buscarDespesas(
  mes: string,
  token: string
): Promise<Despesa[]> {
  const response = await fetch(
    `${BACKEND_URL}/despesas?mes=${mes}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar despesas");
  }

  return response.json();
}

async function buscarReceitas(
  mes: string,
  token: string
): Promise<Receita[]> {
  const response = await fetch(
    `${BACKEND_URL}/receitas?mes=${mes}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar receitas");
  }

  return response.json();
}

async function buscarResumoMensal(
  token: string
): Promise<ResumoMensal[]> {
  const response = await fetch(
    `${BACKEND_URL}/resumo-mensal`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (response.status === 401) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Erro ao buscar resumo mensal");
  }

  return response.json();
}

function formatarDinheiro(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;

  const hoje = new Date();

  const mesAtual =
    params.mes ??
    `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}`;

  const [despesas, receitas, resumoMensal, usuario] = await Promise.all([
  buscarDespesas(mesAtual, token),
  buscarReceitas(mesAtual, token),
  buscarResumoMensal(token),
  buscarUsuario(token),
]);

  const totalDespesas = despesas.reduce(
    (total, despesa) =>
      total + despesa.valor,
    0
  );

  const totalReceitas = receitas.reduce(
    (total, receita) =>
      total + receita.valor,
    0
  );

  const saldo =
    totalReceitas - totalDespesas;

  const lancamentos: Lancamento[] = [
    ...receitas.map((receita) => ({
      ...receita,
      tipo: "receita" as const,
    })),

    ...despesas.map((despesa) => ({
      ...despesa,
      tipo: "despesa" as const,
    })),
  ].sort(
    (a, b) =>
      new Date(b.data).getTime() -
      new Date(a.data).getTime()
  );

  const despesasPorCategoria =
    Object.values(
      despesas.reduce(
        (acc, despesa) => {
          if (!acc[despesa.categoria]) {
            acc[despesa.categoria] = {
              categoria:
                despesa.categoria,
              valor: 0,
            };
          }

          acc[
            despesa.categoria
          ].valor += despesa.valor;

          return acc;
        },
        {} as Record<
          string,
          {
            categoria: string;
            valor: number;
          }
        >
      )
    );

  function alterarMes(
    mes: string,
    quantidade: number
  ) {
    const [ano, numeroMes] =
      mes.split("-").map(Number);

    const data = new Date(
      ano,
      numeroMes - 1 + quantidade,
      1
    );

    return `${data.getFullYear()}-${String(
      data.getMonth() + 1
    ).padStart(2, "0")}`;
  }

  const mesAnterior =
    alterarMes(mesAtual, -1);

  const proximoMes =
    alterarMes(mesAtual, 1);

  const [
    anoSelecionado,
    numeroMesSelecionado,
  ] = mesAtual.split("-").map(Number);

  const nomeMes =
    new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(
      new Date(
        anoSelecionado,
        numeroMesSelecionado - 1,
        1
      )
    );

  const percentualEconomia =
    totalReceitas > 0
      ? ((totalReceitas - totalDespesas) / totalReceitas) * 100
      : 0;

  return (
    <main className="min-h-screen bg-[#f4f8fc] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-28 -top-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -right-24 top-32 h-[30rem] w-[30rem] rounded-full bg-teal-100/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-teal-500 text-2xl font-bold text-white shadow-lg shadow-sky-500/20" aria-hidden="true">G</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Seu painel financeiro</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Gastos App</h1>
              <p className="mt-1 text-sm text-slate-500">Mais clareza para suas decisões financeiras.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
            <UsuarioLogado usuario={usuario} />
            <div className="flex flex-wrap items-center gap-3">
              <NovaReceita />
              <NovaDespesa />
            </div>
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Período do relatório">
          <div>
            <p className="text-sm font-semibold text-teal-700">Visão geral</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Seu resumo financeiro</h2>
            <p className="mt-1 text-sm text-slate-500">Acompanhe o saldo e os movimentos do período.</p>
          </div>
          <nav className="flex w-fit max-w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm" aria-label="Navegar entre meses">
            <a href={`/?mes=${mesAnterior}`} aria-label="Mês anterior" className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">←</a>
            <span className="min-w-36 text-center text-sm font-bold capitalize text-slate-800 sm:min-w-44 sm:text-base">{nomeMes}</span>
            <a href={`/?mes=${proximoMes}`} aria-label="Próximo mês" className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">→</a>
          </nav>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores financeiros">
          <article className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 p-6 text-white shadow-xl shadow-slate-900/10">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-200">Saldo do mês</p>
              <span className="rounded-xl bg-white/10 px-3 py-2 text-lg" aria-hidden="true">◈</span>
            </div>
            <p className="mt-5 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">{formatarDinheiro(saldo)}</p>
            <p className="mt-3 text-xs text-slate-300">Receitas menos despesas do período</p>
          </article>
          <article className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Receitas</p>
              <span className="rounded-xl bg-emerald-50 px-3 py-2 text-lg text-emerald-700" aria-hidden="true">↗</span>
            </div>
            <p className="mt-5 break-words text-3xl font-extrabold tracking-tight text-emerald-700">{formatarDinheiro(totalReceitas)}</p>
            <p className="mt-3 text-xs text-slate-500">Entradas registradas no mês</p>
          </article>
          <article className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Despesas</p>
              <span className="rounded-xl bg-rose-50 px-3 py-2 text-lg text-rose-600" aria-hidden="true">↘</span>
            </div>
            <p className="mt-5 break-words text-3xl font-extrabold tracking-tight text-rose-600">{formatarDinheiro(totalDespesas)}</p>
            <p className="mt-3 text-xs text-slate-500">Saídas registradas no mês</p>
          </article>
          <article className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">Economia do mês</p>
              <span className="rounded-xl bg-sky-50 px-3 py-2 text-lg text-sky-700" aria-hidden="true">◎</span>
            </div>
            <p className={`mt-5 break-words text-3xl font-extrabold tracking-tight ${percentualEconomia >= 0 ? "text-sky-700" : "text-rose-600"}`}>{percentualEconomia.toLocaleString("pt-BR", {maximumFractionDigits: 1, minimumFractionDigits: 1})}%</p>
            <p className="mt-3 text-xs text-slate-500">Saldo em relação às receitas</p>
          </article>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Distribuição</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Despesas por categoria</h2>
              <p className="mt-1 text-sm text-slate-500">Onde seu dinheiro foi utilizado neste mês</p>
            </div>
            <div className="min-w-0 overflow-x-auto">
              {despesasPorCategoria.length > 0 ? (
                <GraficoDespesasCategoria dados={despesasPorCategoria} />
              ) : (
                <p className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">Nenhuma despesa cadastrada neste mês.</p>
              )}
            </div>
          </section>
          <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Histórico</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Evolução mensal</h2>
              <p className="mt-1 text-sm text-slate-500">Compare suas receitas e despesas ao longo do tempo</p>
            </div>
            <div className="min-w-0 overflow-x-auto">
              {resumoMensal.length > 0 ? (
                <GraficoEvolucaoMensal dados={resumoMensal} />
              ) : (
                <p className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">Ainda não existem dados suficientes para exibir o histórico.</p>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Movimentações</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Últimos lançamentos</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{lancamentos.length} lançamento(s)</span>
          </div>
          {lancamentos.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">Nenhum lançamento cadastrado.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {lancamentos.map((lancamento) => (
                <div key={`${lancamento.tipo}-${lancamento.id}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${lancamento.tipo === "receita" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`} aria-hidden="true">{lancamento.tipo === "receita" ? "+" : "−"}</span>
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-slate-800">{lancamento.descricao}</p>
                      <p className="mt-1 text-xs text-slate-500">{lancamento.tipo === "receita" ? "Receita" : "Despesa"} · {lancamento.categoria}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pl-[3.25rem] sm:justify-end sm:pl-0">
                    <p className={`font-bold ${lancamento.tipo === "receita" ? "text-emerald-700" : "text-rose-600"}`}>
                      {lancamento.tipo === "receita" ? "+" : "−"} {formatarDinheiro(lancamento.valor)}
                    </p>
                    {lancamento.tipo === "receita" ? (
                      <AcoesReceita receita={lancamento} />
                    ) : (
                      <AcoesDespesa despesa={lancamento} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-teal-900 p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">Em desenvolvimento</p>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">Inteligência financeira com IA ✨</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">Em breve, o aplicativo poderá analisar seus lançamentos e ajudar a encontrar oportunidades de economia automaticamente.</p>
        </section>
      </div>
    </main>
  );
}
