import NovaDespesa from "./NovaDespesa";
import AcoesDespesa from "./AcoesDespesa";
import NovaReceita from "./NovaReceita";
import AcoesReceita from "./AcoesReceita";

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

async function buscarDespesas(): Promise<Despesa[]> {
  const response = await fetch("http://127.0.0.1:8000/despesas", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar despesas");
  }

  return response.json();
}

function formatarDinheiro(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

async function buscarReceitas(): Promise<Receita[]> {
  const response = await fetch("http://127.0.0.1:8000/receitas", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar receitas");
  }

  return response.json();
}

export default async function Home() {
  const [despesas, receitas] = await Promise.all([
  buscarDespesas(),
  buscarReceitas(),
]);

  const totalDespesas = despesas.reduce(
    (total, despesa) => total + despesa.valor,
    0
  );

  const totalReceitas = receitas.reduce(
  (total, receita) => total + receita.valor,
  0
);

const saldo = totalReceitas - totalDespesas;

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
    new Date(b.data).getTime() - new Date(a.data).getTime()
);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-7xl p-8">

        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              💰 Gastos App
            </h1>

            <p className="mt-2 text-gray-500">
              Controle financeiro inteligente
            </p>
          </div>

          <div className="flex gap-3">
          <NovaReceita />
         <NovaDespesa />
        </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Saldo do mês
            </p>

            <p
            className={`mt-2 text-3xl font-bold ${
            saldo >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
          {formatarDinheiro(saldo)}
          </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Receitas
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
            {formatarDinheiro(totalReceitas)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Despesas
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {formatarDinheiro(totalDespesas)}
            </p>
          </div>

        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Últimos lançamentos
            </h2>

            <span className="text-sm text-gray-500">
              {lancamentos.length} lançamento(s)
            </span>
          </div>

          <div className="space-y-4">

           {lancamentos.length === 0 ? (
  <p className="text-gray-500">
    Nenhum lançamento cadastrado.
  </p>
) : (
  lancamentos.map((lancamento) => (
    <div
      key={`${lancamento.tipo}-${lancamento.id}`}
      className="flex items-center justify-between border-b py-4"
    >
      <div>
        <p className="font-medium">
          {lancamento.descricao}
        </p>

        <p className="text-sm text-gray-500">
          {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
          {" • "}
          {lancamento.categoria}
        </p>
      </div>

      <div className="flex items-center gap-8">
        <p
          className={`font-semibold ${
            lancamento.tipo === "receita"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {lancamento.tipo === "receita" ? "+" : "-"}{" "}
          {formatarDinheiro(lancamento.valor)}
        </p>
        {lancamento.tipo === "receita" ? (
  <AcoesReceita receita={lancamento} />
) : (
  <AcoesDespesa despesa={lancamento} />
)}
      </div>
    </div>
  ))
)}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-black p-6 text-white">

          <p className="text-sm text-gray-300">
            ✨ Análise com IA
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Inteligência financeira
          </h2>

          <p className="mt-3 text-gray-300">
            Em breve, a IA analisará seus gastos e encontrará
            oportunidades de economia automaticamente.
          </p>

        </section>

      </div>
    </main>
  );
}