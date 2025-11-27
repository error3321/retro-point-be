// ######
// Local onde os pacotes de dependências serão importados
// ######
import express from "express"; // Requisição do pacote do express
import pkg from "pg"; // Requisição do pacote do pg (PostgreSQL)
import dotenv from "dotenv"; // Importa o pacote dotenv para carregar variáveis de ambiente
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

// ######
// Local onde as configurações do servidor serão feitas
// ######
const app = express(); // Inicializa o servidor Express
const port = 3000; // Define a porta onde o servidor irá escutar
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
const { Pool } = pkg; // Obtém o construtor Pool do pacote pg para gerenciar conexões com o banco de dados PostgreSQL
let pool = null; // Variável para armazenar o pool de conexões com o banco de dados

// ######
// Local onde funções serão definidas
// ######

function conectarBD() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.URL_BD,
        });
    }
    return pool;
}

// ######
// Local onde as rotas (endpoints) serão definidas
// ######

app.get("/produto", async (req, res) => {

    const db = conectarBD();

    try {
        const resultado = await db.query("SELECT * FROM produto"); // Executa uma consulta SQL para selecionar todas as questões
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar produto:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

app.get("/produto/:id", async (req, res) => {

    const db = conectarBD();

    try {
        const id = req.params.id;
        const consulta = "SELECT * FROM produto WHERE id = $1"; // Consulta SQL para selecionar a questão pelo ID
        const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

        if (dados.length === 0) {
            return res.status(404).json({ mensagem: "Produto não encontrado" }); // Retorna erro 404 se a produto não for encontrada
        }

        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar produto:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

app.delete("/produto/:id", async (req, res) => {
  console.log("Rota DELETE /produto/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM produto WHERE id = $1"; // Consulta SQL para selecionar o produto pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o produto foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Produto não encontrado" }); // Retorna erro 404 se o produto não for encontrado
    }

    consulta = "DELETE FROM questoes WHERE id = $1"; // Consulta SQL para deletar o produto pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Produto excluído com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir produto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

//server.js
app.post("/produto", async (req, res) => {
  console.log("Rota POST /produto solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos (id_produto, nome, email, descricao, preco, estoque, destaque) são obrigatórios.",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO produto () VALUES ($1,$2,$3,$4) "; // Consulta SQL para inserir a questão
    const questao = [data.enunciado, data.disciplina, data.tema, data.nivel]; // Array com os valores a serem inseridos
    const resultado = await db.query(consulta, questao); // Executa a consulta SQL com os valores fornecidos
    res.status(201).json({ mensagem: "Produto criada com sucesso!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao inserir produto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.get("/promocao", async (req, res) => {

    const db = conectarBD();

    try {
        const resultado = await db.query("SELECT * FROM promocao SELECT *FROM produtos ORDER BY data_criacao DESC LIMIT 3;"); // Executa uma consulta SQL para selecionar todas as questões
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar produto:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

// ######
// Local onde o servidor irá escutar as requisições
// ######
app.listen(port, () => {
    // Inicia o servidor na porta definida
    // Um socket para "escutar" as requisições
    console.log(`Serviço rodando na porta:  ${port}`);
});
