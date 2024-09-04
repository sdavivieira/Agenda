const mongoose = require('mongoose');
const validator = require('validator')

const MembrosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: {type: String, required: false, default: ''},
  email: {type: String,  required: false, default: ''},
  telefone: {type: String,  required: false, default: ''},
  criadoEm: {type: Date, default: Date.now}
});

const MembrosModel = mongoose.model('Membros', MembrosSchema);


function Membros(body){
  this.body = body;
  this.errors = [];
  this.membros = null;
}

//registro
Membros.prototype.register = async function(){
  this.valida();

  if(this.errors.length > 0) return;

  this.membros = await MembrosModel.create(this.body)

}

// Validação
Membros.prototype.valida = function() {
  this.cleanUp();

  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('Email inválido');
  }
  if (!this.body.nome) {
    this.errors.push('Nome é um campo Obrigatório');
  }
};

Membros.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    descricao: this.body.descricao,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

//Editar
Membros.prototype.edit = async function (id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.membros = await MembrosModel.findByIdAndUpdate(id, this.body, {new: true});
}

//metodos estáticos 

//Busca por Id
Membros.buscaPorId = async function(id){
  if(typeof id !== 'string') return;
  const membro = await MembrosModel.findById(id);
  return membro;
}

Membros.buscaPorMembros = async function(){
  const membros = await MembrosModel.find().sort({criadoEm: -1});
  return membros;
}

Membros.delete = async function(id){
  if(typeof id !== 'string') return;
  const membro = await MembrosModel.findOneAndDelete({_id: id});
  return membro;
}
Membros.buscaPorNomeMembros = async function() {
  try {
    const membros = await MembrosModel.find({}, 'nome').sort({ nome: 1 }); // Ordenado por nome
    return membros;
  } catch (error) {
    console.error("Erro ao buscar membros por nome:", error);
    throw error;
  }
};

module.exports = Membros;