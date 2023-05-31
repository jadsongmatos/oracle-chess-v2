FROM node:18.16.0-alpine AS build

WORKDIR /next

COPY . .

ENV NODE_ENV production

RUN yarn install
RUN npx prisma generate
RUN yarn build
RUN npm install pm2 -g
RUN apk update && apk add nginx

COPY nginx.conf /etc/nginx/nginx.conf


COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]