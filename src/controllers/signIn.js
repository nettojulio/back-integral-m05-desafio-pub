const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authToken = require("../token/authToken");
const utilities = require("../validations/utilities");
const schemaSignInValidation = require("../schemas/schemaSignInValidation");

async function signIn(req, res) {
  const { email, senha } = req.body;

  try {
    await schemaSignInValidation.validate(req.body);
    const user = await utilities.checkUserSignIn(email);
    const correctPassword = await bcrypt.compare(senha, user.senha);

    if (!correctPassword) {
      return res.status(400).json("Email e/ou senha não confere!");
    }

    const token = jwt.sign({ id: user.id }, authToken, { expiresIn: "2h" });

    const { senha: _, ...userData } = user;
    userData.token = token;

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = { signIn };
