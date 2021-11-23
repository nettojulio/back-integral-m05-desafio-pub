const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("../token/authToken");
const utilities = require("../validations/utilities");
const schemaSignInValidation = require("../schemas/schemaSignInValidation");

async function signIn(req, res) {
  const { email, senha } = req.body;

  try {
    await schemaSignInValidation.validate(req.body);
    const usuario = await utilities.verificarUsuarioLogin(email);
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json("Email e/ou senha não confere!");
    }

    const token = jwt.sign({ id: usuario.id }, authToken, { expiresIn: "2h" });

    const { senha: _, ...dadosUsuario } = usuario;
    dadosUsuario.token = token;

    return res.status(200).json(dadosUsuario);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = { signIn };
