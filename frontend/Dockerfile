FROM node:latest

WORKDIR /usr/app
COPY . .
RUN npm install
EXPOSE 5173
RUN ["chmod", "+x", "./start.sh"]

ENTRYPOINT [ "./start.sh"]