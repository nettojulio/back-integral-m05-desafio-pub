const utilities = require("../validations/utilities");

async function addBillings(req, res) {
  const { valor, data_vencimento, descricao, status } = req.body;
  const { id: clientId } = req.params;

  if (!valor || !data_vencimento || !descricao) {
    return res.status(400).json("Favor preencher os campos.");
  }

  try {
    await utilities.checkClientById(clientId);
    await utilities.valuesValidation(valor);
    await utilities.dateValidation(data_vencimento);
    await utilities.descriptionValidation(descricao);
    await utilities.statusValidation(status);

    const billing = await utilities.addNewBillings(
      valor,
      data_vencimento,
      descricao,
      status,
      clientId
    );
    return res.status(201).json(billing);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function allBillings(req, res) {
  try {
    const billings = await utilities.getAllBillings();
    return res.status(200).json(billings);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function editBillings(req, res) {
  const { valor, data_vencimento, descricao, status } = req.body;
  const { id: billingId } = req.params;

  if (!valor || !data_vencimento || !descricao) {
    return res.status(400).json("Favor preencher os campos.");
  }

  try {
    await utilities.checkBillingById(billingId);
    await utilities.valuesValidation(valor);
    await utilities.dateValidation(data_vencimento);
    await utilities.descriptionValidation(descricao);
    await utilities.statusValidation(status);

    const billing = await utilities.updateRegisteredBillings(
      valor,
      data_vencimento,
      descricao,
      status,
      billingId
    );
    return res.status(200).json(billing);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

async function deleteBillings(req, res) {
  const { id: billingId } = req.params;

  try {
    const billing = await utilities.checkBillingById(billingId);
    const deleleBilling = await utilities.deleteBillings(billingId, billing)
    res.status(200).json(deleleBilling);
  } catch (error) {
    res.status(400).json(error.message);
  }
}

module.exports = {
  addBillings,
  allBillings,
  editBillings,
  deleteBillings,
};
