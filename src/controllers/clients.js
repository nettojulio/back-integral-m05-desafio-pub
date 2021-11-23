const schemaAddClientValidation = require("../schemas/schemaAddClientValidation");
const utilities = require("../validations/utilities");

const addClient = async (req, res) => {
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
    await schemaAddClientValidation.validate(req.body);
    await utilities.emailIsValid(email, "clientes");

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
};

module.exports = {
  addClient,
};
