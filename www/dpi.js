// Inisialisasi halaman DPI
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('nativeWidth')) return;
  
  console.log('DPI page initialized');
  
  // Setup event listeners
  setupDpiPage();
  
  // Auto focus
  setTimeout(() => {
    const targetWidth = document.getElementById('targetWidth');
    if (targetWidth) targetWidth.focus();
  }, 300);
});

// Setup halaman DPI
function setupDpiPage() {
  // Setup calculate button
  const calcBtn = document.querySelector('button[onclick="calculateDpi()"]');
  if (calcBtn) {
    calcBtn.onclick = calculateDpi;
  }
  
  // Setup copy button
  const copyBtn = document.querySelector('button[onclick="copyDpiCommand()"]');
  if (copyBtn) {
    copyBtn.onclick = copyDpiCommand;
  }
  
  // Setup DPI preset buttons
  document.querySelectorAll('.dpi-preset').forEach(preset => {
    preset.addEventListener('click', function() {
      const dpiValue = parseInt(this.querySelector('.dpi-value').textContent);
      setDpiPreset(dpiValue);
    });
  });
  
  // Enter key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const active = document.activeElement;
      if (active && (active.id === 'nativeWidth' || active.id === 'nativeDpi' || active.id === 'targetWidth')) {
        calculateDpi();
      }
    }
  });
}

// Hitung DPI
function calculateDpi() {
  const nativeWidth = document.getElementById('nativeWidth')?.value;
  const nativeDpi = document.getElementById('nativeDpi')?.value;
  const targetWidth = document.getElementById('targetWidth')?.value;
  
  if (!nativeWidth || !nativeDpi || !targetWidth) {
    showNotification('❌ Harap isi semua field!', 'error');
    return;
  }
  
  const nw = parseInt(nativeWidth);
  const nd = parseInt(nativeDpi);
  const tw = parseInt(targetWidth);
  
  if (nw <= 0 || nd <= 0 || tw <= 0) {
    showNotification('❌ Nilai harus lebih dari 0!', 'error');
    return;
  }
  
  const calculatedDpi = Math.round((tw / nw) * nd);
  const scaleFactor = (tw / nw).toFixed(2);
  
  // Update hasil
  document.getElementById('resultDpi').textContent = calculatedDpi + ' DPI';
  document.getElementById('resultScale').textContent = scaleFactor + 'x';
  
  // Tentukan status
  let status = '';
  if (calculatedDpi < 300) status = 'Very Low (UI Besar)';
  else if (calculatedDpi < 350) status = 'Low (UI Agak Besar)';
  else if (calculatedDpi < 420) status = 'Optimal (Standard)';
  else if (calculatedDpi < 500) status = 'High (UI Kecil)';
  else status = 'Very High (UI Sangat Kecil)';
  
  document.getElementById('resultStatus').textContent = status;
  
  // Generate command
  const cmd = `# DPI Calculation Result\n` +
              `# Native: ${nw}px @ ${nd}dpi\n` +
              `# Target: ${tw}px @ ${calculatedDpi}dpi\n` +
              `# Scale Factor: ${scaleFactor}x\n\n` +
              `adb shell wm density ${calculatedDpi}\n\n` +
              `# Reset ke default:\n` +
              `# adb shell wm density reset\n\n` +
              `# Note: ${status}`;
  
  const output = document.getElementById('dpiOutput');
  if (output) {
    output.value = cmd;
    output.style.animation = 'none';
    setTimeout(() => {
      output.style.animation = 'pulse 0.5s';
    }, 10);
  }
  
  // Tampilkan result section
  const resultSection = document.getElementById('resultSection');
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  showNotification('✅ DPI berhasil dihitung!', 'success');
}

// Set DPI preset
function setDpiPreset(dpiValue) {
  const cmd = `# DPI Preset: ${dpiValue} DPI\n` +
              `# Cocok untuk: ${getDpiDescription(dpiValue)}\n\n` +
              `adb shell wm density ${dpiValue}\n\n` +
              `# Reset ke default:\n` +
              `# adb shell wm density reset`;
  
  const output = document.getElementById('dpiOutput');
  if (output) {
    output.value = cmd;
  }
  
  // Update result display
  document.getElementById('resultDpi').textContent = dpiValue + ' DPI';
  document.getElementById('resultScale').textContent = 'Preset';
  document.getElementById('resultStatus').textContent = getDpiDescription(dpiValue);
  
  // Tampilkan result section
  const resultSection = document.getElementById('resultSection');
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  showNotification(`✅ DPI preset ${dpiValue} dipilih!`, 'success');
}

// Get DPI description
function getDpiDescription(dpi) {
  const descriptions = {
    320: 'Device Low-end / UI Besar',
    360: 'Standard / Default',
    400: 'Mid-range / UI Optimal',
    440: 'High-end / UI Kecil',
    480: 'Flagship / UI Sangat Kecil',
    560: 'Ultra HD / Extreme'
  };
  return descriptions[dpi] || 'Custom DPI';
}

// Copy DPI command
function copyDpiCommand() {
  const output = document.getElementById('dpiOutput');
  if (!output || !output.value.trim()) {
    showNotification('❌ Hitung DPI terlebih dahulu!', 'error');
    return;
  }
  
  const button = document.querySelector('button[onclick="copyDpiCommand()"]');
  copyToClipboard(output.value, button);
}

// Export fungsi ke global scope
window.calculateDpi = calculateDpi;
window.setDpiPreset = setDpiPreset;
window.copyDpiCommand = copyDpiCommand;