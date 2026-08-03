// ==UserScript==
// @name         FlightLogger Master Exporter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Handles auto-opening green tasks and auto-filling flight data from URL hash
// @author       Te Neved
// @match        *://*.flightlogger.net/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // NOTIFICATION SYSTEM
    // ==========================================
    const showNotification = (message, type = 'warning') => {
        const toast = document.createElement('div');
        toast.innerHTML = `<strong>${type === 'warning' ? '⚠️ Info' : '❌ Hiba'}</strong><br/>${message}`;
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = type === 'warning' ? '#f39c12' : '#e74c3c';
        toast.style.color = 'white';
        toast.style.padding = '15px 20px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        toast.style.zIndex = '999999';
        toast.style.fontSize = '14px';
        toast.style.transition = 'opacity 0.5s ease-in-out';
        toast.style.pointerEvents = 'none';

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    // ==========================================
    // AUTO-FILL HELPERS
    // ==========================================
    const setReactInput = async (selector, val) => {
        const el = document.querySelector(selector);
        if (el) {
            el.focus();
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
            el.blur();
            el.dispatchEvent(new Event('blur', { bubbles: true }));
            await new Promise(r => setTimeout(r, 150));
        }
    };

    const setAircraftCallsign = async (callsign) => {
        const selectorContainer = document.querySelector('.aircraft-selector');
        if (!selectorContainer) return false;
        const input = selectorContainer.querySelector('input');
        if (!input) return false;

        input.focus();
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, callsign);
        input.dispatchEvent(new Event('input', { bubbles: true }));

        await new Promise(r => setTimeout(r, 500));

        const options = Array.from(document.querySelectorAll('[id*="react-select-"][id*="-option-"]'));
        const targetOption = options.find(opt => opt.textContent.toUpperCase().includes(callsign.toUpperCase()));

        if (targetOption) {
            targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            targetOption.click();
            return true;
        }
        return false;
    };

    const setCycleButtonValue = async (containerSelector, targetValue) => {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const button = container.querySelector('button');
        if (!button) return;

        for (let i = 0; i < 10; i++) {
            const selectedOption = container.querySelector('.selected-option');
            if (!selectedOption) break;
            const currentText = selectedOption.textContent.replace(/[\u2011\u2012\u2013\u2014-]/g, '-').trim().toUpperCase();
            const targetText = targetValue.replace(/[\u2011\u2012\u2013\u2014-]/g, '-').trim().toUpperCase();
            if (currentText === targetText) return;
            button.click();
            await new Promise(r => setTimeout(r, 50));
        }
    };

    const setReactSelectByClick = async (controlElement, targetText) => {
        if (!controlElement) return false;
        controlElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await new Promise(r => setTimeout(r, 200));

        const options = Array.from(document.querySelectorAll('[id*="react-select-"][id*="-option-"]'));
        const targetOption = options.find(opt => opt.textContent.trim().toUpperCase() === targetText.trim().toUpperCase());

        if (targetOption) {
            targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            targetOption.click();
            await new Promise(r => setTimeout(r, 200));
            return true;
        }
        document.body.click();
        return false;
    };

    const setAirportSelector = async (index, targetText) => {
        const selectors = Array.from(document.querySelectorAll('.landing-airport-selector'));
        if (selectors.length > index) {
            const selectorContainer = selectors[index];
            const input = selectorContainer.querySelector('input');
            
            if (input) {
                input.focus();
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeSetter.call(input, targetText);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(r => setTimeout(r, 500));
            } else {
                selectorContainer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                await new Promise(r => setTimeout(r, 200));
            }

            const options = Array.from(document.querySelectorAll('[id*="react-select-"][id*="-option-"]'));
            const targetOption = options.find(opt => opt.textContent.trim().toUpperCase().includes(targetText.trim().toUpperCase()));

            if (targetOption) {
                targetOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                targetOption.click();
                await new Promise(r => setTimeout(r, 200));
                return true;
            }
            document.body.click();
        }
        return false;
    };

    const switchTab = async (tabName) => {
        const btn = document.querySelector(`button[aria-label="${tabName}"]`);
        if (btn) {
            btn.click();
            await new Promise(r => setTimeout(r, 1000));
            return true;
        } else {
            showNotification(`Nem található a(z) ${tabName} fül!`, 'error');
            return false;
        }
    };

    const setGrade = (competencyName, gradeStr, commentStr = null) => {
        const nameSpans = Array.from(document.querySelectorAll('.exercise-name *')).filter(el =>
            el.children.length === 0 &&
            el.textContent.trim().toLowerCase() === competencyName.toLowerCase()
        );

        if (nameSpans.length === 0) return;
        const row = nameSpans[0].closest('.exercise-row');
        if (!row) return;

        if (gradeStr) {
            const gradesMap = ['BS', 'S-', 'S', 'S+', 'AS', 'HIL'];
            const gradeIndex = gradesMap.indexOf(gradeStr.toUpperCase());

            if (gradeIndex !== -1) {
                const radios = row.querySelectorAll('input[type="radio"]');
                const radio = radios[gradeIndex];
                if (radio) {
                    const btn = radio.closest('button');
                    if (btn) {
                        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                        btn.click();
                    }
                    const nativeCheckedSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked').set;
                    nativeCheckedSetter.call(radio, true);
                    radio.dispatchEvent(new Event('input', { bubbles: true }));
                    radio.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
        }

        if (commentStr) {
            const textarea = row.querySelector('textarea.exercise-comment');
            if (textarea) {
                const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(textarea, commentStr);
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                textarea.dispatchEvent(new Event('blur', { bubbles: true }));
            }
        }
    };

    const setQuillComment = async (text, containerSelector) => {
        const parent = document.querySelector(containerSelector);
        if (!parent) return;
        const editorEl = parent.querySelector('.ql-editor');
        if (!editorEl) return;

        const quillWrapper = parent.querySelector('.quill');
        if (quillWrapper) {
            const reactKey = Object.keys(quillWrapper).find(k => k.startsWith('__reactFiber$'));
            if (reactKey) {
                let fiber = quillWrapper[reactKey];
                let quillEditor = null;

                while (fiber && !quillEditor) {
                    if (fiber.stateNode && typeof fiber.stateNode.getEditor === 'function') {
                        quillEditor = fiber.stateNode.getEditor();
                    }
                    fiber = fiber.return;
                }

                if (quillEditor) {
                    quillEditor.clipboard.dangerouslyPasteHTML(`<p>${text}</p>`);
                    return;
                }
            }
        }
        editorEl.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, text);
    };

    // ==========================================
    // AUTO-FILL MAIN FUNCTION
    // ==========================================
    const autoFillFlightData = async (data) => {
        if (await switchTab('Flight')) {
            if (data.aircraft_registration && await setAircraftCallsign(data.aircraft_registration)) {
                await new Promise(r => setTimeout(r, 1000));

                if (data.start_time) {
                    const sd = new Date(data.start_time);
                    await setReactInput('.primaryFlightLogStart .date-input input', `${String(sd.getDate()).padStart(2, '0')}.${String(sd.getMonth() + 1).padStart(2, '0')}.${sd.getFullYear()}`);
                    await setReactInput('.primaryFlightLogStart .time-input input', `${String(sd.getHours()).padStart(2, '0')}:${String(sd.getMinutes()).padStart(2, '0')}`);
                }

                await new Promise(r => setTimeout(r, 1000));

                if (data.end_time) {
                    const ed = new Date(data.end_time);
                    await setReactInput('.primaryFlightLogEnd .date-input input', `${String(ed.getDate()).padStart(2, '0')}.${String(ed.getMonth() + 1).padStart(2, '0')}.${ed.getFullYear()}`);
                    await setReactInput('.primaryFlightLogEnd .time-input input', `${String(ed.getHours()).padStart(2, '0')}:${String(ed.getMinutes()).padStart(2, '0')}`);
                }

                if (data.pilot_function && data.pilot_function !== 'Not Specified') await setCycleButtonValue('.flight-type', data.pilot_function);
                if (data.flight_rules && data.flight_rules !== 'Not Specified') await setCycleButtonValue('.flight-rule', data.flight_rules);
                if (data.time_of_day && data.time_of_day !== 'Not Specified') await setCycleButtonValue('.daytime', data.time_of_day);
                if (data.flight_type && data.flight_type !== 'Not Specified') await setCycleButtonValue('.cross-country', data.flight_type);

                if (data.touch_and_goes && data.touch_and_goes > 0) {
                    const landingBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('LANDING'));
                    if (landingBtn) {
                        landingBtn.click();
                        await new Promise(r => setTimeout(r, 1000));

                        const xmarks = Array.from(document.querySelectorAll('[data-icon="xmark"]'));
                        if (xmarks.length > 0) {
                            const lastXmark = xmarks[xmarks.length - 1];
                            let current = lastXmark, landingRow = null;
                            while (current && current !== document.body) {
                                if (current.querySelectorAll('input[readonly]').length >= 2) { landingRow = current; break; }
                                current = current.parentElement;
                            }
                            if (landingRow) {
                                const readonlyInputs = Array.from(landingRow.querySelectorAll('input[readonly]'));
                                await setReactSelectByClick(readonlyInputs[1].closest('[class*="-control"]'), 'Touch and go');
                                await setReactSelectByClick(readonlyInputs[0].closest('[class*="-control"]'), String(data.touch_and_goes));
                            }
                        }
                    }
                }

                const airports = Array.from(document.querySelectorAll('.landing-airport-selector'));
                if (airports.length > 0 && data.departure_aerodrome) {
                    await setAirportSelector(0, data.departure_aerodrome);
                }
                if (airports.length > 1 && data.destination_aerodrome) {
                    await setAirportSelector(airports.length - 1, data.destination_aerodrome);
                    if (airports.length > 2) {
                        await setAirportSelector(1, data.destination_aerodrome);
                    }
                }
            }
        }

        if (await switchTab('Grading')) {
            if (data.grades) {
                for (const [competency, grade] of Object.entries(data.grades)) {
                    const comment = data.exercise_comments ? data.exercise_comments[competency] : null;
                    setGrade(competency, grade, comment);
                }
            }
        }

        if (await switchTab('Debriefing')) {
            await new Promise(r => setTimeout(r, 500));
            if (data.general_comment) {
                await setQuillComment(data.general_comment.replace(/\n/g, '<br>'), '#debriefing-comment');
            }
        }

        showNotification("Kitöltés befejeződött!", "warning");
    };

    // ==========================================
    // ROUTING & EXECUTION PIPELINE
    // ==========================================
    const hashStr = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hashStr);
    const exportDataB64 = urlParams.get('export_data');
    const autoOpenTask = urlParams.get('auto_open_task');

    if (exportDataB64) {
        
        // 1. PHASE: We are on a syllabus page, need to auto-click the task to open it
        if (autoOpenTask) {
            console.log(`[Master Exporter] Looking for task: "${autoOpenTask}"`);
            
            const normalize = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();
            const searchStr = normalize(autoOpenTask);

            let attempts = 0;
            const intervalId = setInterval(() => {
                attempts++;
                const allLinks = Array.from(document.querySelectorAll('a'));
                const targetLink = allLinks.find(a => normalize(a.innerText).includes(searchStr));
                
                if (targetLink) {
                    let finalUrl = targetLink.href;
                    if (!finalUrl.endsWith('/edit')) {
                        finalUrl = finalUrl.replace(/\/?(\?.*)?$/, '/edit$1');
                    }
                    
                    // Forward the export data to the edit page
                    finalUrl += `#export_data=${exportDataB64}`;
                    
                    console.log(`[Master Exporter] Redirecting to: ${finalUrl}`);
                    clearInterval(intervalId);
                    window.location.replace(finalUrl);
                } else if (attempts > 50) {
                    console.error(`[Master Exporter] Could not find any link matching "${autoOpenTask}".`);
                    clearInterval(intervalId);
                }
            }, 100);
            return;
        }

        // 2. PHASE: We are on an Edit page (or RED task was opened directly)
        // Ensure we are on an edit page before injecting data
        if (window.location.pathname.endsWith('/edit')) {
            console.log("[Master Exporter] Edit page detected. Parsing export data...");
            
            try {
                // Decode base64 -> uri component -> json string -> object
                const dataStr = decodeURIComponent(escape(atob(exportDataB64)));
                const data = JSON.parse(dataStr);
                
                // Clear hash so it doesn't run again on page reload
                history.replaceState(null, '', window.location.pathname + window.location.search);
                
                showNotification("Adatok felismerve! Kitöltés indul 3 másodpercen belül...", "warning");
                
                // Wait for React to mount the edit forms
                setTimeout(() => {
                    autoFillFlightData(data).catch(err => {
                        console.error(err);
                        showNotification("Hiba történt a kitöltés során!", "error");
                    });
                }, 3000);
                
            } catch (err) {
                console.error("[Master Exporter] Failed to parse export data:", err);
                showNotification("Érvénytelen adat a linkben!", "error");
            }
        }
    }
})();
