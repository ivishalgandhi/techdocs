FROM node:22-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to serve static content
# CMD ["serve", "-s", "/app/build", "-l", "3000", "--host", "0.0.0.0"]
CMD ["serve", "-s", "/app/build"]
