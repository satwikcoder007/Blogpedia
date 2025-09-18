FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Copy wait-for-RabbitMQ script
COPY wait-for-rabbit.sh /wait-for-rabbit.sh
RUN chmod +x /wait-for-rabbit.sh

EXPOSE 8001

# Wait for RabbitMQ, then start the app
CMD ["/wait-for-rabbit.sh", "rabbitmq", "npm", "run", "dev"]
# For production, use:
# CMD ["/wait-for-rabbit.sh", "rabbitmq", "npm", "start"]
