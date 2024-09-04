const Membros = require("../models/MembrosModel");

exports.index = async(req, res) => {
  const membros = await Membros.buscaPorMembros();
  res.render('index', {membros})
}
