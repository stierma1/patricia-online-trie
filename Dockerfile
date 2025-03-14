# Use the official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY . .
RUN npm install

# Expose the port the app runs on
EXPOSE 8882

# Define default command to run the app (allows overriding with args)
CMD ["node", "server.js"]