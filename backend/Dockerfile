FROM node:latest

WORKDIR /usr/app
COPY . .
RUN npm install
EXPOSE 8080
RUN npm install -g dotenv-cli
RUN npx prisma generate
RUN ["chmod", "+x", "./start.sh"]

ENTRYPOINT [ "./start.sh"]
