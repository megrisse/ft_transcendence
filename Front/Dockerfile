FROM node:18

WORKDIR /Front

COPY package*.json ./

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "start"]