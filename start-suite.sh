#!/bin/bash

# Skillsoft Suite - Start All Apps
# This script starts all three applications in the suite

echo "🚀 Starting Skillsoft Suite..."
echo ""

# Function to check if a port is in use (Windows/Git Bash compatible)
check_port() {
    if netstat -an | grep ":$1 " | grep "LISTENING" >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Function to start an app with port checking
start_app() {
    local app_name=$1
    local port=$2
    local command=$3
    
    echo "📱 Starting $app_name on port $port..."
    
    if check_port $port; then
        cd ../$app_name
        $command &
        echo "✅ $app_name started on http://localhost:$port"
        cd ../suite-landing
    else
        echo "❌ Failed to start $app_name - port $port is busy"
        return 1
    fi
}

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "node.*backend" 2>/dev/null || true

# Wait a moment for processes to clean up
sleep 2

echo ""
echo "🎯 Starting applications..."

# Start Lexicon Editor Backend (port 4000)
echo "🔧 Starting Lexicon Editor Backend..."
if check_port 4000; then
    cd ../lexicon-editor/backend
    npm start &
    echo "✅ Lexicon Backend started on http://localhost:4000"
    cd ../../suite-landing
else
    echo "❌ Lexicon Backend port 4000 is busy"
fi

# Wait for backend to start
sleep 3

# Start Lexicon Editor Frontend (port 3000 - let it use default)
echo "📱 Starting Lexicon Editor on port 3000..."
if check_port 3000; then
    cd ../lexicon-editor
    npm start &
    echo "✅ Lexicon Editor started on http://localhost:3000"
    cd ../suite-landing
else
    echo "❌ Lexicon Editor port 3000 is busy"
fi

# Start TTS App (port 3002)
start_app "tts-app" 3002 "npm run dev -- --port 3002"

# Start Landing Page (port 3001)
start_app "suite-landing" 3001 "npm run dev -- --port 3001"

echo ""
echo "🎉 Skillsoft Suite is starting up!"
echo ""
echo "📋 Application URLs:"
echo "   🏠 Landing Page:    http://localhost:3001"
echo "   🔊 TTS App:         http://localhost:3002"
echo "   📝 Lexicon Editor:  http://localhost:3000"
echo "   🔧 Lexicon Backend: http://localhost:4000"
echo ""
echo "⏳ Please wait a moment for all apps to fully load..."
echo ""
echo "💡 Tips:"
echo "   - Use Ctrl+C to stop all apps"
echo "   - Check the terminal output for any errors"
echo "   - The landing page links will need to be updated to point to the correct ports"
echo ""

# Wait for user input to stop
echo "Press Ctrl+C to stop all applications"
wait 