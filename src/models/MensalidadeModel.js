const mongoose = require('mongoose');
const validator = require('validator')

const MensalidadeSchema = new mongoose.Schema({
  nome: String,
  pagamento: String,
  mes: String,
  ano: Number
});

const MensalidadeModel = mongoose.model('Mensalidade', MensalidadeSchema);


function Mensalidade(body){
  this.body = body;
  this.errors = [];
  this.mensalidade = null;
}

//register
Mensalidade.prototype.register = async function() {
  this.valida();

  if (this.errors.length > 0) return;

  const normalizedMonth = this.body.mes.toLowerCase();

  const mesesCorrections = {
    "março": "Marco",
  };

  this.body.mes = mesesCorrections[normalizedMonth] || this.body.mes;

  this.mensalidade = await MensalidadeModel.create(this.body);
};


// Validação
Mensalidade.prototype.valida = function() {
  this.cleanUp();

  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('Email inválido');
  }
  if (!this.body.nome) {
    this.errors.push('Nome é um campo Obrigatório');
  }
};

Mensalidade.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    pagamento: this.body.pagamento,
    mes: this.body.mes,
    ano: this.body.ano,
  };
};

//Editar
Mensalidade.prototype.edit = async function (id) {
  if (typeof id !== 'string') return;
  this.valida();
  if (this.errors.length > 0) return;

  try {
    this.mensalidade = await MensalidadeModel.findByIdAndUpdate(id, this.body, { new: true });
  } catch (e) {
    console.error(e);
    this.errors.push('Erro ao atualizar a mensalidade.');
  }
};

//metodos estáticos 

//Busca por Id
Mensalidade.buscaPorId = async function(id){
  if(typeof id !== 'string') return;
  const mensalidade = await MensalidadeModel.findById(id);
  return mensalidade;
}

Mensalidade.buscaPorMensalidade = async function(){
  const mensalidade = await MensalidadeModel.find().sort({criadoEm: -1});
  return mensalidade;
}

Mensalidade.delete = async function(id){
  if(typeof id !== 'string') return;
  const mensalidade = await MensalidadeModel.findOneAndDelete({_id: id});
  return mensalidade;
}

Mensalidade.filterByAnoMes = async function(ano, mes) {
  try {
    if (!ano || !mes) throw new Error('Ano e mês são obrigatórios');

    const mesCorrigido = removeAcentos(mes);

    return await MensalidadeModel.find({
      ano: ano,
      mes: { $regex: new RegExp(`^${mesCorrigido}$`, 'i') } 
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const removeAcentos = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};


module.exports = Mensalidade;