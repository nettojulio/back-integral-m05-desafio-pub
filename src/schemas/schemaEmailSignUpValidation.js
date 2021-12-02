const yup = require("./config");

const schemaEmailSignUpValidation = yup.object().shape({
  email: yup.string().trim().email().required()
});

module.exports = schemaEmailSignUpValidation;
