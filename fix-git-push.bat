@echo off
echo Checking current branch...
git branch

echo.
echo Checking remote repositories...
git remote -v

echo.
echo Removing existing remote (if any)...
git remote remove origin

echo.
echo Adding the correct remote repository...
git remote add origin https://github.com/Avenger2007/EcoViz.git

echo.
echo Creating main branch and switching to it...
git checkout -b main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo If the above fails, please verify:
echo 1. The repository exists at https://github.com/Avenger2007/EcoViz
echo 2. You have the correct permissions
echo 3. Your GitHub credentials are correct
echo.
pause