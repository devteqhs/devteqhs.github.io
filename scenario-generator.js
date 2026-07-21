const unitTypes = ["infantry", "mechanized", "armored", "special-forces"];

const supportOptions = {
    fireSupport: ["Mortar strike", "Artillery barrage", "Precision artillery", "MLRS strike", "Smoke barrage", "Illumination rounds"],
    precisionMissile: ["Precision missile strike", "Cruise missile", "Ballistic missile"],
    specialMunitions: ["Cluster munitions", "Thermobaric strike", "Napalm strike", "White phosphorus"],
    airSupport: ["Gun run", "Rocket run", "Bombing run", "Attack helicopter", "Loitering CAS", "Armed UAV strike", "Drone strike"],
    transport: ["Helicopter insertion", "Helicopter extraction", "Fast rope insertion", "Paradrop insertion"],
    reinforcements: ["Infantry QRF", "Motorised QRF", "Mechanised QRF", "Armoured QRF", "Special forces team", "Airborne reinforcements", "Amphibious landing", "Attack helicopter reinforcements", "Transport helicopter reinforcements"],
    reconnaissance: ["UAV overwatch", "Reconnaissance drone", "Signal intercept", "Forward observer", "Artillery spotting"]
};

const unitData = {
    blufor: {
        infantry: {
            name: "Infantry Squad",
            baseSize: 10,
            vehicles: ["None (foot mobile)", "None (foot mobile)"],
            support: ["None", ...supportOptions.fireSupport.slice(0, 2)]
        },
        mechanized: {
            name: "Mechanized Infantry",
            baseSize: 15,
            vehicles: ["2x IFV (Infantry Fighting Vehicle)", "3x IFV", "2x APC (Armored Personnel Carrier)"],
            support: [...supportOptions.fireSupport, "Attack helicopter", "Infantry QRF", "Motorised QRF"]
        },
        armored: {
            name: "Armored Platoon",
            baseSize: 4,
            vehicles: ["3x Main Battle Tank", "4x Main Battle Tank", "3x MBT + 1x IFV support"],
            support: [...supportOptions.fireSupport, ...supportOptions.precisionMissile, ...supportOptions.airSupport, "Mechanised QRF", "Armoured QRF"]
        },
        "special-forces": {
            name: "Special Forces Team",
            baseSize: 6,
            vehicles: ["None (stealth insertion)", "Special ops vehicle", "Helicopter insertion"],
            support: [...supportOptions.transport, "Drone strike", "Signal intercept", "Special forces team"]
        },
    },
    redfor: {
        infantry: {
            name: "Infantry Squad",
            baseSize: 10,
            vehicles: ["None (foot mobile)", "None (foot mobile)"],
            support: ["None", ...supportOptions.fireSupport.slice(0, 2), "UAV overwatch", "Reconnaissance drone"]
        },
        mechanized: {
            name: "Mechanized Infantry",
            baseSize: 15,
            vehicles: ["2x IFV (Infantry Fighting Vehicle)", "3x IFV", "2x APC (Armored Personnel Carrier)"],
            support: [...supportOptions.fireSupport, "Attack helicopter", "Infantry QRF", "Motorised QRF"]
        },
        armored: {
            name: "Armored Platoon",
            baseSize: 4,
            vehicles: ["3x Main Battle Tank", "4x Main Battle Tank", "3x MBT + 1x IFV support"],
            support: [...supportOptions.fireSupport, ...supportOptions.precisionMissile, ...supportOptions.airSupport, "Mechanised QRF", "Armoured QRF"]
        },
        "special-forces": {
            name: "Special Forces Team",
            baseSize: 6,
            vehicles: ["None (stealth insertion)", "Special ops vehicle", "Helicopter insertion"],
            support: [...supportOptions.transport, "UAV overwatch", "Drone strike", "Signal intercept", "Special forces team"]
        },
    }
};

const additionalElements = {
    roles: ["BLUFOR Aggressor / REDFOR Defender", "BLUFOR Defender / REDFOR Aggressor"],
    timeOfDay: ["0400", "0600", "0800", "1000", "1200", "1400", "1600", "1800", "2000", "2200", "0000", "0200"]
};

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomizeSelections() {
    const bluforSelect = document.getElementById('blufor-select');
    const redforSelect = document.getElementById('redfor-select');
    
    bluforSelect.value = randomChoice(unitTypes);
    redforSelect.value = randomChoice(unitTypes);
}

function randomizeSizes() {
    setSliderValue('blufor', Math.floor(Math.random() * 45) + 5);
    setSliderValue('redfor', Math.floor(Math.random() * 45) + 5);
}

// Custom Slider Implementation
const sliders = {};

function initCustomSliders() {
    document.querySelectorAll('.custom-slider').forEach(slider => {
        const name = slider.dataset.slider;
        const min = parseInt(slider.dataset.min);
        const max = parseInt(slider.dataset.max);
        const value = parseInt(slider.dataset.value);
        
        sliders[name] = {
            element: slider,
            min,
            max,
            value,
            targetValue: value,
            currentValue: value,
            isDragging: false
        };
        
        updateSliderVisuals(name);
        
        slider.addEventListener('mousedown', (e) => startDrag(e, name));
        slider.addEventListener('touchstart', (e) => startDrag(e, name));
    });
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    animateSliders();
}

function startDrag(e, name) {
    e.preventDefault();
    sliders[name].isDragging = true;
    updateSliderFromEvent(e, name);
}

function handleDrag(e) {
    Object.keys(sliders).forEach(name => {
        if (sliders[name].isDragging) {
            updateSliderFromEvent(e, name);
        }
    });
}

function endDrag() {
    Object.keys(sliders).forEach(name => {
        sliders[name].isDragging = false;
    });
}

function updateSliderFromEvent(e, name) {
    const slider = sliders[name];
    const rect = slider.element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = Math.round(slider.min + percent * (slider.max - slider.min));
    slider.targetValue = newValue;
}

function updateSliderVisuals(name) {
    const slider = sliders[name];
    const percent = (slider.currentValue - slider.min) / (slider.max - slider.min);
    
    const fill = slider.element.querySelector('.slider-fill');
    const thumb = slider.element.querySelector('.slider-thumb');
    
    fill.style.width = `${percent * 100}%`;
    thumb.style.left = `${percent * 100}%`;
    
    const valueDisplay = document.getElementById(`${name}-max-value`);
    if (valueDisplay) {
        valueDisplay.textContent = Math.round(slider.currentValue);
    }
}

function animateSliders() {
    let needsAnimation = false;
    
    Object.keys(sliders).forEach(name => {
        const slider = sliders[name];
        const diff = slider.targetValue - slider.currentValue;
        
        if (Math.abs(diff) > 0.1) {
            slider.currentValue += diff * 0.2;
            updateSliderVisuals(name);
            needsAnimation = true;
        } else {
            slider.currentValue = slider.targetValue;
            updateSliderVisuals(name);
        }
    });
    
    requestAnimationFrame(animateSliders);
}

function getSliderValue(name) {
    return Math.round(sliders[name].targetValue);
}

function setSliderValue(name, value) {
    if (sliders[name]) {
        sliders[name].targetValue = Math.max(sliders[name].min, Math.min(sliders[name].max, value));
    }
}

function isNightTime(time) {
    const hour = parseInt(time);
    return hour >= 20 || hour <= 6;
}

function filterSupportForTime(supportOptions, time) {
    if (isNightTime(time)) {
        return supportOptions;
    }
    return supportOptions.filter(option => 
        !option.toLowerCase().includes('illumination') &&
        !option.toLowerCase().includes('illum')
    );
}

function generateScenario() {
    const bluforType = document.getElementById('blufor-select').value;
    const redforType = document.getElementById('redfor-select').value;
    const bluforMaxSize = getSliderValue('blufor');
    const redforMaxSize = getSliderValue('redfor');
    const balancedSizes = document.getElementById('balanced-sizes').checked;
    
    const bluforData = unitData.blufor[bluforType];
    const redforData = unitData.redfor[redforType];
    
    let bluforSize = Math.floor(Math.random() * (bluforMaxSize - bluforData.baseSize + 1)) + bluforData.baseSize;
    let redforSize = Math.floor(Math.random() * (redforMaxSize - redforData.baseSize + 1)) + redforData.baseSize;
    
    if (balancedSizes) {
        const maxDiff = 10;
        const diff = Math.abs(bluforSize - redforSize);
        if (diff > maxDiff) {
            if (bluforSize > redforSize) {
                redforSize = Math.min(redforMaxSize, bluforSize - Math.floor(Math.random() * maxDiff));
            } else {
                bluforSize = Math.min(bluforMaxSize, redforSize - Math.floor(Math.random() * maxDiff));
            }
        }
    }
    
    const timeOfDay = randomChoice(additionalElements.timeOfDay);
    
    let bluforVehicles = randomChoice(bluforData.vehicles);
    let redforVehicles = randomChoice(redforData.vehicles);
    
    if (bluforVehicles.includes("None")) bluforVehicles = "None";
    if (redforVehicles.includes("None")) redforVehicles = "None";
    
    const bluforSupport = filterSupportForTime(bluforData.support, timeOfDay);
    const redforSupport = filterSupportForTime(redforData.support, timeOfDay);
    
    const bluforScenario = {
        faction: "BLUFOR",
        unitType: bluforData.name,
        size: `${bluforSize} men`,
        vehicles: bluforVehicles,
        support: randomChoice(bluforSupport.length > 0 ? bluforSupport : bluforData.support)
    };
    
    const redforScenario = {
        faction: "REDFOR",
        unitType: redforData.name,
        size: `${redforSize} men`,
        vehicles: redforVehicles,
        support: randomChoice(redforSupport.length > 0 ? redforSupport : redforData.support)
    };
    
    const missionDetails = {
        role: randomChoice(additionalElements.roles),
        timeOfDay: timeOfDay
    };
    
    displayScenario(bluforScenario, redforScenario, missionDetails);
}

function displayScenario(bluforScenario, redforScenario, missionDetails) {
    const output = document.getElementById('scenario-output');
    output.innerHTML = `
        <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; letter-spacing: -0.03em;">Mission Details</h3>
            <div style="display: grid; gap: 12px;">
                <div class="scenario-item">
                    <span class="scenario-label">Role</span>
                    <span class="scenario-value">${missionDetails.role}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Time</span>
                    <span class="scenario-value">${missionDetails.timeOfDay}</span>
                </div>
            </div>
        </div>

        <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; letter-spacing: -0.03em; color: var(--blue);">BLUFOR</h3>
            <div style="display: grid; gap: 12px;">
                <div class="scenario-item">
                    <span class="scenario-label">Unit Type</span>
                    <span class="scenario-value">${bluforScenario.unitType}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Unit Size</span>
                    <span class="scenario-value">${bluforScenario.size}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Vehicles</span>
                    <span class="scenario-value">${bluforScenario.vehicles}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Support Elements</span>
                    <span class="scenario-value">${bluforScenario.support}</span>
                </div>
            </div>
        </div>

        <div>
            <h3 style="margin: 0 0 16px; font-size: 20px; font-weight: 700; letter-spacing: -0.03em; color: #e74c3c;">REDFOR</h3>
            <div style="display: grid; gap: 12px;">
                <div class="scenario-item">
                    <span class="scenario-label">Unit Type</span>
                    <span class="scenario-value">${redforScenario.unitType}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Unit Size</span>
                    <span class="scenario-value">${redforScenario.size}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Vehicles</span>
                    <span class="scenario-value">${redforScenario.vehicles}</span>
                </div>
                <div class="scenario-item">
                    <span class="scenario-label">Support Elements</span>
                    <span class="scenario-value">${redforScenario.support}</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('generate-btn').addEventListener('click', generateScenario);
document.getElementById('randomize-btn').addEventListener('click', randomizeSelections);
document.getElementById('randomize-size-btn').addEventListener('click', randomizeSizes);

// Initialize custom sliders
initCustomSliders();
