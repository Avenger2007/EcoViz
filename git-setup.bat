@echo off
echo Initializing Git repository for EcoViz...
git init
echo.
echo Adding all files to Git...
git add .
echo.
echo Creating initial commit...
git commit -m "Initial commit: EcoViz Climate Change Dashboard"
echo.
echo Setting up remote repository...
git remote add origin https://github.com/Avenger2007/EcoViz.git
echo.
echo Pushing to GitHub...
git push -u origin main
echo.
echo If the push fails with an error about the 'main' branch, try:
echo git push -u origin master
echo.
echo Git repository setup complete!
pause