FROM node:20

WORKDIR /runner-backend

RUN apt-get update && \
    apt-get install -y python3 g++ default-jdk && \
    apt-get clean

COPY . .

RUN npm install

EXPOSE 5001

CMD ["node", "app.js"]
