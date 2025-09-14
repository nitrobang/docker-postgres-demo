FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (works even if dev deps don’t mount correctly)
RUN npm install -g nodemon

# Copy rest of code
COPY . .

# Expose backend port
EXPOSE 5000

# Run with nodemon
CMD ["nodemon", "--legacy-watch", "server.js"]