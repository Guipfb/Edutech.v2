const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Banco de dados em memória com aulas já inicializadas
const aulas = [
  { id: 1, titulo: "Introdução ao EduTech", link: "https://link-da-aula-1.com" },
  { id: 2, titulo: "Segunda aula legal", link: "https://link-da-aula-2.com" }
];

const quiz = [
  {
    id: 1,
    pergunta: "Qual é a capital do Brasil?",
    opcoes: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
    correta: 1
  },
  {
    id: 2,
    pergunta: "Quanto é 2 + 2?",
    opcoes: ["3", "4", "5", "22"],
    correta: 1
  }
];

// Rota inicial
app.get('/', (req, res) => {
  res.send('EduTech está rodando!');
});

// Rota de login com dois usuários
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (email === 'professor@edutech.com' && senha === '123') {
    return res.json({ tipo: 'professor' });
  }

  if (email === 'aluno@edutech.com' && senha === '123') {
    return res.json({ tipo: 'aluno' });
  }

  return res.status(401).send('Usuário ou senha inválidos');
});

// Buscar aulas
app.get('/aulas', (req, res) => {
  res.json(aulas);
});

// Criar nova aula
app.post('/aulas', (req, res) => {
  const { titulo, link } = req.body;

  if (!titulo || !link) {
    return res.status(400).json({ erro: 'Título e link são obrigatórios' });
  }

  const novaAula = {
    id: aulas.length > 0 ? aulas[aulas.length - 1].id + 1 : 1,
    titulo,
    link
  };

  aulas.push(novaAula);
  res.status(201).json(novaAula);
});

// Deletar aula pelo id
app.delete('/aulas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = aulas.findIndex(aula => aula.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: 'Aula não encontrada' });
  }
  aulas.splice(index, 1);
  res.json({ mensagem: 'Aula deletada com sucesso' });
});

// Atualizar aula pelo id
app.put('/aulas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, link } = req.body;
  const aula = aulas.find(a => a.id === id);
  if (!aula) {
    return res.status(404).json({ erro: 'Aula não encontrada' });
  }
  if (titulo) aula.titulo = titulo;
  if (link) aula.link = link;
  res.json(aula);
});

// Buscar quiz
app.get('/quiz', (req, res) => {
  res.json(quiz);
});

// Enviar respostas do quiz
app.post('/respostas', (req, res) => {
  const respostas = req.body;

  if (!Array.isArray(respostas)) {
    return res.status(400).json({ erro: 'Respostas devem ser um array' });
  }

  let nota = 0;
  quiz.forEach((q, i) => {
    if (respostas[i] === q.correta) {
      nota++;
    }
  });

  res.json({ nota });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor EduTech rodando em http://localhost:${PORT}`);
});
