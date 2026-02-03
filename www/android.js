let selectedMethod = null;

const methods = {
  termux: {
    name: 'Termux',
    icon: 'fa-terminal',
    color: '#3ddc84',
    guide: `
      <div class="tutorial-steps">
        <div class="step">
          <h4>1. Install Termux</h4>
          <p>Download dari F-Droid (rekomendasi) atau Play Store</p>
          <a href="https://f-droid.org/en/packages/com.termux/" target="_blank" class="btn-link">
            <i class="fas fa-download"></i> Download Termux
          </a>
        </div>
        
        <div class="step">
          <h4>2. Update & Install ADB</h4>
          <div class="code-block">
            <code>pkg update && pkg upgrade</code><br>
            <code>pkg install android-tools</code>
          </div>
        </div>
        
        <div class="step">
          <h4>3. Enable USB Debugging</h4>
          <p>Di device target (bukan device yang pakai Termux):</p>
          <ul>
            <li>Settings → About Phone</li>
            <li>Tap "Build Number" 7 kali</li>
            <li>Settings → Developer Options</li>
            <li>Aktifkan "USB Debugging"</li>
          </ul>
        </div>
        
        <div class="step">
          <h4>4. Hubungkan Device</h4>
          <div class="code-block">
            <code>adb devices</code><br>
            <em># Pastikan device muncul</em>
          </div>
        </div>
      </div>
    `,
    generateScript: function(commands) {
      return `#!/data/data/com.termux/files/usr/bin/bash
echo "==========================================="
echo "    ADB Executor for Termux"
echo "==========================================="
echo ""
echo "Updating packages..."
pkg install android-tools -y
echo ""
echo "Checking connection..."
adb devices
echo ""
echo "Executing commands..."
${commands}
echo ""
echo "✅ All commands executed!"
echo "==========================================="
read -p "Press Enter to exit..."`;
    },
    appUrl: 'termux://'
  },
  
  ladb: {
    name: 'LADB',
    icon: 'fa-wifi',
    color: '#4285f4',
    guide: `
      <div class="tutorial-steps">
        <div class="step">
          <h4>1. Install LADB</h4>
          <p>Download dari Play Store (berbayar)</p>
          <a href="https://play.google.com/store/apps/details?id=com.ttxapps.ladb" target="_blank" class="btn-link">
            <i class="fab fa-google-play"></i> LADB di Play Store
          </a>
        </div>
        
        <div class="step">
          <h4>2. Enable Wireless Debugging</h4>
          <p>Di device yang SAMA (self ADB):</p>
          <ul>
            <li>Settings → Developer Options</li>
            <li>Aktifkan "Wireless Debugging"</li>
            <li>Note IP address & port</li>
          </ul>
        </div>
        
        <div class="step">
          <h4>3. Connect di LADB</h4>
          <div class="code-block">
            <code>adb connect 192.168.x.x:xxxxx</code><br>
            <em># Ganti dengan IP & port Anda</em>
          </div>
        </div>
        
        <div class="step">
          <h4>4. Jalankan Command</h4>
          <p>Copy command dari app ini, paste di LADB</p>
        </div>
      </div>
    `,
    generateScript: function(commands) {
      return `# LADB Script
# Copy semua baris di bawah ini ke LADB

${commands}

echo "✅ Commands executed via LADB"`;
    },
    appUrl: 'market://details?id=com.ttxapps.ladb'
  },
  
  shizuku: {
    name: 'Shizuku',
    icon: 'fa-crown',
    color: '#8b5cf6',
    guide: `
      <div class="tutorial-steps">
        <div class="step">
          <h4>1. Install Shizuku</h4>
          <p>Download dari GitHub atau melalui Magisk</p>
          <a href="https://github.com/RikkaApps/Shizuku" target="_blank" class="btn-link">
            <i class="fab fa-github"></i> Shizuku di GitHub
          </a>
        </div>
        
        <div class="step">
          <h4>2. Start Shizuku</h4>
          <p>Via ADB (butuh PC pertama kali):</p>
          <div class="code-block">
            <code>adb shell sh /sdcard/Android/data/moe.shizuku.privileged.api/start.sh</code>
          </div>
        </div>
        
        <div class="step">
          <h4>3. Install Shizuku di Termux</h4>
          <div class="code-block">
            <code>pkg install shizuku</code><br>
            <code>export ADB_PATH="shizuku"</code>
          </div>
        </div>
        
        <div class="step">
          <h4>4. Jalankan Command</h4>
          <div class="code-block">
            <code>shizuku exec [command]</code><br>
            <em># Ganti [command] dengan command ADB</em>
          </div>
        </div>
      </div>
    `,
    generateScript: function(commands) {
      const shizukuCommands = commands.split('\n')
        .map(cmd => `shizuku exec ${cmd}`)
        .join('\n');
      
      return `#!/data/data/com.termux/files/usr/bin/bash
echo "==========================================="
echo "    Shizuku ADB Executor"
echo "==========================================="
echo ""
echo "Starting Shizuku..."
export ADB_PATH="shizuku"
echo ""
echo "Executing commands via Shizuku..."
${shizukuCommands}
echo ""
echo "✅ Commands executed via Shizuku!"
echo "==========================================="`;
    },
    appUrl: 'https://github.com/RikkaApps/Shizuku'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  setupMethodPage();
});

function setupMethodPage() {
  console.log('Android methods page loaded');
}

function selectMethod(methodId) {
  selectedMethod = methodId;
  const method = methods[methodId];
  
  if (!method) return;
  
  // Update UI
  document.querySelectorAll('.method-card').forEach(card => {
    card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  const selectedCard = document.querySelector(`.method-card[onclick*="${methodId}"]`);
  if (selectedCard) {
    selectedCard.style.borderColor = method.color;
  }
  
  // Show guide
  document.getElementById('guideTitle').innerHTML = 
    `<i class="fas ${method.icon}" style="color: ${method.color}; margin-right: 10px;"></i>${method.name} Guide`;
  
  document.getElementById('guideContent').innerHTML = method.guide;
  document.getElementById('methodGuide').style.display = 'block';
  
  // Scroll to guide
  document.getElementById('methodGuide').scrollIntoView({ behavior: 'smooth' });
  
  showNotification(`✅ ${method.name} selected!`, 'success');
}

function generateScript() {
  if (!selectedMethod) {
    showNotification('❌ Pilih metode dulu!', 'error');
    return;
  }
  
  // Get commands from main page (simplified)
  const commands = "adb shell wm size 1080x2400\nadb shell wm density 440";
  
  const method = methods[selectedMethod];
  const script = method.generateScript(commands);
  
  // Download script
  downloadFile(`adb_${selectedMethod}.sh`, script);
  
  showNotification(`✅ Script untuk ${method.name} siap!`, 'success');
}

function openApp() {
  if (!selectedMethod) return;
  
  const method = methods[selectedMethod];
  window.open(method.appUrl, '_blank');
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