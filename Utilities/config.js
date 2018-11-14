module.exports={
  port:process.env.PORT|| 3000,
  mlab_host:process.env.MLAB_HOST||'https://api.mlab.com/api/1/',
  mlab_db:process.env.MLAB_DB||'techupruebabbva/collections',
  mlab_key:process.env.MLAB_KEY||'apiKey=7is_G5cOfCdtAwvu0orSgkcxVnSFGPo6',
  mlab_collection_user:process.env.MLAB_COLLECTION_USER||'user',
  //mlab_collection_account:process.env.MLAB_COLLECTION_ACCOUNT||'account',
  //mlab_collection_movieent:process.env.MLAB_COLLECTION_MOVIEENT||'movieent',
  URLbase:process.env.URL_BASE||'/APIperu/v1/'
  //SECRET_TOKEN:'TechU2017'
}
