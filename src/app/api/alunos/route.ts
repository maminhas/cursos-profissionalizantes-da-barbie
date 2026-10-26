import { NextResponse } from "next/server";
import type { ResultSetHeader } from "mysql2";

import { query } from "@/lib/db";

const fallbackStudents = [
  { id: 1, nome: "Barbie", idade: 18 },
  { id: 2, nome: "Ken", idade: 20 },
  { id: 3, nome: "Rapunzel", idade: 21 },
];

export async function GET() {
  try {
    const [rows] = (await query(
      "SELECT id, nome, idade FROM alunos ORDER BY id ASC"
    )) as [any[], unknown];

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return NextResponse.json(fallbackStudents);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nome = String(body.nome ?? "").trim();
    const idade = Number(body.idade ?? 0);

    if (!nome || !Number.isFinite(idade) || idade <= 0) {
      return NextResponse.json(
        { error: "Informe um nome e uma idade válida." },
        { status: 400 }
      );
    }

    const [result] = (await query(
      "INSERT INTO alunos (nome, idade) VALUES (?, ?)",
      [nome, idade]
    )) as [ResultSetHeader, unknown];

    const aluno = {
      id: result.insertId,
      nome,
      idade,
    };

    return NextResponse.json(aluno, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    return NextResponse.json(
      { error: "Não foi possível cadastrar o aluno." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id ?? 0);
    const nome = String(body.nome ?? "").trim();
    const idade = Number(body.idade ?? 0);

    if (!id || !nome || !Number.isFinite(idade) || idade <= 0) {
      return NextResponse.json(
        { error: "Dados inválidos para atualizar o aluno." },
        { status: 400 }
      );
    }

    await query("UPDATE alunos SET nome = ?, idade = ? WHERE id = ?", [
      nome,
      idade,
      id,
    ]);

    return NextResponse.json({ id, nome, idade });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o aluno." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = Number(body.id ?? new URL(request.url).searchParams.get("id") ?? 0);

    if (!id) {
      return NextResponse.json(
        { error: "Informe o identificador do aluno." },
        { status: 400 }
      );
    }

    await query("DELETE FROM alunos WHERE id = ?", [id]);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o aluno." },
      { status: 500 }
    );
  }
}
