'use strict'

const express=require('express');
const cors = require('cors');
const userController=require('../controllers/user');
const authController=require('../controllers/auth');
const accountController=require('../controllers/account');
const transactionController= require('../controllers/transaction');

const seg=require('../middleware');
const app = express.Router();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//accounts
app.get('/users/:id/accounts',seg.isAuth,accountController.getUserAccounts);
app.get('/users/:id/dropdownaccount',seg.isAuth,accountController.getAccountDropdown);
app.put('/users/:id/accounts',seg.isAuth,accountController.postUserAccounts);
app.delete('/users/:id/accounts/:idAccount',seg.isAuth,accountController.deleteUserAccounts); //falta usar

//users
app.get('/users/:id',seg.isAuth,userController.getUsersId);
app.get('/users',seg.isAuth,userController.getUsers);
app.post('/users',userController.postUser);
app.put('/users/:id',seg.isAuth,userController.updateUser);
app.delete('/users/:id',seg.isAuth,userController.deleteUser);

//transaction
app.put('/users/:id/transaction',seg.isAuth,transactionController.postAccountTransaction);
app.delete('/users/:id/accounts/:idAccount/transaction/:idTransaction',seg.isAuth,transactionController.deleteAccountTransaction);
app.put('/transactionaccount',seg.isAuth,transactionController.getAccountUserTx);
/*
api.get('/users/:id',seg.isAuth,userController.getUser);
api.get('/users/:id/accounts',seg.isAuth,userController.getUserAccounts);
api.get('/users/:id/accounts/:IBAN',seg.isAuth,userController.getUserAccount);
api.get('/users/:id/accounts/:IBAN/movements',seg.isAuth,userController.getUserAccountMovs);
api.get('/users/:id/accounts/:IBAN/movements/:id_mov',seg.isAuth,userController.getUserAccountMov);
api.post('/users',seg.isAuth,userController.saveUser);
api.put('/users/:id',seg.isAuth,userController.updateUser);
api.delete('/users/:id',seg.isAuth,userController.removeUser);
*/
//LOGIN
app.post('/login',authController.login);
app.post('/logout',authController.logout);
/*
//ACCOUNTS
api.get('/accounts',seg.isAuth,accountController.getAccounts);
api.get('/accounts/:id',seg.isAuth,accountController.getAccount);
//MOVIEENTS
api.get('/movements',seg.isAuth,movieentController.getMovieents);
api.get('/movements/:id',seg.isAuth,movieentController.getMovieent);
*/
//TOKEN
app.get('/seg',seg.isAuth,function (req,res){
  res.status(200).send({message:'ACCESO OK'});
});
app.get('/',function (req,res){
  res.status(200).send({message:'BIENVENIDOS A NUESTRA API'});
});

module.exports=app;
