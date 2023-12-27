FROM node:18

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x script.sh

# RUN npx prisma generate

# RUN npx prisma db push

CMD ["sh", "./script.sh"]