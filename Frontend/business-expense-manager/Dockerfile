FROM node

# set working directory
#RUN mkdir src/app
WORKDIR /src/app

ENV PATH src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /src/app/package.json

RUN npm install -g @angular/cli

RUN npm install

# add app
COPY . /src/app

EXPOSE 4200

# start app
CMD ["ng", "serve", "--host", "0.0.0.0"]
