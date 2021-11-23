const yup = require("./config");

const schemaSignInValidation = yup.object().shape({
    email: yup.string().trim().email().required(),
    senha: yup.string().trim().min(6).required()
});

module.exports = schemaSignInValidation;