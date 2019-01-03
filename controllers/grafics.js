'use strict'
const config = require('../config/config');
var requestJson = require('request-json');

var urlMlabRaiz = config.mlab_host+config.mlab_db+'/collections/';
var clienteMlab;


function getManagerReporting(req, res) {
  var idcliente = req.params.id;
  var queryStringID = 'q={"userID":' + idcliente + '}'
  var mesesReporte = '[["Fecha", "Ingresos", "Egresos"],' ;
  var stringReporte ="";
  var mlist = [ "January", "February", "March", "April", "May", "June", "July", "August", "Setiembre", "Octubre", "Noviembre", "Diciembre" ];
  var clienteMlab =  requestJson.createClient(urlMlabRaiz + config.mlab_collection_user+ '?' + queryStringID + "&l=1&" + config.mlab_key)
  clienteMlab.get(' ',
        function(error, respuestaMLab, body){
            var jsonStr = body[0].account;
            var ingresos = 0;
            var egresos = 0;
            var mesActual ;
            var mesTransfer ;
            var currentDate = new Date();
            mesActual = currentDate.getMonth()+1;

              if(typeof jsonStr == "undefined" ) {
                stringReporte = mesesReporte + '["'+ mlist[mesActual-1] +'",'+ingresos+','+egresos+']]';
              }
              else{
                    jsonStr.forEach(function(item, index){
                    ingresos += item.saldoInicial;
                      if(typeof item.transaction == "undefined"){
                        stringReporte = mesesReporte + '["'+ mlist[mesActual-1] +'",'+ingresos+','+egresos+']]';
                      }
                      else{
                        item.transaction.forEach(function(subitem, subindex){
                            mesTransfer = new Date(subitem.dateTransfer).getMonth() + 1 ;
                            if(subitem.typeOperation == 20 && mesTransfer == mesActual){
                                subitem.monto > 0 ? (ingresos += subitem.monto) : (egresos += subitem.monto *Number(-1));
                                stringReporte = mesesReporte+'["'+ mlist[mesTransfer-1] +'",'+ingresos+','+egresos+']]';
                            }
                            else {
                              stringReporte = mesesReporte + '["'+ mlist[mesActual-1] +'",'+ingresos+','+egresos+']]';
                            }
                        });
                      }
                });
              }
              res.send(JSON.parse(stringReporte));
        });
  }

module.exports={
  getManagerReporting
};
