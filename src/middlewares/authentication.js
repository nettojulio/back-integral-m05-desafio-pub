const jwt = require("jsonwebtoken");
const authToken = require("../token/authToken");
const knex = require("../connections/db_connections");

async function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();
    const { id } = jwt.verify(token, authToken);
    const usuarioExiste = await knex("usuarios").where({ id }).first();

    if (!usuarioExiste) {
      return res.status(404).json("Usuario não encontrado");
    }

    const { senha: _, ...usuario } = usuarioExiste;

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = { authentication };
