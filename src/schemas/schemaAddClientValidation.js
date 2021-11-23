const yup = require("./config");

const schemaAddClientValidation = yup.object().shape({
  nome: yup.string().trim().required(),
  email: yup.string().trim().email().required(),
  cpf: yup
    .string()
    .test("len", "cpf deve ser de 11 dígitos", (val) => val.length === 11),
  telefone: yup
    .string()
    .test("len", "telefone inválido", (val) => val.length >= 10),
});

module.exports = schemaAddClientValidation;
