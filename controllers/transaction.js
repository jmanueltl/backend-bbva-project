'use strict'

var bodyParser = require('body-parser');
var requestJson = require('request-json')
const config = require('../config/config');
var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
var clienteMlab;


function postAccountTransaction(req, res) {
  var idcliente = req.params.id;
  var queryStringID = 'q={"userID":' + idcliente + '}'
  req.body;
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
            var jsonStr = body[0].account;
            var obj1 = {
              "monto": Number(req.body.monto).toFixed(2) * Number(-1.00).toFixed(2),
              "description": req.body.description,
              "dateTransfer": req.body.dateTransfer,
              "typeOperation": req.body.typeOperation,
            	"nameOperation": req.body.nameOperation,
              "operation": req.body.operation,
            	"accountOrigin": req.body.accountOrigin,
            	"accountDestination": req.body.accountDestination,
            	"moneda" : req.body.moneda,
            	"email": req.body.email
            };

            var obj2 = {
              "monto": Number(req.body.monto).toFixed(2) * Number(1.00).toFixed(2),
              "description": req.body.description,
              "dateTransfer": req.body.dateTransfer,
              "typeOperation": req.body.typeOperation,
            	"nameOperation": req.body.nameOperation,
              "operation": req.body.operation,
            	"accountOrigin": req.body.accountOrigin,
            	"accountDestination": req.body.accountDestination,
            	"moneda" : req.body.moneda,
            	"email": req.body.email
            };

            forEachAccount(jsonStr,obj1.accountOrigin,obj1);
            forEachAccount(jsonStr,obj2.accountDestination,obj2);
            var newAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr)+'}}';
            clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(newAccount),
              function(error, respuestaMLab, body){
                  res.send(body);
              });
        });
}


function forEachAccount(jsonStr, account, obj){
  var newID = 0;
  jsonStr.forEach(function(item, index){
      if(item.nroAccount == account){
          item.saldo = Number(item.saldo) + Number(obj.monto);
          if(item.transaction === undefined || item.transaction === []){
            newID = 1;
            item.transaction = []
          }
          else
            {newID = Math.max.apply(Math, item.transaction.map(function(o) {  return o.idTransaction; })) + 1;}
            //console.log(newID);
          obj.idTransaction = newID;
          item.transaction.push(obj);
      }
  });
}


function deleteAccountTransaction(req, res) {
  var idcliente = req.params.id
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
            var newID;
            var jsonStr = body[0].account;
            var idAccount = req.params.idAccount;
            var idTransaction = req.params.idTransaction;
            jsonStr.forEach(function(item, index){
              	if(item.idAccount == idAccount){
                    findAndRemove(item.transaction, 'idTransaction', parseInt(idTransaction,10));
                    console.log(item.transaction);
              	}
            });
            console.log(jsonStr);
            var deleteAccount = '{"$set": {"account":'+ JSON.stringify(jsonStr)+'}}';
            clienteMlab.put( urlMlabRaiz +'/user?'+ queryStringID + "&" +config.mlab_key , JSON.parse(deleteAccount),
              function(error, respuestaMLab, body){
                  res.send(body);
              });

        });
}

function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      array.splice(index, 1);
    }
  });
}

module.exports={
  postAccountTransaction,
  deleteAccountTransaction
};
