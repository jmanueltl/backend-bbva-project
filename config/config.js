module.exports={
  port:process.env.PORT|| 4000,
  mlab_host:process.env.MLAB_HOST||'https://api.mlab.com/api/1/databases/',
  mlab_db:process.env.MLAB_DB||'techupruebabbva',
  mlab_key:process.env.MLAB_KEY||'apiKey=7is_G5cOfCdtAwvu0orSgkcxVnSFGPo6',
  //'apiKey=B7MjpzWQ-YUoiPGR-u5aEQrbk7Q0_MaT',
  mlab_collection_user:process.env.MLAB_COLLECTION_USER||'user',
  URLbase:process.env.URL_BASE||'/APIperu/v1/',
  SECRET_TOKEN:'TechU2018'
}
