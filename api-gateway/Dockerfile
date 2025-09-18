# Dockerfile
FROM nginx:alpine

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone \
    && apk del tzdata
    

RUN rm /etc/nginx/conf.d/default.conf

COPY app.conf /etc/nginx/conf.d/app.conf

EXPOSE 80