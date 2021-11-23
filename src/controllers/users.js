const bcrypt = require("bcrypt");
const utilities = require("../validations/utilities");

async function currentUser(req, res) {
  return res.status(200).json(req.user);
}

async function userUpdate(req, res) {
  let { nome, email, senha, cpf, telefone } = req.body;
  const { id } = req.user;

  if (!nome && !email && !senha && !cpf && telefone) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização");
  }

  try {
    await utilities.checkUserById(id);

    if (nome !== req.user.nome) {
      await utilities.nameValidation(nome);
    }

    if (email !== req.user.email) {
      await utilities.emailIsValid(email, "usuarios");
      await utilities.emailValidation(email);
    }

    if (senha) {
      await utilities.passwordValidation(senha);
      senha = await bcrypt.hash(senha, 10);
    }

    if (cpf) {
      await utilities.cpfValidation(cpf);
    }
    
    if (telefone) {
      await utilities.phoneValidation(telefone);
    }
    
    await utilities.updateRegisteredUser(
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
