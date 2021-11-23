const bcrypt = require("bcrypt");
const utilities = require("../validations/utilities");

async function currentUser(req, res) {
  return res.status(200).json(req.usuario);
}

async function userUpdate(req, res) {
  let { nome, email, senha, cpf, telefone } = req.body;
  const { id } = req.usuario;

  if (!nome && !email && !senha && !cpf && telefone) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização");
  }

  try {
    await utilities.verificarUsuarioPeloId(id);

    if (senha) {
      senha = await bcrypt.hash(senha, 10);
    }

    if (email !== req.usuario.email) {
      await utilities.validarEmail(email, "usuarios");
    }

    await utilities.atualizarUsuarioExistente(
      nome,
      email,
      senha,
      cpf,
      telefone,
      id
    );

    return res.status(200).json("Usuario foi atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = { currentUser, userUpdate };
