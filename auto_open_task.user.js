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
        
        // Normalize the target string for robust matching
        const normalize = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();
        const searchStr = normalize(targetTaskName);

        // Keep trying to find the link for a few seconds (in case of slow DOM loading or Turbo)
        let attempts = 0;
        const intervalId = setInterval(() => {
            attempts++;
            const allLinks = Array.from(document.querySelectorAll('a'));
            
            // Find the link where the normalized visible text includes the target name
            const targetLink = allLinks.find(a => normalize(a.innerText).includes(searchStr));
            
            if (targetLink) {
                // Ensure it ends with /edit for edit mode
                let finalUrl = targetLink.href;
                if (!finalUrl.endsWith('/edit')) {
                    finalUrl = finalUrl.replace(/\/?(\?.*)?$/, '/edit$1');
                }
                
                console.log(`[Auto Task Opener] Found it on attempt ${attempts}! Redirecting to: ${finalUrl}`);
                clearInterval(intervalId);
                
                targetLink.style.backgroundColor = 'yellow';
                targetLink.style.border = '2px solid red';
                
                // Redirect
                window.location.replace(finalUrl);
            } else if (attempts > 50) {
                // Stop after ~5 seconds
                console.error(`[Auto Task Opener] Could not find any link matching "${targetTaskName}" after 5 seconds.`);
                clearInterval(intervalId);
            }
        }, 100); // check every 100ms
    }
})();
