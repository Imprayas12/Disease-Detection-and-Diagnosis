FROM node:21

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

FROM python:3.12-slim

# Install Python and pip
RUN apt-get update && \
    apt install -y python3-pip

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Expose the port on which your Node.js application will run
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
