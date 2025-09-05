FROM node:18
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# 👇 Force React dev server to bind to 0.0.0.0
ENV REACT_APP_BACKEND_URL=http://localhost:5000


CMD ["npm", "start"]
