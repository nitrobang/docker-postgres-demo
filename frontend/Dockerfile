# Use official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Environment variables for hot reload inside Docker
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true
ENV WDS_SOCKET_PORT=3000

# Expose React dev server port
EXPOSE 3000
# 👇 Force React dev server to bind to 0.0.0.0
ENV REACT_APP_BACKEND_URL=http://localhost:5000
# Start React dev server
CMD ["npm", "start"]





