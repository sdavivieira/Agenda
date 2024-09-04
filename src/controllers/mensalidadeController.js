const Mensalidade = require("../models/MensalidadeModel");
const Membros = require('../models/MembrosModel');

exports.index = async function(req, res) {
  try {
    const mensalidades = await Mensalidade.buscaPorMensalidade();

    res.render('mensalidade', {
      mensalidade: mensalidades, 
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    });
  } catch (e) {
    console.log(e);
    res.render('404');
  }
};

exports.registerIndex = async function(req, res) {
  const membros = await Membros.buscaPorNomeMembros(); 
  res.render('register', { membros, mensalidade: {} }); 
};

exports.register = async function (req, res) {
  try {
    const mensalidade = new Mensalidade(req.body);
    await mensalidade.register();
  
    if (mensalidade.errors.length > 0) {
      req.flash('errors', mensalidade.errors);
      req.session.save(() => res.redirect('/mensalidade'));
      return;
    }
  
    req.flash('success', 'Mensalidade registrada com sucesso!');
    req.session.save(() => res.redirect(`/mensalidade/register/${mensalidade.mensalidade._id}`));
    return;
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
}

exports.editIndex = async function (req, res){
  if(!req.params.id) return res.render('404');
  const mensalidade = await Mensalidade.buscaPorId(req.params.id);

  if(!mensalidade)  return res.render('404');

  res.render('register', {mensalidade});
}


exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render('404');
    const mensalidade = new Mensalidade(req.body);
    await mensalidade.edit(req.params.id);
  
    if (mensalidade.errors.length > 0) {
      req.flash('errors', mensalidade.errors);
      req.session.save(() => res.redirect(`/mensalidade/edit/${req.params.id}`));
      return;
    }
  
    req.flash('success', 'Mensalidade editada com sucesso!');
    req.session.save(() => res.redirect(`/mensalidade/register/${mensalidade.mensalidade._id}`));
    return;
  } catch (e) {
    console.log(e);
    res.render('404');
  }
}

exports.delete = async function (req, res) {
  if (!req.params.id) return res.render('404');

  const mensalidade = await Mensalidade.delete(req.params.id);
  if (!mensalidade) return res.render('404');

  req.flash('success', 'Mensalidade apagada com sucesso!');
  req.session.save(() => res.redirect('/mensalidade'));
  return;
}

exports.filter = async function(req, res) {
  try {
    const ano = parseInt(req.query.year, 10);
    const mes = req.query.month;  

    if (isNaN(ano) || !mes) {
      req.flash('errors', ['Ano e mês devem ser fornecidos corretamente']);
      req.session.save(() => res.redirect('/mensalidades'));
      return;
    }

    const mensalidades = await Mensalidade.filterByAnoMes(ano, mes);

    res.render('mensalidade', {
      mensalidade: mensalidades,
      currentYear: ano,
      currentMonth: mes
    });
  } catch (e) {
    console.log(e);
    req.flash('errors', ['Erro ao filtrar mensalidades']);
    req.session.save(() => res.redirect('/mensalidades'));
  }
};