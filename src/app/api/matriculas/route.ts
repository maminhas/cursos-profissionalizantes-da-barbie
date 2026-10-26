import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

import { query } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = (await query(
      `SELECT m.id, m.data_matricula, a.nome AS aluno, c.nome AS curso
       FROM matriculas m
       INNER JOIN alunos a ON a.id = m.aluno_id
       INNER JOIN cursos c ON c.id = m.curso_id
       ORDER BY m.id DESC`
    )) as [any[], unknown];

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao listar matrículas:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const alunoId = Number(body.alunoId ?? 0);
    const cursoId = Number(body.cursoId ?? 0);

    if (!alunoId || !cursoId) {
      return NextResponse.json(
        { error: "Selecione um aluno e um curso para matricular." },
        { status: 400 }
      );
    }

    const [existing] = (await query(
      "SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ?",
      [alunoId, cursoId]
    )) as [any[], unknown];

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Este aluno já está matriculado neste curso." },
        { status: 409 }
      );
    }

    const [result] = (await query(
      "INSERT INTO matriculas (aluno_id, curso_id) VALUES (?, ?)",
      [alunoId, cursoId]
    )) as [ResultSetHeader, unknown];

    return NextResponse.json(
      {
        id: result.insertId,
        alunoId,
        cursoId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar matrícula:", error);
    return NextResponse.json(
      { error: "Não foi possível realizar a matrícula." },
      { status: 500 }
    );
  }
}
