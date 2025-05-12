// ==UserScript==
// @name         LeetCode Copy Cleaner (去除复制的代码作者信息)
// @namespace    https://github.com/lesir831/UserScript
// @version      1.2
// @description  点击 LeetCode 代码块的复制按钮时，只复制纯代码，去除末尾附加的作者和题目链接等信息。
// @author       lesir
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/explore/interview/*
// @match        https://leetcode.cn/explore/interview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log('LeetCode Copy Code Cleaner script loaded.');

    // 添加一个防抖函数，避免事件多次触发导致的问题
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 保存原始的 Clipboard API 方法
    const originalWriteText = navigator.clipboard.writeText;

    // 覆盖剪贴板 API 以拦截所有复制操作
    navigator.clipboard.writeText = function(text) {
        // 检查文本是否包含 LeetCode 的特征文本
        if (text && (text.includes('\nAuthor: ') || text.includes('\n作者：') || 
                     text.includes('https://leetcode.com') || text.includes('https://leetcode.cn'))) {
            console.log('Detected LeetCode copyright text, cleaning...');
            
            // 查找并删除版权信息
            // 匹配多种可能的版权格式
            const cleanedText = text.split(/\n(Author: |作者：)/)[0].trim();
            console.log('Cleaned code copied to clipboard');
            return originalWriteText.call(this, cleanedText);
        }
        
        // 如果不是 LeetCode 代码，正常执行
        return originalWriteText.call(this, text);
    };

    // 主要的按钮点击拦截功能
    const handleButtonClick = function(event) {
        // 检查点击的是否是复制按钮内部的图标或按钮本身
        const cloneIcon = event.target.closest('svg.fa-clone, svg[class*="copy"], button[class*="copy"]');
        const copyButton = cloneIcon ? cloneIcon.closest('div[class*="cursor-pointer"], button[class*="copy"]') : null;

        if (copyButton && (copyButton.closest('.group.relative') || copyButton.closest('[class*="code-block"]'))) {
            console.log('LeetCode copy button clicked.');

            // 找到对应的代码元素
            let codeContainer = copyButton.closest('.group.relative') || copyButton.closest('[class*="code-block"]');
            if (!codeContainer) {
                console.log('Using fallback container detection');
                codeContainer = copyButton.closest('div');
            }

            const codeElement = codeContainer.querySelector('pre code, code');
            if (codeElement) {
                // 阻止默认行为和事件冒泡
                event.preventDefault();
                event.stopPropagation();
                
                // 获取纯代码文本
                const pureCode = codeElement.textContent || codeElement.innerText;

                // 使用 Clipboard API 复制纯代码
                navigator.clipboard.writeText(pureCode).then(() => {
                    console.log('Pure code copied to clipboard successfully!');
                    
                    // 提供视觉反馈 - 临时显示复制成功
                    const feedbackSpan = document.createElement('span');
                    feedbackSpan.textContent = '已复制';
                    feedbackSpan.style.position = 'absolute';
                    feedbackSpan.style.backgroundColor = '#4CAF50';
                    feedbackSpan.style.color = 'white';
                    feedbackSpan.style.padding = '3px 6px';
                    feedbackSpan.style.borderRadius = '3px';
                    feedbackSpan.style.fontSize = '12px';
                    feedbackSpan.style.zIndex = '9999';
                    feedbackSpan.style.opacity = '0.9';
                    
                    // 计算位置
                    const buttonRect = copyButton.getBoundingClientRect();
                    feedbackSpan.style.top = `${buttonRect.top - 25}px`;
                    feedbackSpan.style.left = `${buttonRect.left}px`;
                    
                    document.body.appendChild(feedbackSpan);
                    
                    // 2秒后移除
                    setTimeout(() => {
                        feedbackSpan.style.opacity = '0';
                        feedbackSpan.style.transition = 'opacity 0.5s';
                        setTimeout(() => feedbackSpan.remove(), 500);
                    }, 1500);
                }).catch(err => {
                    console.error('Failed to copy pure code: ', err);
                    alert('复制代码失败，请尝试手动选中复制。\n错误信息: ' + err.message);
                });
                
                return false; // 确保事件不继续传播
            } else {
                console.error('Could not find the code element within the container.');
            }
        }
    };

    // 使用事件委托监听所有点击事件，采用捕获阶段
    document.addEventListener('click', handleButtonClick, true);
    
    // 使用 MutationObserver 监听 DOM 变化，处理动态加载的内容
    const observer = new MutationObserver(debounce(function(mutations) {
        // 检查是否有新的代码块被添加
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // DOM 变化，可能需要重新检查按钮
                console.log('DOM changed, looking for new copy buttons');
            }
        }
    }, 200));

    // 开始监听整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();