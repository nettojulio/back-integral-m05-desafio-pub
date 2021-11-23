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
  const user = await knex("usuarios")
    .where({ id: idUsuario })
    .first()
    .debug();
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
  const user = await knex("usuarios")
    .update({
      nome: nome,
      email: email,
      senha: senha,
      cpf: cpf,
      telefone: telefone,
    })
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

module.exports = {
  emailIsValid,
  signUpNewUser,
  checkUserSignIn,
  checkUserById,
  updateRegisteredUser,
  signUpNewClient,
};
