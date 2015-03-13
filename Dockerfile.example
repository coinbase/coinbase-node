#
# this Dockerfile is to help debug against different node environments
#
# docker build -t YOUR_USER/coinbase-node .
# docker run -it YOUR_USER/coinbase-node
#
FROM node:0.10
#FROM node:0.11
#FROM node:0.12

ADD lib /app/lib
ADD test /app/test
ADD *.js /app/
ADD package.json /app/
RUN cd /app && npm install
CMD cd /app && npm test

