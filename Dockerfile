# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose the port (uses env)
EXPOSE ${API_LISTENING_PORT}

# Start the server
CMD ["node", "server.js"]
