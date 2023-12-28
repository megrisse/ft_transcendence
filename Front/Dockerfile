FROM node:18

WORKDIR /Front

COPY package*.json ./

COPY . .

RUN npm i

CMD ["npm", "run", "dev"]