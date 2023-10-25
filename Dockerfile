# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install your project's dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Expose the port your application will run on (if applicable)
EXPOSE 3000

# Define the command to start your application
CMD ["yarn", "start"]