FROM node:14-slim
WORKDIR /srv

COPY . .
RUN npm install && npm run build
RUN rm -rf ./node-modules
CMD npm run start
