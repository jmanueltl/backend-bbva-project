'use strict'

const express=require('express');
const cors = require('cors');
const userController=require('../controllers/user');
const authController=require('../controllers/auth');
const accountController=require('../controllers/account');
const transactionController= require('../controllers/transaction');
const smsController = require('../controllers/sms');
const graficsController = require('../controllers/grafics');

const seg=require('../middleware');
const app = express.Router();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, user, admin_secret");
  next();
});

//accounts
app.get('/users/:id/accounts',seg.isAuth,accountController.getUserAccounts);
app.get('/users/:id/dropdownaccount',seg.isAuth,accountController.getAccountDropdown);
app.put('/users/:id/accounts',seg.isAuth,accountController.postUserAccounts);
app.delete('/users/:id/accounts/:idAccount',seg.isAuth,accountController.deleteUserAccounts); 

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

//SMS
app.post('/users/enviosms', seg.isAuth, smsController.postEnvioSMS);

//grafics
app.get('/users/:id/managereporting',seg.isAuth, graficsController.getManagerReporting);

//LOGIN
app.post('/login',authController.login);
app.post('/logout',authController.logout);

//TOKEN
app.get('/seg',seg.isAuth,function (req,res){
  res.status(200).send({message:'ACCESO OK'});
});
app.get('/',function (req,res){
  res.status(200).send({message:'BIENVENIDOS A NUESTRA API'});
});

module.exports=app;
