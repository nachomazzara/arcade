FROM node:8.9.3

RUN apt-get update
RUN apt-get install libcairo2-dev
RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm start