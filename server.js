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
app.use(cors());
app.use(express.json());

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
app.get("/usuario", async (req, res) => {

    const db = conectarBD();

    try {
        const resultado = await db.query("SELECT * FROM usuario"); // Executa uma consulta SQL para selecionar todos os usuários
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar usuário:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

app.get("/usuario/:id", async (req, res) => {

    const db = conectarBD();

    try {
        const id = req.params.id;
        const consulta = "SELECT * FROM usuario WHERE id = $1"; // Consulta SQL para selecionar o usuario pelo ID
        const resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta

        if (dados.length === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" }); // Retorna erro 404 se a produto não for encontrada
        }

        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar usuário:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});

app.delete("/usuario/:id", async (req, res) => {
  console.log("Rota DELETE /usuario/:id solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const id = req.params.id; // Obtém o ID da questão a partir dos parâmetros da URL
    const db = conectarBD(); // Conecta ao banco de dados
    let consulta = "SELECT * FROM usuario WHERE id_usuario = $1"; // Consulta SQL para selecionar o produto pelo ID
    let resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    let dados = resultado.rows; // Obtém as linhas retornadas pela consulta

    // Verifica se o produto foi encontrado
    if (dados.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" }); // Retorna erro 404 se o usuário não for encontrado
    }

    consulta = "DELETE FROM usuario WHERE id_usuario = $1"; // Consulta SQL para deletar o usuário pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Usuário excluído com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir usuário:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

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

    consulta = "DELETE FROM produto WHERE id = $1"; // Consulta SQL para deletar o produto pelo ID
    resultado = await db.query(consulta, [id]); // Executa a consulta SQL com o ID fornecido
    res.status(200).json({ mensagem: "Produto excluído com sucesso!!" }); // Retorna o resultado da consulta como JSON
  } catch (e) {
    console.error("Erro ao excluir produto:", e); // Log do erro no servidor
    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

app.post("/produto", async (req, res) => {
  console.log("Rota POST /produto solicitada"); // Log no terminal para indicar que a rota foi acessada

  try {
    const data = req.body; // Obtém os dados do corpo da requisição
    // Validação dos dados recebidos
    if (!data.enunciado || !data.disciplina || !data.tema || !data.nivel) {
      return res.status(400).json({
        erro: "Dados inválidos",
        mensagem:
          "Todos os campos (id_produto, nome, email, descricao, preco, estoque, destaque, data_cadastro) são obrigatórios.",
      });
    }

    const db = conectarBD(); // Conecta ao banco de dados

    const consulta =
      "INSERT INTO produto (id_produto, nome, email, descricao, preco, estoque, destaque, data_cadastro) VALUES ($1,$2,$3,$4) "; // Consulta SQL para inserir a questão
    const valores = [data.enunciado, data.disciplina, data.tema, data.nivel]; // Array com os valores a serem inseridos
    await db.query(consulta, valores); // Executa a consulta SQL com os valores fornecidos
    
    res.status(201).json({ mensagem: "Produto criado com sucesso!" }); // Retorna o resultado da consulta como JSON
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
        const resultado = await db.query("SELECT * FROM produto WHERE destaque = true ORDER BY data_criacao DESC LIMIT 3;"); // Executa uma consulta SQL para selecionar todas as questões
        const dados = resultado.rows; // Obtém as linhas retornadas pela consulta
        res.json(dados); // Retorna o resultado da consulta como JSON
    } catch (e) {
        console.error("Erro ao buscar produto:", e); // Log do erro no servidor
        res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
});



//criar conta
app.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }

    const db = conectarBD();

    try {
        // Verifica se o email já está cadastrado
        const existe = await db.query(
            "SELECT id_usuario FROM usuario WHERE email = $1",
            [email]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensagem: "Email já cadastrado." });
        }

        // Gera hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Insere o usuário
        await db.query(
            `INSERT INTO usuario (nome, email, senha, role)
             VALUES ($1, $2, $3, 'user')`,
            [nome, email, senhaHash]
        );

        return res.status(201).json({ mensagem: "Usuário criado com sucesso!" });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos." });
    }

    const db = conectarBD();

    try {
        // 1. Buscar usuário no banco
        const resultado = await db.query(
            "SELECT id_usuario, nome, email, senha, role FROM usuario WHERE email = $1",
            [email]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
        }

        const usuario = resultado.rows[0];

        // 2. Comparar senha com bcrypt
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "E-mail ou senha incorretos." });
        }

        // 3. Gerar token JWT
        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                email: usuario.email,
                role: usuario.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Retornar token
        res.json({
            mensagem: "Login bem-sucedido!",
            token
        });

    } catch (erro) {
        console.error("Erro no login:", erro);
        res.status(500).json({ mensagem: "Erro interno do servidor." });
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
