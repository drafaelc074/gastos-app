type Despesa = {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
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

export default async function Home() {
  const despesas = await buscarDespesas();

  const totalDespesas = despesas.reduce(
    (total, despesa) => total + despesa.valor,
    0
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

          <button className="rounded-xl bg-black px-5 py-3 text-white">
            + Nova despesa
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Saldo do mês
            </p>

            <p className="mt-2 text-3xl font-bold">
              --
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Receitas
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              --
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
              {despesas.length} lançamento(s)
            </span>
          </div>

          <div className="space-y-4">

            {despesas.length === 0 ? (
              <p className="text-gray-500">
                Nenhuma despesa cadastrada.
              </p>
            ) : (
              despesas.map((despesa) => (
                <div
                  key={despesa.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <p className="font-medium">
                      {despesa.descricao}
                    </p>

                    <p className="text-sm text-gray-500">
                      {despesa.categoria}
                    </p>
                  </div>

                  <p className="font-semibold text-red-600">
                    - {formatarDinheiro(despesa.valor)}
                  </p>
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