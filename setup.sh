#!/bin/bash

# Setup script for Skillsoft Suite Landing Page
echo "Setting up Skillsoft Suite Landing Page..."

# Create public directory if it doesn't exist
mkdir -p public/images

# Copy header image from tts-app (assuming we're in the repository root)
if [ -f "../tts-app/public/images/6.jpg" ]; then
    cp ../tts-app/public/images/6.jpg public/images/
    echo "✓ Header image copied successfully"
else
    echo "⚠ Please manually copy tts-app/public/images/6.jpg to suite-landing/public/images/"
fi

# Create favicon if it doesn't exist  
if [ ! -f "public/favicon.ico" ]; then
    # Copy from tts-app if available
    if [ -f "../tts-app/public/favicon.ico" ]; then
        cp ../tts-app/public/favicon.ico public/
        echo "✓ Favicon copied successfully"
    else
        echo "⚠ Please manually copy a favicon.ico to public/"
    fi
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo "✓ Setup complete!"
echo ""
echo "To start development server:"
echo "  npm run dev"
echo ""
echo "Don't forget to update the app URLs in app/page.tsx to point to your deployed applications!" 