FROM node:16-slim

COPY . .

RUN npm i

RUN npm prisma:generate

RUN npm prisma:migrate:deploy

CMD ["npm", "run", "build"]