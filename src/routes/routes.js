const express = require("express");
const { preload, signUp } = require("../controllers/signUp");
const { signIn } = require("../controllers/signIn");
const { authentication } = require("../middlewares/authentication");
const { currentUser, editUser } = require("../controllers/users");
const { addClient, allClients, editClient } = require("../controllers/clients");
const { addBillings, allBillings, editBillings, deleteBillings } = require("../controllers/billings");

const routes = express();

routes.post("/preload", preload);
routes.post("/cadastro", signUp);
routes.post("/login", signIn);

routes.use(authentication);

routes.get("/usuario", currentUser);
routes.put("/usuario", editUser);

routes.post("/clientes", addClient);
routes.get("/clientes", allClients);
routes.put("/clientes/:id", editClient);

routes.post("/cobrancas/:id", addBillings);
routes.get("/cobrancas", allBillings);
routes.put("/cobrancas/:id", editBillings);
routes.delete("/cobrancas/:id", deleteBillings);

module.exports = routes;
