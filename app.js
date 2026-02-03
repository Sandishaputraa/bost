// ============================================
// CORE APP FUNCTIONS - ALL IN ONE FILE
// ============================================

// Global variables
let currentCommands = '';
let selectedPreset = null;
let selectedCommand = null;

// ============================================
// 1. NOTIFICATION SYSTEM - FIXED
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
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
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// ============================================
// 2. CLIPBOARD FUNCTIONS - IMPROVED
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
        return copyFallback(text);
    }
}

function copyFallback(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        
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
        console.error('Fallback copy failed:', error);
        showNotification('❌ Browser tidak mendukung salin', 'error');
        return false;
    }
}

// ============================================
// 3. PAGE INITIALIZATION - FIXED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized');
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup based on current page
    const path = window.location.pathname.toLowerCase();
    const page = path.split('/').pop() || 'index.html';
    
    if (page.includes('reso')) {
        setupResolutionPage();
    } else if (page.includes('preset')) {
        setupPresetPage();
    } else if (page.includes('dpi')) {
        setupDpiPage();
    } else if (page.includes('adb')) {
        setupAdbPage();
    } else if (page.includes('android')) {
        setupAndroidPage();
    } else {
        setupHomePage();
    }
    
    // Setup common features
    setupCommonFeatures();
});

function setupMobileMenu() {
    const menuBtn = document.querySelector('.menu');
    const closeBtn = document.querySelector('.menu-close');
    const overlay = document.querySelector('.menu-overlay');
    
    if (menuBtn && overlay) {
        menuBtn.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

function setupHomePage() {
    console.log('Setting up Home page');
    
    // Add animation to feature cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
    });
}

// ============================================
// 4. COMMON FEATURES - IMPROVED
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
                window.history.back();
            }, 300);
        });
    });
}

function setupRippleEffects() {
    document.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button || button.classList.contains('no-ripple')) return;
        
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
}

function setupEnterKey() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
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
    const outputs = ['output', 'presetOutput', 'dpiOutput', 'adbOutput', 'androidOutput']
        .map(id => document.getElementById(id))
        .filter(Boolean);
    
    outputs.forEach(output => {
        output.addEventListener('input', function() {
            this.scrollTop = this.scrollHeight;
        });
    });
}

// ============================================
// 5. RESOLUTION PAGE FUNCTIONS - FIXED
// ============================================

function setupResolutionPage() {
    console.log('Setting up Resolution page');
    
    // Auto focus first input
    const widthInput = document.getElementById('lebar');
    if (widthInput) {
        setTimeout(() => {
            widthInput.focus();
            widthInput.select();
        }, 300);
        
        widthInput.addEventListener('focus', function() {
            this.select();
        });
    }
    
    // Setup generate button
    const generateBtn = document.querySelector('button[onclick*="generate"], button:has(i.fa-bolt)');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateResolution);
    }
    
    // Setup copy button
    const copyBtn = document.querySelector('button[onclick*="copy"], button:has(i.fa-copy)');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyResolution);
    }
}

function generateResolution() {
    const widthInput = document.getElementById('lebar');
    const heightInput = document.getElementById('tinggi');
    const autoDpiCheckbox = document.getElementById('autoDpi');
    
    if (!widthInput || !heightInput) {
        showNotification('❌ Input tidak ditemukan', 'error');
        return;
    }
    
    const width = widthInput.value.trim();
    const height = heightInput.value.trim();
    const autoDpi = autoDpiCheckbox ? autoDpiCheckbox.checked : false;
    
    if (!width || !height || isNaN(width) || isNaN(height)) {
        showNotification('❌ Masukkan lebar dan tinggi yang valid', 'error');
        return;
    }
    
    const widthNum = parseInt(width);
    const heightNum = parseInt(height);
    
    if (widthNum <= 0 || heightNum <= 0) {
        showNotification('❌ Nilai harus lebih besar dari 0', 'error');
        return;
    }
    
    // Calculate auto DPI if enabled
    let dpi = '';
    if (autoDpi) {
        const minDimension = Math.min(widthNum, heightNum);
        dpi = Math.max(120, Math.min(640, Math.round((minDimension / 360) * 440)));
    }
    
    // Build command
    let cmd = `# Custom Resolution\n`;
    cmd += `# Width: ${widthNum}px | Height: ${heightNum}px\n\n`;
    cmd += `adb shell wm size ${widthNum}x${heightNum}\n`;
    
    if (autoDpi) {
        cmd += `adb shell wm density ${dpi}\n`;
        cmd += `# Auto DPI: ${dpi} (calculated)\n`;
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
            output.style.animation = 'pulse 0.5s ease';
        }, 10);
        
        showNotification(`✅ Command generated: ${widthNum}x${heightNum}`, 'success');
    }
}

function copyResolution() {
    const output = document.getElementById('output');
    if (!output || !output.value.trim()) {
        showNotification('❌ Generate command terlebih dahulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 6. PRESET PAGE FUNCTIONS - FIXED
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
    const copyBtn = document.querySelector('#copyPresetBtn, button:has(i.fa-copy)');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPresetCommand);
    }
    
    // Auto select first preset if none selected
    if (presetCards.length > 0 && !selectedPreset) {
        setTimeout(() => {
            selectPreset(presetCards[0]);
        }, 100);
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
    const resMatch = resolution.match(/(\d+)x(\d+)/);
    const dpiMatch = dpi.match(/(\d+)/);
    
    if (resMatch && dpiMatch) {
        const width = resMatch[1];
        const height = resMatch[2];
        const density = dpiMatch[0];
        
        generatePresetCommand(`${width}x${height}`, density, title, desc);
        showNotification(`✅ ${title} selected`, 'success');
    } else {
        showNotification('❌ Format preset tidak valid', 'error');
    }
}

function generatePresetCommand(resolution, dpi, title, desc) {
    let cmd = `# ${title}\n`;
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
            outputSection.style.animation = 'fadeInUp 0.3s ease';
        }
    }
}

function copyPresetCommand() {
    const output = document.getElementById('presetOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Pilih preset terlebih dahulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 7. DPI PAGE FUNCTIONS - FIXED
// ============================================

function setupDpiPage() {
    console.log('Setting up DPI page');
    
    // Setup calculate button
    const calcBtn = document.querySelector('#calculateBtn, button:has(i.fa-calculator)');
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateDpi);
    }
    
    // Setup copy button
    const copyBtn = document.querySelector('#copyDpiBtn, button:has(i.fa-copy)');
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
        setTimeout(() => {
            targetWidth.focus();
            targetWidth.select();
        }, 300);
    }
}

function calculateDpi() {
    const nativeWidth = document.getElementById('nativeWidth')?.value;
    const nativeDpi = document.getElementById('nativeDpi')?.value;
    const targetWidth = document.getElementById('targetWidth')?.value;
    
    if (!nativeWidth || !nativeDpi || !targetWidth) {
        showNotification('❌ Isi semua field terlebih dahulu', 'error');
        return;
    }
    
    // Parse values
    const nw = parseFloat(nativeWidth);
    const nd = parseFloat(nativeDpi);
    const tw = parseFloat(targetWidth);
    
    if (isNaN(nw) || isNaN(nd) || isNaN(tw)) {
        showNotification('❌ Masukkan angka yang valid', 'error');
        return;
    }
    
    if (nw <= 0 || nd <= 0 || tw <= 0) {
        showNotification('❌ Nilai harus lebih besar dari 0', 'error');
        return;
    }
    
    // Calculate
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
    
    if (calculatedDpi < 200) {
        status = 'Sangat Rendah (UI Sangat Besar)';
        statusColor = '#ef4444';
    } else if (calculatedDpi < 300) {
        status = 'Rendah (UI Besar)';
        statusColor = '#f59e0b';
    } else if (calculatedDpi < 350) {
        status = 'Sedang (UI Normal)';
        statusColor = '#3b82f6';
    } else if (calculatedDpi < 420) {
        status = 'Optimal (Standard)';
        statusColor = '#10b981';
    } else if (calculatedDpi < 500) {
        status = 'Tinggi (UI Kecil)';
        statusColor = '#8b5cf6';
    } else {
        status = 'Sangat Tinggi (UI Sangat Kecil)';
        statusColor = '#ec4899';
    }
    
    if (resultStatus) {
        resultStatus.textContent = status;
        resultStatus.style.color = statusColor;
    }
    
    // Generate command
    let cmd = `# DPI Calculation Result\n`;
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
            resultSection.style.animation = 'fadeInUp 0.3s ease';
        }
        
        showNotification('✅ DPI berhasil dihitung', 'success');
    }
}

function applyDpiPreset(dpiValue) {
    const dpi = parseInt(dpiValue);
    if (isNaN(dpi) || dpi <= 0) {
        showNotification('❌ DPI tidak valid', 'error');
        return;
    }
    
    // Generate command for preset
    let cmd = `# DPI Preset: ${dpi} DPI\n`;
    cmd += `# Recommended for: ${getDpiDescription(dpi)}\n\n`;
    cmd += `adb shell wm density ${dpi}\n\n`;
    cmd += `# Reset: adb shell wm density reset`;
    
    const output = document.getElementById('dpiOutput');
    if (output) {
        output.value = cmd;
        currentCommands = cmd;
        
        // Update result display
        const resultDpi = document.getElemenById('resultDpi');
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
            resultSection.style.animation = 'fadeInUp 0.3s ease';
        }
        
        showNotification(`✅ DPI ${dpi} dipilih`, 'success');
    }
}

function getDpiDescription(dpi) {
    const descriptions = {
        120: 'Perangkat sangat lama',
        160: 'Perangkat low-end lama',
        240: 'Perangkat low-end',
        280: 'Perangkat entry-level',
        320: 'Perangkat menengah',
        360: 'Standar/default',
        400: 'Perangkat mid-range',
        440: 'Perangkat high-end',
        480: 'Perangkat flagship',
        560: 'Ultra HD/Extreme',
        640: 'Maximum limit'
    };
    
    return descriptions[dpi] || 'DPI Kustom';
}

function copyDpiCommand() {
    const output = document.getElementById('dpiOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Hitung DPI terlebih dahulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 8. ADB HELPER PAGE FUNCTIONS - FIXED
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
    const copyBtn = document.querySelector('#copyAdbBtn, button:has(i.fa-copy)');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAdbCommand);
    }
    
    // Setup clear button
    const clearBtn = document.querySelector('#clearAdbBtn, button:has(i.fa-trash)');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAdbCommand);
    }
    
    // Auto select first command
    if (commandCards.length > 0 && !selectedCommand) {
        setTimeout(() => {
            selectCommand(commandCards[0]);
        }, 100);
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
    let output = `# ${title}\n`;
    output += `# ${desc}\n\n`;
    output += `${code}\n\n`;
    output += `# Cara penggunaan:\n`;
    output += `# 1. Hubungkan device via USB/WiFi ADB\n`;
    output += `# 2. Buka terminal/command prompt\n`;
    output += `# 3. Tempel command di atas\n`;
    output += `# 4. Tekan Enter untuk mengeksekusi`;
    
    const adbOutput = document.getElementById('adbOutput');
    if (adbOutput) {
        adbOutput.value = output;
        currentCommands = output;
        
        // Show output section
        const outputSection = document.getElementById('adbOutputSection');
        if (outputSection) {
            outputSection.classList.remove('hidden');
            outputSection.style.animation = 'fadeInUp 0.3s ease';
        }
        
        showNotification(`✅ ${title} dipilih`, 'success');
    }
}

function copyAdbCommand() {
    const output = document.getElementById('adbOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Pilih command terlebih dahulu', 'error');
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
    
    showNotification('🗑️ Output berhasil dihapus', 'info');
}

// ============================================
// 9. ANDROID PAGE FUNCTIONS - FIXED
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
    const genBtn = document.querySelector('#generateScriptBtn, button:has(i.fa-code)');
    if (genBtn) {
        genBtn.addEventListener('click', generateAndroidScript);
    }
    
    // Setup copy button
    const copyBtn = document.querySelector('#copyAndroidBtn, button:has(i.fa-copy)');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyAndroidScript);
    }
    
    // Auto select first method
    if (methodCards.length > 0) {
        setTimeout(() => {
            selectMethod(methodCards[0]);
        }, 100);
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
    showNotification(`✅ ${title} dipilih`, 'success');
}

function showMethodGuide(method) {
    const guideSection = document.getElementById('methodGuide');
    if (!guideSection) return;
    
    const guides = {
        termux: `
            <h4><i class="fas fa-terminal"></i> Metode Termux</h4>
            <p>Jalankan command ADB langsung di Android menggunakan Termux.</p>
            
            <div class="steps">
                <h5>Langkah-langkah:</h5>
                <ol>
                    <li>Install Termux dari F-Droid atau Play Store</li>
                    <li>Update package: <code>pkg update && pkg upgrade</code></li>
                    <li>Install ADB: <code>pkg install android-tools</code></li>
                    <li>Aktifkan USB Debugging di device target</li>
                    <li>Hubungkan device via USB OTG</li>
                    <li>Jalankan script yang digenerate</li>
                </ol>
            </div>
            
            <div class="note">
                <strong>Catatan:</strong> Diperlukan kabel USB OTG dan akses ADB sudah diaktifkan.
            </div>
        `,
        ladb: `
            <h4><i class="fas fa-wifi"></i> Metode LADB</h4>
            <p>Gunakan debugging ADB wireless via aplikasi LADB.</p>
            
            <div class="steps">
                <h5>Langkah-langkah:</h5>
                <ol>
                    <li>Install LADB dari Play Store (berbayar)</li>
                    <li>Aktifkan Wireless Debugging di Developer Options</li>
                    <li>Catat alamat IP dan port yang muncul</li>
                    <li>Hubungkan di aplikasi LADB</li>
                    <li>Jalankan command langsung di LADB</li>
                </ol>
            </div>
            
            <div class="note">
                <strong>Catatan:</strong> Metode ini memerlukan koneksi WiFi yang stabil.
            </div>
        `,
        shizuku: `
            <h4><i class="fas fa-cogs"></i> Metode Shizuku</h4>
            <p>Eksekusi ADB tanpa root via framework Shizuku.</p>
            
            <div class="steps">
                <h5>Langkah-langkah:</h5>
                <ol>
                    <li>Install Shizuku dari GitHub (shizuku.rikka.app)</li>
                    <li>Start Shizuku via ADB (perlukan PC sekali saja)</li>
                    <li>Install Shizuku di Termux: <code>pkg install shizuku</code></li>
                    <li>Jalankan command dengan <code>shizuku exec</code> prefix</li>
                </ol>
            </div>
            
            <div class="note">
                <strong>Catatan:</strong> Lebih kompleks tapi powerful untuk advanced users.
            </div>
        `
    };
    
    const guideContent = document.getElementById('guideContent');
    if (guideContent) {
        guideContent.innerHTML = guides[method] || guides.termux;
        guideSection.classList.remove('hidden');
        guideSection.style.animation = 'fadeInUp 0.3s ease';
    }
}

function generateAndroidScript() {
    // Get current commands from any output
    let commands = '';
    const outputIds = ['output', 'presetOutput', 'dpiOutput', 'adbOutput'];
    
    for (const id of outputIds) {
        const element = document.getElementById(id);
        if (element && element.value.trim()) {
            commands = element.value;
            break;
        }
    }
    
    if (!commands.trim()) {
        showNotification('❌ Generate command terlebih dahulu', 'error');
        return;
    }
    
    // Filter ADB commands (remove comments)
    const adbCommands = commands.split('\n')
        .filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('#');
        })
        .map(line => line.trim())
        .join('\n');
    
    if (!adbCommands) {
        showNotification('❌ Tidak ada command ADB yang valid', 'error');
        return;
    }
    
    // Generate Termux script
    let script = `#!/data/data/com.termux/files/usr/bin/bash
echo "==========================================="
echo "    ADB EXECUTOR SCRIPT FOR TERMUX"
echo "==========================================="
echo ""
echo "Menginstall package yang diperlukan..."
pkg install android-tools -y
echo ""
echo "Memeriksa koneksi..."
adb devices
echo ""
echo "Menjalankan command..."
${adbCommands}
echo ""
echo "✅ Selesai!"
echo "==========================================="
read -p "Tekan Enter untuk keluar..."`;

    const output = document.getElementById('androidOutput');
    if (output) {
        output.value = script;
        
        // Show output section
        const outputSection = document.getElementById('androidOutputSection');
        if (outputSection) {
            outputSection.classList.remove('hidden');
            outputSection.style.animation = 'fadeInUp 0.3s ease';
        }
        
        showNotification('✅ Script berhasil digenerate untuk Termux', 'success');
    }
}

function copyAndroidScript() {
    const output = document.getElementById('androidOutput');
    if (!output || !output.value.trim()) {
        showNotification('❌ Generate script terlebih dahulu', 'error');
        return;
    }
    
    copyToClipboard(output.value);
}

// ============================================
// 10. UTILITY FUNCTIONS
// ============================================

function clearOutput() {
    // Clear all outputs
    const outputIds = ['output', 'presetOutput', 'dpiOutput', 'adbOutput', 'androidOutput'];
    
    outputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    
    // Clear selections
    document.querySelectorAll('.preset-card.active, .command-card.active, .method-card.active').forEach(el => {
        el.classList.remove('active');
    });
    
    // Hide output sections
    document.querySelectorAll('[id$="Section"]').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Reset global variables
    selectedPreset = null;
    selectedCommand = null;
    currentCommands = '';
    
    showNotification('🗑️ Semua output berhasil dihapus', 'info');
}

function downloadFile(filename, content) {
    try {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        showNotification(`✅ File ${filename} berhasil diunduh`, 'success');
    } catch (error) {
        showNotification('❌ Gagal mengunduh file', 'error');
        console.error('Download failed:', error);
    }
}

// ============================================
// 11. EXPORT FUNCTIONS TO GLOBAL SCOPE
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

console.log('✅ All app functions loaded successfully');t
       

// ============================================
// SINGLE TOGGLE SWITCH SYSTEM
// ============================================

class ToggleSwitch {
    constructor() {
        this.isOn = false;
        this.init();
    }
    
    init() {
        // Load saved state
        this.isOn = localStorage.getItem('toggleState') === 'true';
        
        // Create toggles for all pages
        this.createToggles();
    }
    
    createToggles() {
        // Find all places where toggle should be
        const targets = document.querySelectorAll('.toggle-target, .input-group, .btn-group');
        
        targets.forEach(target => {
            if (target.querySelector('.single-toggle')) return;
            
            const toggleHTML = `
                <div class="action-grid">
                    <div class="single-toggle">
                        <div class="toggle-track ${this.isOn ? 'on' : 'off'}">
                            <div class="toggle-slider"></div>
                        </div>
                    </div>
                    <button class="apply-btn" onclick="window.toggleSystem.applyCurrent()">
                        <i class="fas fa-rocket"></i> Apply
                    </button>
                </div>
            `;
            
            target.insertAdjacentHTML('afterend', toggleHTML);
        });
        
        // Add click listeners
        document.querySelectorAll('.toggle-track').forEach(track => {
            track.addEventListener('click', (e) => this.toggle(e.currentTarget));
        });
    }
    
    toggle(trackElement) {
        // Toggle state
        this.isOn = !this.isOn;
        
        // Update UI
        trackElement.classList.toggle('on');
        trackElement.classList.toggle('off');
        
        // Animate slider
        const slider = trackElement.querySelector('.toggle-slider');
        slider.classList.add('moving');
        setTimeout(() => slider.classList.remove('moving'), 300);
        
        // Save state
        localStorage.setItem('toggleState', this.isOn);
        
        // If auto-apply is on, apply immediately
        if (this.isOn) {
            this.applyCurrent();
        }
    }
    
    applyCurrent() {
        // Get current command based on page
        const command = this.getCurrentCommand();
        
        if (!command) {
            showNotification('❌ No command to apply', 'error');
            return;
        }
        
        // Execute via preferred method
        this.executeCommand(command);
    }
    
    getCurrentCommand() {
        // Detect which page we're on and get command
        const path = window.location.pathname;
        
        if (path.includes('reso.html')) {
            return this.getResolutionCommand();
        } else if (path.includes('dpi.html')) {
            return this.getDpiCommand();
        } else if (path.includes('preset.html')) {
            return this.getPresetCommand();
        }
        
        return null;
    }
    
    getResolutionCommand() {
        const width = document.getElementById('lebar')?.value;
        const height = document.getElementById('tinggi')?.value;
        
        if (!width || !height) {
            showNotification('❌ Enter width and height', 'error');
            return null;
        }
        
        return `adb shell wm size ${width}x${height}`;
    }
    
    getDpiCommand() {
        const dpi = document.getElementById('resultDpi')?.textContent.match(/\d+/)?.[0] ||
                   document.querySelector('.dpi-value')?.textContent.match(/\d+/)?.[0];
        
        if (!dpi) {
            showNotification('❌ Calculate DPI first', 'error');
            return null;
        }
        
        return `adb shell wm density ${dpi}`;
    }
    
    executeCommand(command) {
        // Try different execution methods
        const methods = [
            () => this.viaTermux(command),
            () => this.viaLadb(command),
            () => this.copyToClipboard(command)
        ];
        
        // Try each method until one works
        for (const method of methods) {
            try {
                method();
                showNotification('✅ Command applied', 'success');
                break;
            } catch (e) {
                continue;
            }
        }
    }
    
    viaTermux(command) {
        window.open(`termux://execute?cmd=${encodeURIComponent(command)}`, '_blank');
    }
    
    viaLadb(command) {
        window.open(`ladb://command?cmd=${encodeURIComponent(command)}`, '_blank');
    }
    
    copyToClipboard(command) {
        navigator.clipboard.writeText(command);
        showNotification('📋 Copied! Paste in terminal', 'info');
    }
}

// Initialize and make global
window.toggleSystem = new ToggleSwitch();

// Auto-init on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.toggleSystem.init();
    });
} else {
    window.toggleSystem.init();
}
