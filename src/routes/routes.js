const express = require("express");
const { signUp } = require("../controllers/signUp");
const { signIn } = require("../controllers/signIn");
const { authentication } = require("../middlewares/authentication");
const { currentUser, userUpdate } = require("../controllers/users");
const { addClient, allClients } = require("../controllers/clients");

const routes = express();

routes.post("/cadastro", signUp);
routes.post("/login", signIn);

routes.use(authentication);

routes.get("/usuario", currentUser);
routes.put("/usuario", userUpdate);

routes.post("/clientes", addClient);
routes.get("/clientes", allClients);

module.exports = routes;
