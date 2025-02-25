# Étape 1 : Build de l'application
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur statique avec nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




## Utiliser l'image de Node.js comme image de base
#FROM node:18-alpine
#
## Définir le répertoire de travail dans le conteneur
#WORKDIR /app
#
## Copier package.json et package-lock.json (ou yarn.lock si tu utilises Yarn)
#COPY package*.json ./
#
## Installer les dépendances
#RUN npm install
#
## Copier tous les fichiers du projet dans le répertoire de travail du conteneur
#COPY . .
#
## Build de l'application
#RUN npm run build
#
## Exposer le port sur lequel l'application va tourner
##EXPOSE 3000
#EXPOSE 4173
#
## Lancer l'application avec Vite
#CMD ["npm", "run", "preview"]
