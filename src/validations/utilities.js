const knex = require("../connections/db_connections");

async function validarEmail(emailUsuario, database) {
  const usuario = await knex(database)
    .where({ email: emailUsuario })
    .first()
    .debug();
  if (usuario) {
    throw new Error("O email já existe!");
  }
}

async function cadastrarNovoUsuario(nomeUsuario, emailUsuario, senhaUsuario) {
  const usuario = await knex("usuarios")
    .insert({
      nome: nomeUsuario,
      email: emailUsuario,
      senha: senhaUsuario,
    })
    .returning("*");

  if (!usuario) {
    throw new Error("O usuário não foi cadastrado.");
  }

  return usuario;
}

async function verificarUsuarioLogin(emailUsuario) {
  const usuario = await knex("usuarios")
    .where({ email: emailUsuario })
    .first()
    .debug();
  if (!usuario) {
    throw new Error("Email e/ou senha não confere!");
  }
  return usuario;
}

async function verificarUsuarioPeloId(idUsuario) {
  const usuario = await knex("usuarios")
    .where({ id: idUsuario })
    .first()
    .debug();
  if (!usuario) {
    throw new Error("Usuario não encontrado!");
  }
  return usuario;
}

async function atualizarUsuarioExistente(
  nome,
  email,
  senha,
  cpf,
  telefone,
  idUsuario
) {
  const usuario = await knex("usuarios")
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

  if (!usuario) {
    throw new Error("O usuario não foi atualizado!");
  }

  return usuario[0];
}

async function cadastrarNovoCliente(
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
  const cliente = await knex("clientes")
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

  if (!cliente) {
    throw new Error("Cliente não cadastrado.");
  }

  return cliente;
}

module.exports = {
  validarEmail,
  cadastrarNovoUsuario,
  verificarUsuarioLogin,
  verificarUsuarioPeloId,
  atualizarUsuarioExistente,
  cadastrarNovoCliente,
};
