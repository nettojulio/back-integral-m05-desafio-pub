const bcrypt = require("bcrypt");
const utilities = require("../validations/utilities");
const schemaSignUpValidation = require("../schemas/schemaSignUpValidation");

const signUp = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await schemaSignUpValidation.validate(req.body);
    await utilities.validarEmail(email, "usuarios");

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await utilities.cadastrarNovoUsuario(
      nome,
      email,
      senhaCriptografada
    );
    const { senha: _, ...sendUser } = usuario[0];

    return res.status(200).json(sendUser);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  signUp,
};
