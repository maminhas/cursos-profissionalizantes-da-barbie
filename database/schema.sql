CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  CHECK (idade > 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  duracao VARCHAR(50) NOT NULL,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  valor DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS matriculas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT NOT NULL,
  curso_id INT NOT NULL,
  data_matricula DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_matriculas_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
  CONSTRAINT fk_matriculas_curso FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO alunos (nome, idade) VALUES
  ('Barbie', 18),
  ('Ken', 20),
  ('Rapunzel', 21),
  ('Tiana', 24),
  ('Velvet', 22)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), idade = VALUES(idade);

INSERT INTO cursos (nome, duracao, descricao, categoria, valor) VALUES
  ('Manicure', '2h', 'Cuidados com unhas, alongamento e finalização elegante.', 'Estética', 120.00),
  ('Cortes masculinos', '1h30', 'Estilos modernos, clássicos e com valor para o público masculino.', 'Cabelo', 150.00),
  ('Cortes femininos dos anos 90', '1h45', 'Visual retrô com técnicas inspiradas nos anos 90 em um toque glamouroso.', 'Cabelo', 170.00),
  ('Hidratação capilar', '1h', 'Tratamento profundo para brilho, maciez e resistência do cabelo.', 'Tratamento', 110.00),
  ('Progressiva', '2h30', 'Redução de volume com resultado liso e elegante de longa duração.', 'Tratamento', 220.00),
  ('Alisamento definitivo', '3h', 'Técnica sofisticada para fios lisos, alinhados e com maior controle diário.', 'Tratamento', 260.00),
  ('Pintura de cabelo', '2h15', 'Coloração profissional com mentoria para resultados brilhantes e seguros.', 'Coloração', 190.00)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), duracao = VALUES(duracao), descricao = VALUES(descricao), categoria = VALUES(categoria), valor = VALUES(valor);

INSERT INTO matriculas (aluno_id, curso_id) VALUES
  (1, 1),
  (2, 2),
  (3, 7),
  (4, 4)
ON DUPLICATE KEY UPDATE aluno_id = VALUES(aluno_id), curso_id = VALUES(curso_id);
