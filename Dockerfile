## This is experimental and far from ideal, a much better way would
## be to run the yarn build and serve the content using nginx for instance
## however the production build breaks as soon as a reference to 
## setprotocol.js is added, causing TSC to run out of memory trying to 
## compile the build. One might need to eject and manually tune webpack 😢

# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts -g

# start app
CMD ["npm", "start"]