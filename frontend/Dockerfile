FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install web-vitals

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
