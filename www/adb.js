// Data command ADB
const adbCommands = [
  { id: 'devices', icon: 'fa-mobile-alt', title: 'Check Connected Devices', code: 'adb devices', desc: 'Cek device yang terhubung via USB/WiFi', category: 'Basic' },
  { id: 'shell', icon: 'fa-terminal', title: 'Enter ADB Shell', code: 'adb shell', desc: 'Masuk ke shell Android', category: 'Basic' },
  { id: 'reboot', icon: 'fa-power-off', title: 'Reboot Device', code: 'adb reboot', desc: 'Restart device', category: 'Basic' },
  { id: 'size', icon: 'fa-expand-alt', title: 'Check Current Resolution', code: 'adb shell wm size', desc: 'Cek resolusi layar saat ini', category: 'Display' },
  { id: 'density', icon: 'fa-ruler-combined', title: 'Check Current DPI', code: 'adb shell wm density', desc: 'Cek DPI saat ini', category: 'Display' },
  { id: 'reset', icon: 'fa-undo', title: 'Reset Resolution & DPI', code: 'adb shell wm size reset\nadb shell wm density reset', desc: 'Reset ke setting default', category: 'Display' },
  { id: 'screenshot', icon: 'fa-camera', title: 'Take Screenshot', code: 'adb shell screencap -p /sdcard/screenshot.png', desc: 'Ambil screenshot', category: 'Media' },
  { id: 'record', icon: 'fa-video', title: 'Record Screen', code: 'adb shell screenrecord /sdcard/record.mp4', desc: 'Rekam layar (Ctrl+C untuk stop)', category: 'Media' },
  { id: 'pull', icon: 'fa-download', title: 'Pull File from Device', code: 'adb pull /sdcard/file.txt .', desc: 'Copy file dari device ke PC', category: 'File' },
  { id: 'push', icon: 'fa-upload', title: 'Push File to Device', code: 'adb push file.txt /sdcard/', desc: 'Copy file dari PC ke device', category: 'File' }
];

// Inisialisasi halaman ADB
document.addEventListener('DOMContentLoaded', function() {
  if (!document.querySelector('.adb-commands')) return;
  
  console.log('ADB page initialized');
  
  // Render command cards
  renderAdbCommands();
  
  // Setup event listeners
  setupAdbPage();
  
  // Auto select command pertama
  setTimeout(() => {
    if (adbCommands.length > 0) {
      selectAdbCommand(adbCommands[0].id);
    }
  }, 500);
});

// Render semua command cards
function renderAdbCommands() {
  const sections = {};
  
  // Kelompokkan commands berdasarkan kategori
  adbCommands.forEach(cmd => {
    if (!sections[cmd.category]) {
      sections[cmd.category] = [];
    }
    sections[cmd.category].push(cmd);
  });
  
  // Render sections
  const container = document.querySelector('.adb-commands');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.keys(sections).forEach(category => {
    const section = document.createElement('div');
    section.className = 'command-section';
    
    section.innerHTML = `
      <h3><i class="fas fa-cogs" style="margin-right: 8px;"></i>${category} Commands</h3>
    `;
    
    sections[category].forEach(cmd => {
      const card = document.createElement('div');
      card.className = 'command-card';
      card.dataset.id = cmd.id;
      
      card.innerHTML = `
        <div class="command-title">
          <i class="fas ${cmd.icon}"></i>
          <span>${cmd.title}</span>
        </div>
        <div class="command-desc">${cmd.desc}</div>
        <div class="command-code">${cmd.code}</div>
      `;
      
      card.addEventListener('click', () => selectAdbCommand(cmd.id));
      section.appendChild(card);
    });
    
    container.appendChild(section);
  });
}

// Setup halaman ADB
function setupAdbPage() {
  // Setup copy button
  const copyBtn = document.querySelector('button[onclick="copyAdbCommand()"]');
  if (copyBtn) {
    copyBtn.onclick = copyAdbCommand;
  }
  
  // Setup clear button
  const clearBtn = document.querySelector('button[onclick="clearAdbCommand()"]');
  if (clearBtn) {
    clearBtn.onclick = clearAdbCommand;
  }
}

// Pilih command ADB
function selectAdbCommand(commandId) {
  const command = adbCommands.find(cmd => cmd.id === commandId);
  if (!command) return;
  
  // Reset semua cards
  document.querySelectorAll('.command-card').forEach(card => {
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    card.style.background = 'rgba(255, 255, 255, 0.08)';
  });
  
  // Highlight card yang dipilih
  const selectedCard = document.querySelector(`.command-card[data-id="${commandId}"]`);
  if (selectedCard) {
    selectedCard.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    selectedCard.style.background = 'rgba(59, 130, 246, 0.1)';
  }
  
  // Format output
  const output = `# ${command.category} Command\n` +
                 `# ${command.desc}\n\n` +
                 `${command.code}\n\n` +
                 `# Cara penggunaan:\n` +
                 `# 1. Hubungkan device via USB/WiFi ADB\n` +
                 `# 2. Buka terminal/command prompt\n` +
                 `# 3. Paste command di atas\n` +
                 `# 4. Tekan Enter untuk eksekusi`;
  
  document.getElementById('adbOutput').value = output;
  
  // Tampilkan output section
  const outputSection = document.getElementById('adbOutputSection');
  if (outputSection) {
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  showNotification(`✅ Command "${command.title}" dipilih!`, 'success');
}

// Copy ADB command
function copyAdbCommand() {
  const output = document.getElementById('adbOutput');
  if (!output || !output.value.trim()) {
    showNotification('❌ Pilih command terlebih dahulu!', 'error');
    return;
  }
  
  const button = document.querySelector('button[onclick="copyAdbCommand()"]');
  copyToClipboard(output.value, button);
}

// Clear ADB command
function clearAdbCommand() {
  // Reset semua cards
  document.querySelectorAll('.command-card').forEach(card => {
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    card.style.background = 'rgba(255, 255, 255, 0.08)';
  });
  
  // Clear output
  const output = document.getElementById('adbOutput');
  if (output) output.value = '';
  
  // Sembunyikan output section
  const outputSection = document.getElementById('adbOutputSection');
  if (outputSection) outputSection.style.display = 'none';
  
  showNotification('🗑️ Output cleared!', 'info');
}

// Export fungsi ke global scope
window.selectAdbCommand = selectAdbCommand;
window.copyAdbCommand = copyAdbCommand;
window.clearAdbCommand = clearAdbCommand;