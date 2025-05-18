# Tech Documentation Website

This website is built using [Docusaurus](https://docusaurus.io/) v3.7.0, a modern static website generator.

## Prerequisites

- **Node.js**: Version 18.0 or higher is required (package.json specifies `"node": ">=18.0"`) - this project uses v22.15.1
- **Package Manager**: npm or yarn

## Setup Instructions

### 1. Node.js Installation (with nvm)

Using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) is recommended for managing Node.js versions:

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Set up nvm in your shell profile (~/.zshrc or ~/.bash_profile)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Install and use Node.js
nvm install 22   # or any newer version like 22.15.1 used in this project
nvm use 22
```

### 2. Installation of Dependencies

Use npm:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn
```

### 3. Local Development

Start the development server:

```bash
npm start
```

Or with yarn:

```bash
yarn start
```

To make your site accessible from other devices on your network, use:

```bash
npm start -- --host 0.0.0.0
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### 4. Build

Generate a static build:

```bash
npm run build
```

Or with yarn:

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### 5. Serve Built Website Locally

To preview the build locally:

```bash
npm run serve
```

Or with yarn:

```bash
yarn serve
```

To make your production build accessible from other devices on your network:

```bash
npm run serve -- --host 0.0.0.0
```

You can also specify a custom port if needed:

```bash
npm run serve -- --host 0.0.0.0 --port 8000
```

### 6. Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Docker Deployment

You can also run the Docusaurus site as a Docker container while using the build directory from your local filesystem:

### 1. Build your site first

```bash
npm run build
```

### 2. Using Docker Directly

Build and run the Docker container:

```bash
# Build the Docker image
docker build -t techdocs .

# Run the container with a volume mount to your local build directory
# The 0.0.0.0 binds to all network interfaces, making the site accessible from other devices
docker run -p 0.0.0.0:3000:3000 -v "$(pwd)/build:/app/build" techdocs
```

### 3. Using Docker Compose (Recommended)

```bash
# Build the container (add --no-cache to rebuild from scratch)
docker compose build

# Start the container
docker compose up -d

# View logs
docker container logs techdocs-techdocs-1

# Stop the container
docker compose down
```

The site will be available at http://localhost:3000 and also accessible from other devices on your network at http://YOUR_IP:3000.

## Troubleshooting

### Node.js not found

If you're using nvm but Node.js is not recognized in your terminal, ensure that your shell configuration includes the nvm setup:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

You may need to restart your terminal or run `source ~/.zshrc` (or your appropriate shell config file) for changes to take effect.
