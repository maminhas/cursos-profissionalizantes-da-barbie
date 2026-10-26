import { NextResponse } from "next/server";

import { query } from "@/lib/db";

const fallbackCourses = [
  {
    id: 1,
    nome: "Manicure",
    duracao: "2h",
    descricao: "Cuidados com unhas, alongamento e finalização elegante.",
    categoria: "Estética",
    valor: 120.0,
  },
  {
    id: 2,
    nome: "Cortes masculinos",
    duracao: "1h30",
    descricao: "Estilos modernos, clássicos e com valor para o público masculino.",
    categoria: "Cabelo",
    valor: 150.0,
  },
  {
    id: 3,
    nome: "Cortes femininos dos anos 90",
    duracao: "1h45",
    descricao: "Visual retrô com técnicas inspiradas nos anos 90 em um toque glamouroso.",
    categoria: "Cabelo",
    valor: 170.0,
  },
  {
    id: 4,
    nome: "Hidratação capilar",
    duracao: "1h",
    descricao: "Tratamento profundo para brilho, maciez e resistência do cabelo.",
    categoria: "Tratamento",
    valor: 110.0,
  },
  {
    id: 5,
    nome: "Progressiva",
    duracao: "2h30",
    descricao: "Redução de volume com resultado liso e elegante de longa duração.",
    categoria: "Tratamento",
    valor: 220.0,
  },
  {
    id: 6,
    nome: "Alisamento definitivo",
    duracao: "3h",
    descricao: "Técnica sofisticada para fios lisos, alinhados e com maior controle diário.",
    categoria: "Tratamento",
    valor: 260.0,
  },
  {
    id: 7,
    nome: "Pintura de cabelo",
    duracao: "2h15",
    descricao: "Coloração profissional com mentoria para resultados brilhantes e seguros.",
    categoria: "Coloração",
    valor: 190.0,
  },
];

export async function GET() {
  try {
    const [rows] = await query(
      "SELECT id, nome, duracao, descricao, categoria, valor FROM cursos ORDER BY id ASC"
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return NextResponse.json(fallbackCourses);
  }
}
