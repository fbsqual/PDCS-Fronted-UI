@echo off
echo ========================================
echo PDCS-Fronted-UI Git推送脚本
echo ========================================
echo.

echo 正在检查Git状态...
git status
echo.

echo 正在检查待推送的提交...
git log --oneline origin/main..HEAD
echo.

echo 尝试推送到GitHub...
echo 如果网络连接有问题，请稍后重试或使用以下手动步骤：
echo.

:retry
git push origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 推送的提交包括：
    echo - feat: 完善基础设施支持安全迭代和同步更新
    echo - docs: 添加基础设施更新总结文档  
    echo - feat: 完善NPM脚本并添加基础设施测试工具
    echo - docs: 添加基础设施完成状态报告
    echo.
    echo 🎉 所有基础设施更新已成功同步到GitHub！
    pause
    exit /b 0
) else (
    echo.
    echo ❌ 推送失败，可能的原因：
    echo 1. 网络连接问题
    echo 2. GitHub服务器问题
    echo 3. 认证问题
    echo.
    echo 请选择操作：
    echo 1. 重试推送 (R)
    echo 2. 查看详细错误信息 (D)
    echo 3. 退出并手动处理 (Q)
    echo.
    set /p choice=请输入选择 (R/D/Q): 
    
    if /i "%choice%"=="R" goto retry
    if /i "%choice%"=="D" goto details
    if /i "%choice%"=="Q" goto manual
    goto retry
)

:details
echo.
echo 详细错误信息：
echo 请检查以下项目：
echo 1. 网络连接是否正常
echo 2. GitHub是否可以访问
echo 3. Git凭据是否正确
echo 4. 仓库权限是否足够
echo.
echo 可以尝试的解决方案：
echo 1. 检查网络代理设置
echo 2. 使用VPN或更换网络
echo 3. 稍后重试
echo 4. 使用GitHub Desktop或其他Git客户端
echo.
set /p retry_choice=是否重试？(Y/N): 
if /i "%retry_choice%"=="Y" goto retry
goto manual

:manual
echo.
echo ========================================
echo 手动推送指导
echo ========================================
echo.
echo 当前有4个本地提交需要推送：
echo 1. b0bbe1f - feat: 完善基础设施支持安全迭代和同步更新
echo 2. 28aa54b - docs: 添加基础设施更新总结文档
echo 3. 2933e59 - feat: 完善NPM脚本并添加基础设施测试工具
echo 4. 4019ec7 - docs: 添加基础设施完成状态报告
echo.
echo 手动推送步骤：
echo 1. 确保网络连接正常
echo 2. 在命令行中运行: git push origin main
echo 3. 或使用GitHub Desktop等图形界面工具
echo 4. 或在浏览器中访问GitHub仓库，使用Web界面上传
echo.
echo 推送成功后，可以运行以下命令验证：
echo git log --oneline -5
echo.
pause
exit /b 1
