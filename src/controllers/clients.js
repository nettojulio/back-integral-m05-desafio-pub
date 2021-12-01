const utilities = require("../validations/utilities");

async function addClient(req, res) {
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    endereco,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;
  const { id } = req.user;

  try {
    await utilities.nameValidation(nome);
    await utilities.emailIsValid(email, "clientes");
    await utilities.emailValidation(email);
    await utilities.cpfIsValid(cpf, "clientes");
    await utilities.cpfValidation(cpf);
    await utilities.phoneValidation(telefone);

    if (cep) {
      await utilities.zipCodeValidation(cep);
    }

    if (estado) {
      await utilities.stateValidation(estado);
    }

    const client = await utilities.signUpNewClient(
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
    );

    return res.status(201).json(client[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function allClients(req, res) {
  try {
    const clients = await utilities.getAllClients();
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function editClient(req, res) {
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    endereco,
    complemento,
    bairro,
    cidade,
    estado,
  } = req.body;
  const { id: editUserId } = req.params;

  if (!nome && !email && !cpf && !telefone) {
    throw new Error ("É obrigatório informar ao menos um campo para atualização");
  }

  try {
    const prevClientData = await utilities.checkClientById(editUserId);
    await utilities.nameValidation(nome);

    if (prevClientData.email !== email) {
      await utilities.emailIsValid(email, "clientes");
    }

    await utilities.emailValidation(email);

    if (prevClientData.cpf !== cpf) {
      await utilities.cpfIsValid(cpf, "clientes");
    }

    await utilities.cpfValidation(cpf);
    await utilities.phoneValidation(telefone);

    if (cep) {
      await utilities.zipCodeValidation(cep);
    }

    if (estado) {
      await utilities.stateValidation(estado);
    }

    const client = await utilities.updateRegisteredClient(
      editUserId,
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
    );
    return res.status(200).json(client);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  addClient,
  allClients,
  editClient,
};
