"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DadoGrafico = {
  categoria: string;
  valor: number;
};

type Props = {
  dados: DadoGrafico[];
};

const CORES = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
];

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function GraficoDespesasCategoria({ dados }: Props) {
  const dadosOrdenados = [...dados].sort(
    (a, b) => b.valor - a.valor
  );

  const total = dadosOrdenados.reduce(
    (soma, item) => soma + item.valor,
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="relative h-80 w-full">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm text-gray-500">Total</p>

          <p className="text-lg font-bold text-gray-900">
            {formatarMoeda(total)}
          </p>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosOrdenados}
              dataKey="valor"
              nameKey="categoria"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
            >
              {dadosOrdenados.map((item, index) => (
                <Cell
                  key={item.categoria}
                  fill={CORES[index % CORES.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(valor) =>
            valor !== undefined
            ? formatarMoeda(Number(valor))
            : ""
            }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col justify-center gap-4">
        {dadosOrdenados.map((item, index) => {
          const percentual =
            total > 0 ? (item.valor / total) * 100 : 0;

          return (
            <div
              key={item.categoria}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      CORES[index % CORES.length],
                  }}
                />

                <span className="font-medium">
                  {item.categoria}
                </span>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  {formatarMoeda(item.valor)}
                </p>

                <p className="text-sm text-gray-500">
                  {percentual.toFixed(1).replace(".", ",")}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}