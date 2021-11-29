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
    await utilities.cpfIsValid(cpf, "clientes");
    await utilities.emailValidation(email);
    await utilities.cpfValidation(cpf);
    await utilities.phoneValidation(telefone);

    if (cep) {
      await utilities.cepValidation(cep);
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

    return res.status(200).json(client[0]);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  addClient,
};
