const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const membrosController = require('./src/controllers/membrosController');
const mensalidadeController = require('./src/controllers/mensalidadeController');

const {loginRequired} = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logOut);

// Rotas de Membros
route.get('/membros/index', loginRequired, membrosController.index);
route.post('/membros/register', loginRequired, membrosController.register);
route.get('/membros/index/:id', loginRequired, membrosController.editIndex);
route.post('/membros/edit/:id', loginRequired, membrosController.edit);
route.get('/membros/delete/:id', loginRequired, membrosController.delete);

// Rotas de Mensalidade
route.get('/mensalidade', mensalidadeController.index); 
route.post('/mensalidade/register', loginRequired, mensalidadeController.register);
route.get('/mensalidade/register', loginRequired, mensalidadeController.registerIndex);
route.get('/mensalidade/register/:id', loginRequired, mensalidadeController.editIndex); 
route.post('/mensalidade/edit/:id', loginRequired, mensalidadeController.edit);
route.get('/mensalidade/delete/:id', loginRequired, mensalidadeController.delete);
route.get('/mensalidade/filter', mensalidadeController.filter);

module.exports = route;
