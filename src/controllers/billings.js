const utilities = require("../validations/utilities");

async function addBillings(req, res) {
  const { valor, data_vencimento, descricao, status } = req.body;
  const {id: clientId} = req.params;


  if (!valor || !data_vencimento || !descricao) {
    return res.status(400).json("Favor preencher os campos.");
  }

  try {
      await utilities.checkClientById(clientId);
      await utilities.valuesValidation(valor);
      await utilities.dateValidation(data_vencimento);
      await utilities.descriptionValidation(descricao);
      await utilities.statusValidation(status);

      const billing = await utilities.addNewBillings(valor, data_vencimento, descricao, status, clientId)

    return res.json(billing);
  } catch (error) {
    return res.json(error.message);
  }
}

async function allBillings(req, res){
    try {
        const billings = await utilities.getAllBillings();
        return res.json(billings);
      } catch (error) {
        return res.status(400).json(error.message);
      }
}

module.exports = {
  addBillings,
  allBillings,
};
