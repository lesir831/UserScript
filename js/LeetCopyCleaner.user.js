// ==UserScript==
// @name         LeetCode Copy Cleaner (去除复制的代码作者信息)
// @namespace    https://github.com/lesir831/UserScript
// @version      1.1
// @description  点击 LeetCode 代码块的复制按钮时，只复制纯代码，去除末尾附加的作者和题目链接等信息。
// @author       lesir
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.com/explore/interview/*
// @match        https://leetcode.cn/explore/interview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log('LeetCode Copy Code Cleaner script loaded.');

    // 使用事件委托，监听父元素的点击事件，效率更高，且能处理动态加载的内容
    document.body.addEventListener('click', function(event) {
        // 检查点击的是否是复制按钮内部的图标或按钮本身
        // LeetCode 的复制按钮结构可能变化，这里尝试定位到包含 fa-clone 图标的那个可点击的 div
        const cloneIcon = event.target.closest('svg.fa-clone');
        const copyButton = cloneIcon ? cloneIcon.closest('div[class*="cursor-pointer"]') : null; // 找到包含图标的、可点击的父div

        if (copyButton && copyButton.closest('.group.relative')) { // 确认按钮在代码块的结构内

            console.log('LeetCode copy button clicked.');

            // 1. 阻止默认行为和事件冒泡
            event.preventDefault();
            event.stopPropagation();

            // 2. 找到对应的代码元素
            // 从按钮向上找到包含 <pre> 标签的 '.group.relative' 容器
            const codeContainer = copyButton.closest('.group.relative');
            if (!codeContainer) {
                console.error('Could not find parent code container (.group.relative)');
                return;
            }

            const codeElement = codeContainer.querySelector('pre code'); // 定位到 <code> 标签
            if (codeElement) {
                // 3. 获取纯代码文本
                const pureCode = codeElement.textContent || codeElement.innerText; // 获取 <code> 元素内的所有文本

                // 4. 使用 Clipboard API 复制纯代码
                navigator.clipboard.writeText(pureCode).then(() => {
                    console.log('Pure code copied to clipboard successfully!');
                    // 可以选择性地在这里添加一些视觉反馈，比如临时改变按钮图标
                    // LeetCode 自身可能会处理点击后的图标变化（例如变成打勾），
                    // 因为我们阻止了事件，可能需要手动模拟一下这个效果，但这会增加脚本复杂性。
                    // 简单起见，暂时不添加视觉反馈。
                }).catch(err => {
                    console.error('Failed to copy pure code: ', err);
                    // 如果失败，可能需要提示用户手动复制
                    alert('复制代码失败，请尝试手动选中复制。\n错误信息: ' + err.message);
                });
            } else {
                console.error('Could not find the code element (pre code) within the container.');
            }
        }
    }, true); // 使用捕获阶段，确保在 LeetCode 自己的监听器之前执行

})();