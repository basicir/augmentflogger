// ==UserScript==
// @name         FlightLogger Auto Task Opener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically opens a specific task edit page if the URL contains auto_open_task
// @match        *://*.flightlogger.net/users/*/user_programs/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if the URL has the auto_open_task hash parameter
    const hashStr = window.location.hash.substring(1); // remove the '#'
    const urlParams = new URLSearchParams(hashStr);
    const targetTaskName = urlParams.get('auto_open_task');

    if (targetTaskName) {
        console.log(`[Auto Task Opener] Looking for task: "${targetTaskName}"`);
        
        // FlightLogger tasks are inside <a> tags within the table
        const allLinks = Array.from(document.querySelectorAll('a'));
        
        // Find the link where the visible text matches the task name
        const targetLink = allLinks.find(a => a.innerText.trim() === targetTaskName.trim());
        
        if (targetLink) {
            console.log(`[Auto Task Opener] Found it! Redirecting to: ${targetLink.href}`);
            
            // Highlight it visually just in case it takes a split second
            targetLink.style.backgroundColor = 'yellow';
            targetLink.style.border = '2px solid red';
            
            // Redirect the page to the specific edit URL
            window.location.replace(targetLink.href);
        } else {
            console.error(`[Auto Task Opener] Could not find any link matching "${targetTaskName}".`);
        }
    }
})();
