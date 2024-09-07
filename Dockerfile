# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Install @nestjs/cli globally
RUN pnpm add -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]