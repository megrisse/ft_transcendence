FROM node:16-slim

COPY . .

RUN npm i

RUN npx prisma db push

CMD ["npm", "run", "build"]