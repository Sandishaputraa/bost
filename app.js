[file name]: app.js
[file content begin]
// ============================================
// CORE APP FUNCTIONS - ALL IN ONE FILE
// ============================================

// Global variables
let currentCommands = '';
let selectedPreset = null;
let selectedCommand = null;

// ============================================
// 1. NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ============================================
// 2. CLIPBOARD FUNCTIONS
// ============================================

async function copyToClipboard(text) {
    if (!text || text.trim() === '') {
        showNotification('❌ Tidak ada teks untuk disalin', 'error');
        return false;
    }
    
    try {
        // Try modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showNotification('✅ Berhasil disalin ke clipboard', 'success');
            return true;
        } else {
            // Fallback for older browsers
            return copyFallback(text);
        }
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('❌ Gagal menyalin', 'error');
        return false;
    }
}

function copyFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (successful) {
            showNotification('✅ Berhasil disalin', 'success');
            return true;
        } else {
            showNotification('❌ Gagal menyalin', 'error');
            return false;
        }
    } catch (error) {
        document.body.removeChild(textarea);
        showNotification('❌ Browser tidak mendukung salin', 'error');
        return false;
    }
}

// ============================================
// 3. PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Setup based on current page
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('reso.html')) {
        setupResolutionPage();
    } else if (path.includes('preset.html')) {
        setupPresetPage();
    } else if (path.includes('dpi.html')) {
        setupDpiPage();
    } else if (path.includes('adb.html')) {
        setupAdbPage();
    } else if (path.includes('android.html')) {
        setupAndroidPage();
    }
    
    // Setup common features
    setupCommonFeatures();
});

// ============================================
// 4. COMMON FEATURES
// ============================================

function setupCommonFeatures() {
    // Setup back button navigation
    setupBackButtons();
    
    // Setup ripple effects
    setupRippleEffects();
    
    // Setup enter key for inputs
    setupEnterKey();
    
    // Setup output auto-scroll
    setupOutputScroll();
}

function setupBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add animation
            document.body.style.opacity = '0.8';
            document.body.style.transform = 'translateX(-10px)';
            document.body.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 300);
        });
    });
}

function setupRippleEffects() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;
        
        // Create ripple element
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
    
    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupEnterKey() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const active = document.activeElement;
            
            // Generate resolution on enter
            if (active && (active.id === 'lebar' || active.id === 'tinggi')) {
                generateResolution();
            }
            
            // Calculate DPI on enter
            if (active && (active.id === 'targetWidth' || active.id === 'nativeWidth' || active.id === 'nativeDpi')) {
                calculateDpi();
            }
        }
        
        // Escape to clear
        if (e.key === 'Escape') {
            clearOutput();
        }
    });
}

function setupOutputScroll() {
    // Auto scroll output into view when updated
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                const output = mutation.target;
                if (output.value && output.value.trim()) {
                    output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    });
    
    // Observe all output textareas
    const outputs = ['output', 'presetOutput', 'dpiOutput', 'adbOutput']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    
    outputs.forEach(output => {
        observer.observe(output, { 
            characterData: true, 
            childList: true, 
            subtree: true 
        });
    });
}

// ============================================
// 5. RESOLUTION PAGE FUNCTIONS
// ============================================

function setupResolutionPage() {
    console.log('Setting up Resolution page');
    
    // Auto focus first input
    const widthInput = document.getElementById('lebar');
    if (widthInput) {
        widthInput.focus();
        widthInput.addEventListener('focus', function() {
            this.select();
        });
    }
    
    // Setup generate button
    const generateBtn = document.querySelector('button[onclick*="generate"]');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateResolution);
    }
    
    // Setup copy button
    const copyBtn = document.querySelector('button[onclick*="copy"]');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyResolution);
    }
}

function generateResolution() {
    const width = document.getElementById('lebar')?.value;
    const height = document.getElementById('tinggi')?.value;
    const autoDpi = document.getElementById('autoDpi')?.checked;
    
    if (!width || !height) {
        showNotification('❌ Masukkan lebar dan tinggi', 'error');
        return;
    }
    
    // Calculate auto DPI if enabled
    let dpi = '';
    if (autoDpi) {
        const minDimension = Math.min(width, height);
        dpi = Math.round((minDimension / 360) * 440);
    }
    
    // Build command
    let cmd = `# Custom Resolution\n`;
    cmd += `# Width: ${width}px | Height: ${height}px\n\n`;
    cmd += `adb shell wm size ${width}x${height}\n`;
    
    if (autoDpi) {
        cmd += `adb shell wm density ${dpi}\n`;
        cmd += `# Auto DPI: ${dpi}\n`;
    }
    
    cmd += `\n# Reset to default:\n`;
    cmd += `# adb shell wm size reset\n`;
    cmd += `# adb shell wm density reset`;
    
    // Update output
    const output = document.getElementById('output');
    if (output) {
        output.value = cmd;
        currentCommands = cmd;
        
        // Add animation
        output.style.animation = 'none';
        setTimeout(() => {
            output.style.animation = 'pulse 0.5s';
        }, 10);
        
        showNotification('✅ Command generated', 'success');
    }
}

function copyResolution() {
    const output = document.getElementById('output');
    if (!output || !output.value.trim()) {
        showNotification('❌ Generate command dulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 6. PRESET PAGE FUNCTIONS
// ============================================

function setupPresetPage() {
    console.log('Setting up Preset page');
    
    // Setup preset cards
    const presetCards = document.querySelectorAll('.preset-card');
    presetCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPreset(this);
        });
    });
    
    // Setup copy button
    const copyBtn = document.getElementById('copyPresetBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPresetCommand);
    }
    
    // Auto select first preset
    if (presetCards.length > 0 && !selectedPreset) {
        setTimeout(() => {
            selectPreset(presetCards[0]);
        }, 500);
    }
}

function selectPreset(cardElement) {
    // Clear previous selection
    document.querySelectorAll('.preset-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Mark as selected
    cardElement.classList.add('active');
    selectedPreset = cardElement;
    
    // Get preset data
    const title = cardElement.querySelector('h4')?.textContent || 'Unknown';
    const resolution = cardElement.querySelector('.resolution')?.textContent || '';
    const dpi = cardElement.querySelector('.dpi')?.textContent || '';
    const desc = cardElement.querySelector('.preset-desc')?.textContent || '';
    
    // Extract numbers from resolution and dpi
    const resMatch = resolution.match(/\d+x\d+/);
    const dpiMatch = dpi.match(/\d+/);
    
    if (resMatch && dpiMatch) {
        generatePresetCommand(resMatch[0], dpiMatch[0], title, desc);
        showNotification(`✅ ${title} selected`, 'success');
    }
}

function generatePresetCommand(resolution, dpi, title, desc) {
    const cmd = `# ${title}\n`;
    cmd += `# ${desc}\n`;
    cmd += `# Resolution: ${resolution} | DPI: ${dpi}\n\n`;
    cmd += `adb shell wm size ${resolution}\n`;
    cmd += `adb shell wm density ${dpi}\n\n`;
    cmd += `# Reset to default:\n`;
    cmd += `# adb shell wm size reset\n`;
    cmd += `# adb shell wm density reset`;
    
    const output = document.getElementById('presetOutput');
    if (output) {
        output.value = cmd;
        currentCommands = cmd;
        
        // Show output section
        const outputSection = document.getElementById('outputSection');
        if (outputSection) {
            outputSection.classList.remove('hidden');
        }
    }
}

function copyPresetCommand() {
    const output = document.getElementById('presetOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Pilih preset dulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 7. DPI PAGE FUNCTIONS
// ============================================

function setupDpiPage() {
    console.log('Setting up DPI page');
    
    // Setup calculate button
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateDpi);
    }
    
    // Setup copy button
    const copyBtn = document.getElementById('copyDpiBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyDpiCommand);
    }
    
    // Setup DPI presets
    const dpiPresets = document.querySelectorAll('.dpi-preset');
    dpiPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            const dpi = this.getAttribute('data-dpi') || 
                       this.querySelector('.dpi-value')?.textContent.match(/\d+/)?.[0];
            if (dpi) {
                applyDpiPreset(dpi);
            }
        });
    });
    
    // Auto focus
    const targetWidth = document.getElementById('targetWidth');
    if (targetWidth) {
        targetWidth.focus();
    }
}

function calculateDpi() {
    const nativeWidth = document.getElementById('nativeWidth')?.value;
    const nativeDpi = document.getElementById('nativeDpi')?.value;
    const targetWidth = document.getElementById('targetWidth')?.value;
    
    if (!nativeWidth || !nativeDpi || !targetWidth) {
        showNotification('❌ Isi semua field', 'error');
        return;
    }
    
    // Calculate
    const nw = parseFloat(nativeWidth);
    const nd = parseFloat(nativeDpi);
    const tw = parseFloat(targetWidth);
    
    if (nw <= 0 || nd <= 0 || tw <= 0) {
        showNotification('❌ Nilai harus > 0', 'error');
        return;
    }
    
    const calculatedDpi = Math.round((tw / nw) * nd);
    const scaleFactor = (tw / nw).toFixed(2);
    
    // Update result display
    const resultDpi = document.getElementById('resultDpi');
    const resultScale = document.getElementById('resultScale');
    const resultStatus = document.getElementById('resultStatus');
    
    if (resultDpi) resultDpi.textContent = calculatedDpi + ' DPI';
    if (resultScale) resultScale.textContent = scaleFactor + 'x';
    
    // Determine status
    let status = '';
    let statusColor = '#3b82f6';
    
    if (calculatedDpi < 300) {
        status = 'Very Low (UI Besar)';
        statusColor = '#ef4444';
    } else if (calculatedDpi < 350) {
        status = 'Low (UI Agak Besar)';
        statusColor = '#f59e0b';
    } else if (calculatedDpi < 420) {
        status = 'Optimal (Standard)';
        statusColor = '#10b981';
    } else if (calculatedDpi < 500) {
        status = 'High (UI Kecil)';
        statusColor = '#3b82f6';
    } else {
        status = 'Very High (UI Sangat Kecil)';
        statusColor = '#8b5cf6';
    }
    
    if (resultStatus) {
        resultStatus.textContent = status;
        resultStatus.style.color = statusColor;
    }
    
    // Generate command
    const cmd = `# DPI Calculation Result\n`;
    cmd += `# Native: ${nw}px @ ${nd}dpi\n`;
    cmd += `# Target: ${tw}px @ ${calculatedDpi}dpi\n`;
    cmd += `# Scale Factor: ${scaleFactor}x\n\n`;
    cmd += `adb shell wm density ${calculatedDpi}\n\n`;
    cmd += `# Reset: adb shell wm density reset\n`;
    cmd += `# Note: ${status}`;
    
    const output = document.getElementById('dpiOutput');
    if (output) {
        output.value = cmd;
        currentCommands = cmd;
        
        // Show result section
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
            resultSection.classList.remove('hidden');
        }
        
        showNotification('✅ DPI calculated', 'success');
    }
}

function applyDpiPreset(dpiValue) {
    const dpi = parseInt(dpiValue);
    if (isNaN(dpi)) return;
    
    // Generate command for preset
    const cmd = `# DPI Preset: ${dpi} DPI\n`;
    cmd += `# Recommended for: ${getDpiDescription(dpi)}\n\n`;
    cmd += `adb shell wm density ${dpi}\n\n`;
    cmd += `# Reset: adb shell wm density reset`;
    
    const output = document.getElementById('dpiOutput');
    if (output) {
        output.value = cmd;
        currentCommands = cmd;
        
        // Update result display
        const resultDpi = document.getElementById('resultDpi');
        const resultScale = document.getElementById('resultScale');
        const resultStatus = document.getElementById('resultStatus');
        
        if (resultDpi) resultDpi.textContent = dpi + ' DPI';
        if (resultScale) resultScale.textContent = 'Preset';
        if (resultStatus) {
            resultStatus.textContent = getDpiDescription(dpi);
            resultStatus.style.color = '#3b82f6';
        }
        
        // Show result section
        const resultSection = document.getElementById('resultSection');
        if (resultSection) {
            resultSection.classList.remove('hidden');
        }
        
        showNotification(`✅ DPI ${dpi} selected`, 'success');
    }
}

function getDpiDescription(dpi) {
    const descriptions = {
        320: 'Low-end Devices',
        360: 'Standard/Default',
        400: 'Mid-range Devices',
        440: 'High-end Devices',
        480: 'Flagship Devices',
        560: 'Ultra HD/Extreme'
    };
    
    return descriptions[dpi] || 'Custom DPI';
}

function copyDpiCommand() {
    const output = document.getElementById('dpiOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Hitung DPI dulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 8. ADB HELPER PAGE FUNCTIONS
// ============================================

function setupAdbPage() {
    console.log('Setting up ADB Helper page');
    
    // Setup command cards
    const commandCards = document.querySelectorAll('.command-card');
    commandCards.forEach(card => {
        card.addEventListener('click', function() {
            selectCommand(this);
        });
    });
    
    // Setup copy button
    const copyBtn = document.getElementById('copyAdbBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAdbCommand);
    }
    
    // Setup clear button
    const clearBtn = document.getElementById('clearAdbBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAdbCommand);
    }
    
    // Auto select first command
    if (commandCards.length > 0 && !selectedCommand) {
        setTimeout(() => {
            selectCommand(commandCards[0]);
        }, 500);
    }
}

function selectCommand(cardElement) {
    // Clear previous selection
    document.querySelectorAll('.command-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Mark as selected
    cardElement.classList.add('active');
    selectedCommand = cardElement;
    
    // Get command data
    const title = cardElement.querySelector('h4')?.textContent || '';
    const code = cardElement.querySelector('.command-code')?.textContent || '';
    const desc = cardElement.querySelector('.command-desc')?.textContent || '';
    
    // Generate output
    const output = `# ${title}\n`;
    output += `# ${desc}\n\n`;
    output += `${code}\n\n`;
    output += `# How to use:\n`;
    output += `# 1. Connect device via USB/WiFi ADB\n`;
    output += `# 2. Open terminal/command prompt\n`;
    output += `# 3. Paste the command above\n`;
    output += `# 4. Press Enter to execute`;
    
    const adbOutput = document.getElementById('adbOutput');
    if (adbOutput) {
        adbOutput.value = output;
        currentCommands = output;
        
        // Show output section
        const outputSection = document.getElementById('adbOutputSection');
        if (outputSection) {
            outputSection.classList.remove('hidden');
        }
        
        showNotification(`✅ ${title} selected`, 'success');
    }
}

function copyAdbCommand() {
    const output = document.getElementById('adbOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Pilih command dulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

function clearAdbCommand() {
    const output = document.getElementById('adbOutput');
    if (output) {
        output.value = '';
    }
    
    // Clear selection
    document.querySelectorAll('.command-card').forEach(card => {
        card.classList.remove('active');
    });
    
    selectedCommand = null;
    
    // Hide output section
    const outputSection = document.getElementById('adbOutputSection');
    if (outputSection) {
        outputSection.classList.add('hidden');
    }
    
    showNotification('🗑️ Output cleared', 'info');
}

// ============================================
// 9. ANDROID PAGE FUNCTIONS
// ============================================

function setupAndroidPage() {
    console.log('Setting up Android page');
    
    // Setup method cards
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            selectMethod(this);
        });
    });
    
    // Setup generate script button
    const genBtn = document.getElementById('generateScriptBtn');
    if (genBtn) {
        genBtn.addEventListener('click', generateAndroidScript);
    }
    
    // Setup copy button
    const copyBtn = document.getElementById('copyAndroidBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAndroidScript);
    }
}

function selectMethod(cardElement) {
    // Clear previous selection
    document.querySelectorAll('.method-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Mark as selected
    cardElement.classList.add('active');
    
    // Get method data
    const method = cardElement.getAttribute('data-method') || 'termux';
    const title = cardElement.querySelector('h4')?.textContent || '';
    
    // Show guide
    showMethodGuide(method);
    showNotification(`✅ ${title} selected`, 'success');
}

function showMethodGuide(method) {
    const guideSection = document.getElementById('methodGuide');
    if (!guideSection) return;
    
    const guides = {
        termux: `
            <h4>Termux Method</h4>
            <p>Run ADB commands directly on Android using Termux.</p>
            
            <div class="steps">
                <h5>Steps:</h5>
                <ol>
                    <li>Install Termux from F-Droid or Play Store</li>
                    <li>Install ADB: <code>pkg install android-tools</code></li>
                    <li>Enable USB Debugging on target device</li>
                    <li>Connect devices via USB OTG</li>
                    <li>Run the generated script</li>
                </ol>
            </div>
        `,
        ladb: `
            <h4>LADB Method</h4>
            <p>Use wireless ADB debugging via LADB app.</p>
            
            <div class="steps">
                <h5>Steps:</h5>
                <ol>
                    <li>Install LADB from Play Store (paid)</li>
                    <li>Enable Wireless Debugging in Developer Options</li>
                    <li>Note the IP address and port</li>
                    <li>Connect in LADB app</li>
                    <li>Run commands directly in LADB</li>
                </ol>
            </div>
        `,
        shizuku: `
            <h4>Shizuku Method</h4>
            <p>Rootless ADB execution via Shizuku framework.</p>
            
            <div class="steps">
                <h5>Steps:</h5>
                <ol>
                    <li>Install Shizuku from GitHub</li>
                    <li>Start Shizuku via ADB (need PC once)</li>
                    <li>Install Shizuku in Termux</li>
                    <li>Run commands with <code>shizuku exec</code></li>
                </ol>
            </div>
        `
    };
    
    const guideContent = document.getElementById('guideContent');
    if (guideContent) {
        guideContent.innerHTML = guides[method] || guides.termux;
    }
    
    guideSection.classList.remove('hidden');
}

function generateAndroidScript() {
    // Get current commands
    const commands = currentCommands || 
                    document.getElementById('output')?.value ||
                    document.getElementById('presetOutput')?.value ||
                    document.getElementById('dpiOutput')?.value ||
                    document.getElementById('adbOutput')?.value;
    
    if (!commands || commands.trim() === '') {
        showNotification('❌ Generate commands dulu', 'error');
        return;
    }
    
    // Filter ADB commands
    const adbCommands = commands.split('\n')
        .filter(line => line.trim() && !line.trim().startsWith('#'))
        .map(line => line.trim())
        .join('\n');
    
    // Generate Termux script
    const script = `#!/data/data/com.termux/files/usr/bin/bash
echo "==========================================="
echo "    ADB EXECUTOR SCRIPT FOR TERMUX"
echo "==========================================="
echo ""
echo "Installing required packages..."
pkg install android-tools -y
echo ""
echo "Checking connection..."
adb devices
echo ""
echo "Executing commands..."
${adbCommands}
echo ""
echo "✅ Done!"
echo "==========================================="
read -p "Press Enter to exit..."`;
    
    const output = document.getElementById('androidOutput');
    if (output) {
        output.value = script;
        showNotification('✅ Script generated for Termux', 'success');
    }
}

function copyAndroidScript() {
    const output = document.getElementById('androidOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Generate script dulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 10. UTILITY FUNCTIONS
// ============================================

function clearOutput() {
    const outputs = ['output', 'presetOutput', 'dpiOutput', 'adbOutput', 'androidOutput']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    
    outputs.forEach(output => {
        output.value = '';
    });
    
    // Clear selections
    document.querySelectorAll('.preset-card.active, .command-card.active').forEach(el => {
        el.classList.remove('active');
    });
    
    selectedPreset = null;
    selectedCommand = null;
    currentCommands = '';
    
    showNotification('🗑️ All outputs cleared', 'info');
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ============================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// ============================================

// Core functions
window.showNotification = showNotification;
window.copyToClipboard = copyToClipboard;

// Resolution page
window.generateResolution = generateResolution;
window.copyResolution = copyResolution;

// Preset page
window.selectPreset = selectPreset;
window.copyPresetCommand = copyPresetCommand;

// DPI page
window.calculateDpi = calculateDpi;
window.applyDpiPreset = applyDpiPreset;
window.copyDpiCommand = copyDpiCommand;

// ADB page
window.selectCommand = selectCommand;
window.copyAdbCommand = copyAdbCommand;
window.clearAdbCommand = clearAdbCommand;

// Android page
window.selectMethod = selectMethod;
window.generateAndroidScript = generateAndroidScript;
window.copyAndroidScript = copyAndroidScript;

// Utility
window.clearOutput = clearOutput;
window.downloadFile = downloadFile;

console.log('All app functions loaded successfully');