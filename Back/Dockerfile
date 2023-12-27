FROM node:17

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npx prisma db push

CMD ["npm", "run", "build"]