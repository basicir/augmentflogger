// ==UserScript==
// @name         FlightLogger ID Finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds where a specific FlightLogger ID comes from in network requests or HTML
// @match        *://*.flightlogger.net/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🔴 EDIT THIS TO THE ID YOU ARE LOOKING FOR (e.g. 8439500)
    const TARGET_ID = '8439500';

    console.log(`[FlightLogger ID Finder] Started searching for ID: ${TARGET_ID}...`);

    // 1. Search the initial DOM (HTML)
    window.addEventListener('load', () => {
        console.log(`[FlightLogger ID Finder] Searching DOM HTML...`);
        const html = document.documentElement.outerHTML;
        if (html.includes(TARGET_ID)) {
            console.log(`%c[FlightLogger ID Finder] FOUND IN HTML! The ID ${TARGET_ID} is embedded directly in the page source!`, 'color: green; font-size: 16px; font-weight: bold;');
            
            // Find specific elements containing it
            const elements = document.querySelectorAll(`[href*="${TARGET_ID}"], [id*="${TARGET_ID}"], [data-id*="${TARGET_ID}"]`);
            if (elements.length > 0) {
                console.log(`[FlightLogger ID Finder] Found in elements:`, elements);
            }
        }
    });

    // 2. Intercept FETCH requests
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0] instanceof Request ? args[0].url : args[0];
        
        // Clone response so we can read it without consuming the stream for the real app
        const clone = response.clone();
        
        clone.text().then(text => {
            if (text.includes(TARGET_ID)) {
                console.log(`%c[FlightLogger ID Finder] FOUND IN FETCH RESPONSE!`, 'color: blue; font-size: 16px; font-weight: bold;');
                console.log(`URL: ${url}`);
                console.log(`Response text preview:`, text.substring(0, 500) + '...');
            }
        }).catch(err => {});
        
        return response;
    };

    // 3. Intercept XHR requests
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._requestUrl = url;
        return originalXhrOpen.call(this, method, url, ...rest);
    };

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (this.responseText && this.responseText.includes(TARGET_ID)) {
                console.log(`%c[FlightLogger ID Finder] FOUND IN XHR RESPONSE!`, 'color: purple; font-size: 16px; font-weight: bold;');
                console.log(`URL: ${this._requestUrl}`);
            }
        });
        return originalXhrSend.apply(this, args);
    };

})();
