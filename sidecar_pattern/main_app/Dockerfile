FROM node:20-alpine

WORKDIR /app

# Use shell form to allow chaining commands; expect repo mounted at /repo
CMD sh -c "cd /repo/sidecar_pattern/main_app && npm install && npm run dev"

EXPOSE 3000