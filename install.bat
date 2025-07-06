@echo off
echo Installing dependencies for PDCS Frontend...
echo This may take a few minutes...

npm install

if %errorlevel% neq 0 (
    echo Installation failed. Trying with --force flag...
    npm install --force
)

if %errorlevel% neq 0 (
    echo Installation failed. Trying with yarn...
    yarn install
)

echo Installation completed!
echo You can now run: npm run dev
pause
