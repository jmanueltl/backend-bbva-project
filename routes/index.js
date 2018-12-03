'use strict'

const express=require('express');
const cors = require('cors');
const userController=require('../controllers/user');
const authController=require('../controllers/auth');
const accountController=require('../controllers/account');

const seg=require('../middleware');
const api = express.Router();

api.use(cors());

api.get('/users',seg.isAuth,userController.getUsers);
api.get('/users/:id',seg.isAuth,userController.getUsersId);

//accounts
api.get('/users/:id/accounts',seg.isAuth,accountController.getUserAccounts);
api.put('/users/:id/accounts',seg.isAuth,accountController.postUserAccounts);
api.delete('/users/:id/accounts/:idAccount',seg.isAuth,accountController.deleteUserAccounts);

//users
api.post('/users',userController.postUser);
api.put('/users/:id',seg.isAuth,userController.updateUser);
api.delete('/users/:id',seg.isAuth,userController.deleteUser);
//USERS
//api.get('/',{message:'BIENVENIDO A NUESTRA API'});
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
api.post('/login',authController.login);
api.post('/logout',authController.logout);
/*
//ACCOUNTS
api.get('/accounts',seg.isAuth,accountController.getAccounts);
api.get('/accounts/:id',seg.isAuth,accountController.getAccount);
//MOVIEENTS
api.get('/movements',seg.isAuth,movieentController.getMovieents);
api.get('/movements/:id',seg.isAuth,movieentController.getMovieent);
*/
//TOKEN
api.get('/seg',seg.isAuth,function (req,res){
  res.status(200).send({message:'ACCESO OK'});
});
api.get('/',function (req,res){
  res.status(200).send({message:'BIENVENIDOS A NUESTRA API'});
});

module.exports=api;
