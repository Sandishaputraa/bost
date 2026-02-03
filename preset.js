// Di setiap file JS, tambahkan di awal:
console.log('File loaded: ' + window.location.pathname);

// Cek apakah fungsi tersedia
console.log('copyPresetCommand available:', typeof copyPresetCommand);
console.log('resetPreset available:', typeof resetPreset);

// Variables untuk menyimpan preset yang dipilih
let selectedPreset = null;

// Fungsi untuk memilih preset
function selectPreset(id, resolution, dpi, name) {
  // Reset semua card sebelumnya
  document.querySelectorAll('.preset-card').forEach(card => {
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    card.style.boxShadow = 'none';
  });
  
  // Highlight card yang dipilih
  const selectedCard = event.currentTarget;
  selectedCard.style.borderColor = 'rgba(59, 130, 246, 0.5)';
  selectedCard.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3), 0 15px 30px rgba(0, 0, 0, 0.3)';
  
  // Simpan data preset
  selectedPreset = {
    id: id,
    resolution: resolution,
    dpi: dpi,
    name: name
  };
  
  // Generate command
  generatePresetCommand();
  
  // Tampilkan output section
  const outputSection = document.getElementById('outputSection');
  outputSection.style.display = 'block';
  
  // Scroll ke output section
  outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Show notification
  showNotification(`✅ Preset "${name}" dipilih!`, 'success');
}

// Fungsi untuk generate command dari preset
function generatePresetCommand() {
  if (!selectedPreset) return;
  
  const [width, height] = selectedPreset.resolution.split('x');
  const dpi = selectedPreset.dpi;
  const name = selectedPreset.name;
  
  let cmd = `# ${name}\n`;
  cmd += `# Resolution: ${selectedPreset.resolution} | DPI: ${dpi}\n`;
  cmd += `adb shell wm size ${selectedPreset.resolution}\n`;
  cmd += `adb shell wm density ${dpi}\n\n`;
  cmd += `# Reset ke default:\n`;
  cmd += `# adb shell wm size reset\n`;
  cmd += `# adb shell wm density reset\n\n`;
  cmd += `# Tips: Gunakan untuk ${getGameTips(selectedPreset.id)}`;
  
  document.getElementById('presetOutput').value = cmd;
  
  // Animasi textarea
  const output = document.getElementById('presetOutput');
  output.style.animation = 'none';
  setTimeout(() => {
    output.style.animation = 'pulse 0.5s';
  }, 10);
}

// Fungsi untuk mendapatkan tips berdasarkan game
function getGameTips(presetId) {
  const tips = {
    'pubg-extreme': 'PUBG Mobile - Extreme FPS mode untuk device high-end',
    'pubg-balanced': 'PUBG Mobile - Setting seimbang antara grafis dan performa',
    'ml-pro': 'Mobile Legends - Setting pro player untuk kompetitif',
    'ml-competitive': 'Mobile Legends - Untuk gameplay competitive',
    'ff-headshot': 'Free Fire - Optimasi untuk akurasi headshot',
    'ff-smooth': 'Free Fire - Gameplay smooth untuk device mid-range',
    'ffmax-ultra': 'Free Fire Max - Grafis ultra HD untuk device flagship',
    'ffmax-performance': 'Free Fire Max - Mode performa untuk gameplay lancar'
  };
  
  return tips[presetId] || 'Gaming experience yang lebih baik';
}

// Fungsi untuk menyalin command preset
function copyPresetCommand() {
  console.log('copyPresetCommand called'); // Debug log
  
  const text = document.getElementById('presetOutput').value;
  if (!text.trim()) {
    showNotification('❌ Pilih preset terlebih dahulu!', 'error');
    return;
  }
  
  // Gunakan Clipboard API jika tersedia
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('📋 Command preset disalin!', 'success');
      
      // Animasi tombol
      const btn = document.querySelector('button[onclick*="copyPresetCommand"]');
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="margin-right: 10px;"></i>Tersalin!';
        btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }, 2000);
      }
    }).catch(err => {
      console.error('Clipboard API error:', err);
      copyTextFallback(text, 'preset');
    });
  } else {
    copyTextFallback(text, 'preset');
  }
}

// Fungsi untuk reset preset
function resetPreset() {
  console.log('resetPreset called'); // Debug log
  
  selectedPreset = null;
  
  // Reset semua card
  document.querySelectorAll('.preset-card').forEach(card => {
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    card.style.boxShadow = 'none';
  });
  
  // Clear output
  document.getElementById('presetOutput').value = '';
  
  // Sembunyikan output section
  document.getElementById('outputSection').style.display = 'none';
  
  showNotification('🔄 Preset direset!', 'info');
}

// Fallback function untuk copy text
function copyTextFallback(text, type = 'preset') {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      showNotification(`📋 Command ${type} disalin!`, 'success');
      
      // Animasi tombol berdasarkan type
      let btn;
      if (type === 'preset') {
        btn = document.querySelector('button[onclick*="copyPresetCommand"]');
      } else if (type === 'dpi') {
        btn = document.querySelector('button[onclick*="copyDpiCommand"]');
      } else if (type === 'adb') {
        btn = document.querySelector('button[onclick*="copyAdbCommand"]');
      }
      
      if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="margin-right: 10px;"></i>Tersalin!';
        btn.style.background = 'linear-gradient(135deg, #059669, #047857)';
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }, 2000);
      }
    } else {
      showNotification('❌ Gagal menyalin!', 'error');
    }
  } catch (err) {
    document.body.removeChild(textarea);
    showNotification('❌ Browser tidak mendukung!', 'error');
  }
}

// Setup navigation untuk halaman preset
document.addEventListener('DOMContentLoaded', () => {
  // Setup untuk halaman preset
  if (document.querySelector('.preset-grid')) {
    console.log('Preset page loaded');
    
    // Pastikan fungsi tersedia di global scope
    window.copyPresetCommand = copyPresetCommand;
    window.resetPreset = resetPreset;
    window.selectPreset = selectPreset;
    
    // Tambahkan event listener untuk enter key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && selectedPreset) {
        resetPreset();
      }
    });
    
    // Auto pilih preset pertama
    setTimeout(() => {
      const firstPreset = document.querySelector('.preset-card');
      if (firstPreset && !selectedPreset) {
        // Simulasi klik pada preset pertama
        const presetData = firstPreset.getAttribute('onclick');
        if (presetData) {
          // Ekstrak parameter dari onclick
          const match = presetData.match(/selectPreset\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'\)/);
          if (match) {
            selectPreset(match[1], match[2], match[3], match[4]);
          }
        }
      }
    }, 1000);
  }
});