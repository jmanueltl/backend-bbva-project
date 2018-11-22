'use strict'

const services=require('../services');

  function isAuth(req, res,next){
    //console.log(req.headers.authorization);
    if(!req.headers.authorization)
      return res.status(403).send({message:'No tienes autorizacion'});
      const token   = req.headers.authorization.split(" ")[0];
      console.log('aqui'+ req.headers.authorization);
      services.decodeToken(token)
        .then(response=>{
          req.user=response;
          next();
        })
        .catch(response=>{
          res.status(response.status).send(response.message);
        })
    }

module.exports={
isAuth
};
