FROM node:18

WORKDIR /Back

COPY package*.json ./

COPY . .

RUN npm i

RUN chmod +x script.sh

CMD ["sh", "./script.sh"]