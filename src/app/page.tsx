"use client";

import { useEffect, useState } from "react";

type Student = {
  id: number;
  nome: string;
  idade: number;
};

type Course = {
  id: number;
  nome: string;
  duracao: string;
  descricao: string;
  categoria: string;
  valor: number;
};

const defaultStudents: Student[] = [
  { id: 1, nome: "Barbie", idade: 18 },
  { id: 2, nome: "Ken", idade: 20 },
  { id: 3, nome: "Rapunzel", idade: 21 },
  { id: 4, nome: "Tiana", idade: 24 },
  { id: 5, nome: "Velvet", idade: 22 },
];

const initialForm = { nome: "", idade: "" };

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>(defaultStudents);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      const response = await fetch("/api/alunos");
      const data = await response.json();
      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await fetch("/api/cursos");
      const data = await response.json();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
  };

  useEffect(() => {
    loadStudents();
    loadCourses();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const nome = form.nome.trim();
    const idade = Number(form.idade);

    if (!nome || !idade || idade <= 0) {
      setMessage("Informe um nome e uma idade válidos.");
      setLoading(false);
      return;
    }

    try {
      const url = editingId ? "/api/alunos" : "/api/alunos";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, nome, idade } : { nome, idade };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar aluno.");
      }

      setForm(initialForm);
      setEditingId(null);
      setMessage(
        editingId ? `Aluno ${data.nome} atualizado com sucesso!` : `Aluno ${data.nome} cadastrado com sucesso!`
      );
      await loadStudents();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({ nome: student.nome, idade: String(student.idade) });
    setMessage(`Editando ${student.nome}.`);
  };

  const handleDelete = async (studentId: number) => {
    try {
      const response = await fetch("/api/alunos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir aluno.");
      }

      setMessage(`Aluno ${studentId} removido com sucesso.`);
      setForm(initialForm);
      setEditingId(null);
      await loadStudents();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    }
  };

  return (
    <>
      <header className="site-header">
        <nav className="navbar" aria-label="Navegação principal">
          <div className="brand">
            <span className="brand-mark">B</span>
            Salão da Barbie
          </div>
          <div className="nav-links">
            <a href="#inicio">Início</a>
            <a href="#cursos">Cursos</a>
            <a href="#alunos">Alunos</a>
            <a href="/cursos">Detalhes</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-card">
            <div>
              <span className="eyebrow">✨ Estilo glamouroso</span>
              <h1>O salão de beleza mais pink do universo Barbie.</h1>
              <p>
                Aprenda técnicas de beleza, cortes e tratamentos em um ambiente inspiradíssimo
                nos filmes, séries e personagens favoritos da linha Barbie.
              </p>
              <div className="hero-actions">
                <a className="primary-button" href="#cursos">Ver cursos</a>
                <a className="secondary-button" href="#alunos">Cadastrar aluno</a>
              </div>
            </div>

            <div className="hero-panel">
              <div className="feature-list">
                <ul>
                  <li><span className="feature-dot" /> Curso profissionalizante temático</li>
                  <li><span className="feature-dot" /> Instrutores com foco em beleza</li>
                  <li><span className="feature-dot" /> Ambiente rosa, elegante e acolhedor</li>
                </ul>
              </div>
              <div className="info-card">
                <span>Alunas em destaque</span>
                <strong>Barbie</strong>
                <span>Ken, Rapunzel, Tiana e Velvet</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="cursos">
          <div className="section-header">
            <h2>Catálogo de cursos</h2>
            <a className="secondary-button" href="/cursos">Abrir página de detalhes</a>
          </div>

          <div className="course-grid">
            {courses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-meta">
                  <span>{course.categoria}</span>
                  <span>{course.duracao}</span>
                </div>
                <h3>{course.nome}</h3>
                <p>{course.descricao}</p>
                <div className="course-price">R$ {course.valor.toFixed(2)}</div>
                <div className="course-actions">
                  <a className="small-button secondary-button" href={`/cursos?curso=${course.id}`}>
                    Detalhes
                  </a>
                  <button
                    className="small-button primary-button"
                    onClick={() =>
                      window.alert(
                        `Matrícula rápida: ${course.nome}. Escolha o aluno na página de cursos.`
                      )
                    }
                  >
                    Matricular
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="alunos">
          <div className="layout-grid">
            <div className="form-card">
              <h3>{editingId ? "Editar aluno" : "Cadastrar aluno"}</h3>
              <form onSubmit={handleSubmit} className="form-grid">
                <div className="input-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    value={form.nome}
                    onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                    placeholder="Ex.: Barbie"
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="idade">Idade</label>
                  <input
                    id="idade"
                    type="number"
                    min={1}
                    value={form.idade}
                    onChange={(event) => setForm((current) => ({ ...current, idade: event.target.value }))}
                    placeholder="Ex.: 18"
                  />
                </div>

                <button className="primary-button" type="submit" disabled={loading}>
                  {loading ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar aluno"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setEditingId(null);
                      setForm(initialForm);
                      setMessage("Edição cancelada.");
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </form>

              {message && <div className="notice">{message}</div>}
            </div>

            <div className="student-card">
              <h3>Lista de alunos</h3>
              <div className="student-list">
                {students.map((student) => (
                  <div key={student.id} className="student-row">
                    <div>
                      <strong>{student.nome}</strong>
                      <p>{student.idade} anos</p>
                    </div>
                    <div className="student-actions">
                      <span className="student-badge">ID {student.id}</span>
                      <button className="small-button secondary-button" onClick={() => handleEdit(student)}>
                        Editar
                      </button>
                      <button className="small-button danger-button" onClick={() => handleDelete(student.id)}>
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>Salão da Barbie • Formação profissional em beleza e estilo</footer>
    </>
  );
}
