// ==UserScript==
// @name         Extract Items for Excel
// @version      0.1
// @description  Extracts item names and prices from an order table as tab-separated values without header and copies to clipboard with an alert on click.
// @author       Anubhav J.
// @match        *://*/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/anubhavj99/asda-order-extraction/refs/heads/main/extract-asda-order-data.user.js
// @downloadURL  https://raw.githubusercontent.com/anubhavj99/asda-order-extraction/refs/heads/main/extract-asda-order-data.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract items from the order table.
    function extractItems() {
        const itemRows = document.querySelectorAll('.item-row__content--available');
        const items = [];

        itemRows.forEach(row => {
            const titleElem = row.querySelector('.item-title__label');
            const priceElem = row.querySelector('.item-price__label');
            if (titleElem && priceElem) {
                const itemName = titleElem.textContent.trim();
                const price = priceElem.textContent.trim().replace('£', '');
                items.push({ itemName, price });
            }
        });
        return items;
    }

    // Format items as tab-separated values (without header).
    function formatItemsForExcel(items) {
        let tableString = '';
        items.forEach(item => {
            tableString += `${item.itemName}\t${item.price}\n`;
        });
        return tableString;
    }

    // Copies text to the clipboard.
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Table copied to clipboard');
            alert('Items copied to clipboard!');
        }).catch(err => {
            console.error('Error copying text: ', err);
            alert('Failed to copy items to clipboard.');
        });
    }

    // Extracts, formats, and copies items data.
    function extractAndCopy() {
        const items = extractItems();
        if (items.length === 0) {
            console.log('No items found');
            alert('No items found');
            return;
        }
        const tableText = formatItemsForExcel(items);
        copyTextToClipboard(tableText);
    }

    // Create and insert a button to trigger the extraction.
    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Extract Items for Excel';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 1000;
        btn.style.padding = '10px 20px';
        btn.style.backgroundColor = '#007bff';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';

        // Attach click event listener.
        btn.addEventListener('click', extractAndCopy);

        document.body.appendChild(btn);
    }

    // Run the script once the page has loaded.
    window.addEventListener('load', function() {
        if (window.location.href.includes("https://groceries.asda.com/account/order/")) {
            createButton();
        }
    });
})();
