"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ResumoMensal = {
  mes: string;
  receitas: number;
  despesas: number;
};

type Props = {
  dados: ResumoMensal[];
};

function formatarMes(mes: string) {
  const [ano, numeroMes] = mes.split("-").map(Number);

  const nomesMeses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${nomesMeses[numeroMes - 1]}/${String(ano).slice(-2)}`;
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function GraficoEvolucaoMensal({ dados }: Props) {
  const dadosFormatados = dados.map((item) => ({
    ...item,
    mesFormatado: formatarMes(item.mes),
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dadosFormatados}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mesFormatado" />

          <YAxis
            tickFormatter={(valor) =>
              Number(valor).toLocaleString("pt-BR")
            }
          />

          <Tooltip
            formatter={(valor) =>
            valor !== undefined
            ? formatarMoeda(Number(valor))
            : ""
            }
          />

          <Legend />

          <Bar
            dataKey="receitas"
            name="Receitas"
            fill="#16a34a"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="despesas"
            name="Despesas"
            fill="#dc2626"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}