"use client";

import { useEffect, useMemo, useState } from "react";

type Course = {
  id: number;
  nome: string;
  duracao: string;
  descricao: string;
  categoria: string;
  valor: number;
};

type Student = {
  id: number;
  nome: string;
  idade: number;
};

export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0);
  const [message, setMessage] = useState("");

  const loadCourses = async () => {
    const response = await fetch("/api/cursos");
    const data = await response.json();
    if (Array.isArray(data)) setCourses(data);
  };

  const loadStudents = async () => {
    const response = await fetch("/api/alunos");
    const data = await response.json();
    if (Array.isArray(data)) {
      setStudents(data);
      if (data.length > 0) setSelectedStudentId(Number(data[0].id));
    }
  };

  useEffect(() => {
    loadCourses();
    loadStudents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = Number(params.get("curso") ?? 0);

    if (courseId > 0 && courses.length > 0) {
      const course = courses.find((item) => item.id === courseId) ?? null;
      setSelectedCourse(course);
    }
  }, [courses]);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const handleEnroll = async () => {
    if (!selectedCourse || !selectedStudentId) {
      setMessage("Selecione um aluno e um curso para se matricular.");
      return;
    }

    const response = await fetch("/api/matriculas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId: selectedStudentId, cursoId: selectedCourse.id }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Não foi possível realizar a matrícula.");
      return;
    }

    setMessage(`Matrícula confirmada para ${selectedStudent?.nome ?? "aluno"} no curso ${selectedCourse.nome}.`);
  };

  return (
    <main>
      <header className="site-header">
        <nav className="navbar" aria-label="Navegação de cursos">
          <div className="brand">
            <span className="brand-mark">B</span>
            Salão da Barbie
          </div>
          <div className="nav-links">
            <a href="/">Início</a>
            <a href="#cursos">Cursos</a>
          </div>
        </nav>
      </header>

      <section className="section" id="cursos">
        <div className="section-header">
          <h2>Página de cursos</h2>
          <a className="secondary-button" href="/">Voltar ao início</a>
        </div>

        <div className="layout-grid">
          <div className="table-card">
            <h3>Catálogo</h3>
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
                    <button className="small-button secondary-button" onClick={() => setSelectedCourse(course)}>
                      Visualizar
                    </button>
                    <button className="small-button primary-button" onClick={() => setSelectedCourse(course)}>
                      Matricular
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="form-card">
            <h3>Detalhes da matrícula</h3>
            {selectedCourse ? (
              <div className="form-grid">
                <div className="info-card">
                  <span>{selectedCourse.categoria}</span>
                  <strong>{selectedCourse.nome}</strong>
                  <span>{selectedCourse.duracao}</span>
                  <p>{selectedCourse.descricao}</p>
                  <div className="course-price">R$ {selectedCourse.valor.toFixed(2)}</div>
                </div>

                <div className="input-group">
                  <label htmlFor="aluno">Aluno</label>
                  <select
                    id="aluno"
                    value={selectedStudentId}
                    onChange={(event) => setSelectedStudentId(Number(event.target.value))}
                  >
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="primary-button" onClick={handleEnroll}>
                  Confirmar matrícula
                </button>
              </div>
            ) : (
              <p>Selecione um curso para ver os detalhes.</p>
            )}

            {message && <div className="notice">{message}</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
