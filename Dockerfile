FROM node:alpine AS BUILD_IMAGE

WORKDIR /usr/src/raptor

COPY package.json ./

RUN npm install

COPY . .

# remove dev dependencies
RUN npm run build

FROM node:alpine
WORKDIR /usr/src/raptor
COPY package.json ./
RUN npm install --production
COPY --from=BUILD_IMAGE /usr/src/raptor/dist ./dist

CMD [ "node", "dist/index.js" ]
