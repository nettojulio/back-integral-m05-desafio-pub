const knex = require("../connections/db_connections");

async function emailIsValid(emailUsuario, database) {
  const user = await knex(database)
    .where({ email: emailUsuario })
    .first()
    .debug();
  if (user) {
    throw new Error("O email já existe!");
  }
}

async function signUpNewUser(nomeUsuario, emailUsuario, senhaUsuario) {
  const user = await knex("usuarios")
    .insert({
      nome: nomeUsuario,
      email: emailUsuario,
      senha: senhaUsuario,
    })
    .returning("*");

  if (!user) {
    throw new Error("O usuário não foi cadastrado.");
  }

  return user;
}

async function checkUserSignIn(emailUsuario) {
  const user = await knex("usuarios")
    .where({ email: emailUsuario })
    .first()
    .debug();
  if (!user) {
    throw new Error("Email e/ou senha não confere!");
  }
  return user;
}

async function checkUserById(idUsuario) {
  const user = await knex("usuarios").where({ id: idUsuario }).first().debug();
  if (!user) {
    throw new Error("Usuario não encontrado!");
  }
  return user;
}

async function updateRegisteredUser(
  nome,
  email,
  senha,
  cpf,
  telefone,
  idUsuario
) {
  const schema = senha
    ? {
        nome,
        email,
        senha,
        cpf,
        telefone,
      }
    : {
        nome,
        email,
        cpf,
        telefone,
      };

  const user = await knex("usuarios")
    .update(schema)
    .where({ id: idUsuario })
    .returning("*")
    .debug();

  if (!user) {
    throw new Error("O usuario não foi atualizado!");
  }

  return user[0];
}

async function signUpNewClient(
  id,
  nome,
  email,
  cpf,
  telefone,
  cep,
  endereco,
  complemento,
  bairro,
  cidade,
  estado
) {
  const client = await knex("clientes")
    .insert({
      id_usuario: id,
      nome: nome,
      email: email,
      cpf: cpf,
      telefone: telefone,
      cep: cep,
      endereco: endereco,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
    })
    .returning("*");

  if (!client) {
    throw new Error("Cliente não cadastrado.");
  }

  return client;
}

async function nameValidation(nome) {
  if (!nome) {
    throw new Error("Nome é uma informação obrigatória.");
  }

  if (typeof nome !== "string") {
    throw new Error("Inserção de caracteres inválidas.");
  }

  if (!nome.trim()) {
    throw new Error("Nome deve conter caracteres válidos.");
  }
}

async function emailValidation(email) {
  if (!email) {
    throw new Error("Email é uma informação obrigatória.");
  }

  if (typeof email !== "string") {
    throw new Error("Inserção de caracteres inválidas.");
  }

  if (!email.trim()) {
    throw new Error("Email deve conter caracteres válidos.");
  }

  if (!email.includes("@") || !email.includes(".") || email.length < 8) {
    throw new Error("Email inválido para cadastro!");
  }
}

async function passwordValidation(senha) {
  if (typeof senha !== "string" || !senha.trim() || senha.trim().length < 6) {
    throw new Error("Senha inválida! Inferior a 6 caracteres.");
  }
}

async function cpfValidation(cpf) {
  if (typeof cpf !== "string" || cpf.trim().length !== 11 || isNaN(cpf)) {
    throw new Error("CPF inválido! CPF é composto por 11 dígitos numéricos.");
  }
}

async function phoneValidation(telefone) {
  if (
    typeof telefone !== "string" ||
    telefone.trim().length < 10 ||
    isNaN(telefone)
  ) {
    throw new Error("Telefone inválido! Informe DDD + Número válido.");
  }
}

async function cepValidation(cep) {
  if (typeof cep !== "string" || cep.trim().length !== 8 || isNaN(cep)) {
    throw new Error("CEP inválido! CEP é composto por 8 números.");
  }
}

module.exports = {
  emailIsValid,
  signUpNewUser,
  checkUserSignIn,
  checkUserById,
  updateRegisteredUser,
  signUpNewClient,
  nameValidation,
  emailValidation,
  passwordValidation,
  cpfValidation,
  phoneValidation,
  cepValidation,
};
