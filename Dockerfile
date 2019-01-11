# Imagen docker base inicial
FROM node:latest

# Crear directorio de trabajo del contenedor
WORKDIR /docker-api

# Copiar archivos del proyecto en directorio de docker
ADD . /docker-api

# Instalar dependencias del proyecto en producción
# RUN npm install 
#

 # Puerto donde expondremos nuestro contenedor (mismo que definimos en nuestra API)
 EXPOSE 4000

# Lanzar la aplicación (appe.js)
CMD ["npm","run","pro"]
