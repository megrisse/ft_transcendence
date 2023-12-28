FROM node:17

COPY package*.json ./

COPY . .

RUN npm i

CMD ["npm", "run", "dev"]