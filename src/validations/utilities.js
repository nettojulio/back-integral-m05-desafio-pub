const knex = require("../connections/db_connections");

async function emailIsValid(emailUsuario, database) {
  const user = await knex(database)
    .where({ email: emailUsuario })
    .first()
    .debug();

  if (user) {
    throw new Error("Email já cadastrado");
  }
}

async function cpfIsValid(cpfCliente, database) {
  const user = await knex(database).where({ cpf: cpfCliente }).first().debug();

  if (user) {
    throw new Error("CPF já cadastrado");
  }
}

async function signUpNewUser(nomeUsuario, emailUsuario, senhaUsuario) {
  const user = await knex("usuarios")
    .insert({
      nome: nomeUsuario,
      email: emailUsuario,
      senha: senhaUsuario,
      cpf: "",
      telefone: "",
    })
    .returning("*");

  if (!user) {
    throw new Error("O usuário não foi cadastrado.");
  }

  return user;
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
      estado: estado && estado.toUpperCase(),
    })
    .returning("*");

  if (!client) {
    throw new Error("Cliente não cadastrado.");
  }

  return client;
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

async function checkClientById(idCliente) {
  const client = await knex("clientes")
    .where({ id: idCliente })
    .first()
    .debug();

  if (!client) {
    throw new Error("Cliente não encontrado!");
  }

  return client;
}

async function checkBillingById(idCobranca) {
  const billing = await knex("cobrancas")
    .where({ id: idCobranca })
    .first()
    .debug();

  if (!billing) {
    throw new Error("Cobrança não encontrada!");
  }

  return billing;
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

async function updateRegisteredClient(
  idCliente,
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
    .update({
      nome: nome,
      email: email,
      cpf: cpf,
      telefone: telefone,
      cep: cep,
      endereco: endereco,
      complemento: complemento,
      bairro: bairro,
      cidade: cidade,
      estado: estado && estado.toUpperCase(),
    })
    .where({ id: idCliente })
    .returning("*")
    .debug();

  if (!client) {
    throw new Error("Cliente não atualizado.");
  }

  return client[0];
}

async function updateRegisteredBillings(
  valor,
  data_vencimento,
  descricao,
  status,
  idCobranca
) {
  const billing = await knex("cobrancas")
    .update({
      valor: valor,
      data_vencimento: data_vencimento,
      descricao: descricao,
      status: status,
    })
    .where({ id: idCobranca })
    .returning("*")
    .debug();

  if (!billing) {
    throw new Error("Cobrança não atualizada.");
  }

  return billing[0];
}

async function getAllClients() {
  const clients = await knex("clientes")
    .select(
      "id",
      "nome",
      "email",
      "cpf",
      "telefone",
      "cep",
      "endereco",
      "complemento",
      "bairro",
      "cidade",
      "estado"
    )
    .returning("*")
    .debug();

  for (const client of clients) {
    const billings = await knex("cobrancas")
      .select("id", "valor", "data_vencimento", "descricao", "status")
      .returning("*")
      .where({ id_cliente: client.id })
      .debug();

    for (const billing of billings) {
      if (!billing.status) {
        billing.situacao =
          +new Date() - +new Date(billing.data_vencimento) < 84600000
            ? "Pendente"
            : "Vencida";
      } else {
        billing.situacao = "Paga";
      }
    }

    client.cobrancas = billings;

    client.status_cliente = client.cobrancas.some(
      (item) => item.situacao === "Vencida"
    )
      ? "Inadimplente"
      : "Em dia";
  }

  return clients;
}

async function getAllBillings() {
  const billings = await knex("cobrancas")
    .select(
      "id",
      "id_cliente",
      "valor",
      "data_vencimento",
      "descricao",
      "status"
    )
    .returning("*")
    .debug();

  for (const billing of billings) {
    if (!billing.status) {
      billing.situacao =
        +new Date() - +new Date(billing.data_vencimento) < 84600000
          ? "Pendente"
          : "Vencida";
    } else {
      billing.situacao = "Paga";
    }

    const clients = await knex("clientes")
      .select("nome")
      .returning("*")
      .where({ id: billing.id_cliente })
      .debug();
    billing.cliente = clients[0];
  }

  return billings;
}

async function addNewBillings(
  valor,
  data_vencimento,
  descricao,
  status,
  clientId
) {
  const billing = await knex("cobrancas")
    .insert({
      id_cliente: clientId,
      valor: valor,
      data_vencimento: data_vencimento,
      descricao: descricao,
      status: status,
    })
    .returning("*")
    .debug();

  if (!billing) {
    throw new Error("Cobrança não cadastrada.");
  }

  return billing[0];
}

async function deleteBillings(idCobranca, cobranca) {
  if (cobranca.status) {
    throw new Error("Não é peritida exclusão de cobranças pagas!");
  }

  if (+new Date(cobranca.data_vencimento) - +new Date() + 97200000 < 0) {
    throw new Error("Não é peritida exclusão de cobranças vencidas!");
  }

  const billing = await knex("cobrancas")
    .delete()
    .where({ id: idCobranca })
    .returning("*")
    .debug();

  if (!billing) {
    throw new Error("Cobrança não excluída.");
  }

  return billing;
}

/* SEM CONSULTAS AO DB */

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

async function zipCodeValidation(cep) {
  if (typeof cep !== "string" || cep.trim().length !== 8 || isNaN(cep)) {
    throw new Error("CEP inválido! CEP é composto por 8 números.");
  }
}

async function stateValidation(estado) {
  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RR",
    "RO",
    "RJ",
    "RN",
    "RS",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  if (
    typeof estado !== "string" ||
    estado.trim().length !== 2 ||
    !estados.find((item) => item === estado.toUpperCase())
  ) {
    throw new Error("Estado Inválido.");
  }
}

async function valuesValidation(valor) {
  if (
    isNaN(valor) ||
    Number(valor) % 1 !== 0 ||
    (typeof valor === "string" && !valor.trim())
  ) {
    throw new Error("Informe valores válidos.");
  }
}

async function dateValidation(data) {
  if (isNaN(+new Date(data))) {
    throw new Error("Data inválida!");
  }
}

async function descriptionValidation(descricao) {
  if (!descricao.trim()) {
    throw new Error("Descrição Inválida!");
  }
}

async function statusValidation(status) {
  if (typeof status !== "boolean") {
    throw new Error("Status Inválido!");
  }
}

module.exports = {
  emailIsValid,
  cpfIsValid,
  signUpNewUser,
  signUpNewClient,
  checkUserSignIn,
  checkUserById,
  checkClientById,
  checkBillingById,
  updateRegisteredUser,
  updateRegisteredClient,
  updateRegisteredBillings,
  getAllClients,
  getAllBillings,
  addNewBillings,
  deleteBillings,
  nameValidation,
  emailValidation,
  passwordValidation,
  cpfValidation,
  phoneValidation,
  zipCodeValidation,
  stateValidation,
  valuesValidation,
  dateValidation,
  descriptionValidation,
  statusValidation,
};
