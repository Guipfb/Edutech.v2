import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function EduTechApp() {
  const [usuario, setUsuario] = useState(null);
  const [credenciais, setCredenciais] = useState({ email: "", senha: "" });
  const [erroLogin, setErroLogin] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [aulas, setAulas] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const [nota, setNota] = useState(null);
  const [novaAula, setNovaAula] = useState({ titulo: "", link: "" });

  const carregarAulas = async () => {
    const res = await axios.get("http://localhost:3001/aulas");
    setAulas(res.data);
  };

  const carregarQuiz = async () => {
    const res = await axios.get("http://localhost:3001/quiz");
    setQuiz(res.data);
    setRespostas(Array(res.data.length).fill(null));
  };

  const enviarRespostas = async () => {
    try {
      const res = await axios.post("http://localhost:3001/respostas", respostas);
      setNota(res.data.nota);
      setMensagem("Quiz enviado com sucesso!");
    } catch {
      setMensagem("Erro ao enviar quiz.");
    }
  };

  const criarAula = async () => {
    if (!novaAula.titulo || !novaAula.link) {
      setMensagem("Preencha todos os campos da aula.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/aulas", novaAula);
      setMensagem("Aula criada com sucesso!");
      setNovaAula({ titulo: "", link: "" });
      carregarAulas();
    } catch {
      setMensagem("Erro ao criar aula.");
    }
  };

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3001/login", credenciais);
      setUsuario(res.data.tipo);
      setErroLogin("");
    } catch {
      setErroLogin("Usuário ou senha inválidos.");
    }
  };

  // Função para sair (limpar estado e voltar para login)
  const sair = () => {
    setUsuario(null);
    setMensagem("");
    setErroLogin("");
    setCredenciais({ email: "", senha: "" });
    setAulas([]);
    setQuiz([]);
    setRespostas([]);
    setNota(null);
  };

  useEffect(() => {
    if (usuario === "aluno") {
      carregarAulas();
      carregarQuiz();
    }
  }, [usuario]);

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    padding: 16,
  };

  const boxStyle = {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    maxWidth: 600,
    width: "100%",
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  };

  const buttonStyle = {
    width: "100%",
    padding: 10,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  };

  const errorStyle = {
    color: "#dc2626",
    marginTop: 8,
    textAlign: "center",
  };

  const successStyle = {
    color: "#16a34a",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "bold",
  };

  if (!usuario) {
    return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h1 style={{ textAlign: "center", marginBottom: 16 }}>EduTech - Acesso</h1>
          <input
            style={inputStyle}
            placeholder="E-mail"
            value={credenciais.email}
            onChange={(e) => setCredenciais({ ...credenciais, email: e.target.value })}
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Senha"
            value={credenciais.senha}
            onChange={(e) => setCredenciais({ ...credenciais, senha: e.target.value })}
          />
          <button style={buttonStyle} onClick={login}>
            Entrar
          </button>
          {erroLogin && <p style={errorStyle}>{erroLogin}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ ...containerStyle, paddingTop: 32, paddingBottom: 32, alignItems: "flex-start" }}
    >
      <div style={boxStyle}>
        {/* Botão sair alinhado à direita */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={sair}
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              marginBottom: 16,
              fontWeight: "bold",
            }}
          >
            Sair
          </button>
        </div>

        <h1 style={{ textAlign: "center" }}>Bem-vindo ao EduTech ({usuario})</h1>
        {mensagem && <p style={successStyle}>{mensagem}</p>}

        {usuario === "aluno" && (
          <>
            <h2>Minhas Aulas</h2>
            <ul>
              {aulas.map((aula) => (
                <li key={aula.id}>
                  <Link to={aula.link} style={{ color: "#2563eb" }}>
                    {aula.titulo}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 style={{ marginTop: 24 }}>Quiz</h2>
            {quiz.map((q, i) => (
              <div key={q.id} style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: "bold" }}>{q.pergunta}</p>
                {q.opcoes.map((op, j) => (
                  <label key={j} style={{ display: "block", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      onChange={() => {
                        const novas = [...respostas];
                        novas[i] = j;
                        setRespostas(novas);
                      }}
                      style={{ marginRight: 8 }}
                    />
                    {op}
                  </label>
                ))}
              </div>
            ))}
            <button style={buttonStyle} onClick={enviarRespostas}>
              Enviar Quiz
            </button>
            {nota !== null && (
              <p style={{ marginTop: 12, fontWeight: "bold" }}>Nota final: {nota}</p>
            )}
          </>
        )}

        {usuario === "professor" && (
          <>
            <h2>Criar Nova Aula</h2>
            <input
              style={inputStyle}
              placeholder="Título da aula"
              value={novaAula.titulo}
              onChange={(e) => setNovaAula({ ...novaAula, titulo: e.target.value })}
            />
            <input
              style={inputStyle}
              placeholder="Link do conteúdo (vídeo, PDF...)"
              value={novaAula.link}
              onChange={(e) => setNovaAula({ ...novaAula, link: e.target.value })}
            />
            <button style={buttonStyle} onClick={criarAula}>
              Criar Aula
            </button>
          </>
        )}
      </div>
    </div>
  );
}
