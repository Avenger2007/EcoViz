#!/bin/bash

echo "Initializing Git repository for EcoViz..."
git init

echo "Adding all files to Git..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: EcoViz Climate Change Dashboard"

echo "Setting up remote repository..."
git remote add origin https://github.com/Avenger2007/EcoViz.git

echo "Pushing to GitHub..."
git push -u origin main

echo "If the push fails with an error about the 'main' branch, try:"
echo "git push -u origin master"

echo "Git repository setup complete!"