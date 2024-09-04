const Membros = require("../models/MembrosModel")

exports.index = function(req, res){
  res.render('membros', {
    membro: {}
  })
}

exports.register = async function (req, res) {
  try{
    const membro = new Membros(req.body)
    await membro.register();
  
    if(membro.errors.length > 0){
      req.flash('errors', 'membro.errors');
      req.session.save(() => res.redirect('/membros/index'));
      return;
    }
  
    req.flash('success', 'Membro registrado com sucesso!');
    req.session.save(() => res.redirect(`/membros/index/${membro.membros._id}`));
    return;
  } catch(e){
    console.log(e)
    return res.render('404');
  }
}
exports.editIndex = async function (req, res){
  if(!req.params.id) return res.render('404');
  const membro = await Membros.buscaPorId(req.params.id);

  if(!membro)  return res.render('404');

  res.render('membros', {membro});
}

exports.edit = async function (req, res) {
  try{

    if(!req.params.id) return res.render('404');
    const membro = new Membros(req.body);
    await membro.edit(req.params.id);
  
    if(membro.errors.length > 0){
      req.flash('errors', 'membro.errors');
      req.session.save(() => res.redirect('/membros/index'));
      return;
    }
  
    req.flash('success', 'Membro editado com sucesso!');
    req.session.save(() => res.redirect(`/membros/index/${membro.membros._id}`));
    return;
  } catch (e){
    console.log(e);
    res.render('404')
  }
}

exports.delete = async function (req, res) {
  if(!req.params.id) return res.render('404');

  const membro = await Membros.delete(req.params.id);
  if(!membro)  return res.render('404');

  req.flash('success', 'Membro apagado com sucesso!');
  req.session.save(() => res.redirect('/'));
  return;
}