#!/bin/sh
set -e
host="$1"
shift
echo "Waiting for RabbitMQ at $host:5672..."
until nc -z "$host" 5672; do
  echo "RabbitMQ not ready, sleeping 3 seconds..."
  sleep 3
done
echo "RabbitMQ is up!"
exec "$@"
