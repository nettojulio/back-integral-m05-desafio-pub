const yup = require('./config');

const schemaSignUpValidation = yup.object().shape({
    nome: yup.string().trim().required(),
    email: yup.string().trim().email().required(),
    senha: yup.string().trim().min(6).required()
});

module.exports = schemaSignUpValidation;