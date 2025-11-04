FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend source code
COPY backend/src ./src

# Copy frontend files
COPY frontend ./frontend

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

