/* ==========================================================================
   MR BUBBLE PRO - APPLICATION LOGIC & INTERACTIVE CANVAS ENGINE
   ========================================================================== */

// --- GLOBAL MOCK DATA ---
const DOCTORS_DATA = [
  { id: 1, name: "Dr. David Chen", specialty: "Pulmonology", hospital: "City General Hospital", tier: "A+", potential: "₹85,000/mo", status: "Visited Today", color: "#06b6d4", radius: 36, x: 150, y: 140, vx: 0.4, vy: 0.3 },
  { id: 2, name: "Dr. Ananya Roy", specialty: "Neurology", hospital: "Max Neuro Center", tier: "A+", potential: "₹1,20,000/mo", status: "Pending", color: "#a855f7", radius: 44, x: 380, y: 220, vx: -0.3, vy: 0.4 },
  { id: 3, name: "Dr. Vikram Sethi", specialty: "Cardiology", hospital: "Apollo Heart Institute", tier: "A", potential: "₹65,000/mo", status: "Visited Today", color: "#6366f1", radius: 32, x: 600, y: 150, vx: 0.5, vy: -0.2 },
  { id: 4, name: "Dr. Meera Kapoor", specialty: "Pediatrics", hospital: "Lotus Children Hospital", tier: "B", potential: "₹42,000/mo", status: "Pending", color: "#10b981", radius: 26, x: 240, y: 340, vx: 0.2, vy: -0.4 },
  { id: 5, name: "Dr. Rajeshwar Rao", specialty: "Orthopedics", hospital: "Fortis Bone & Joint", tier: "A", potential: "₹78,000/mo", status: "Pending", color: "#f97316", radius: 30, x: 500, y: 380, vx: -0.4, vy: 0.2 },
  { id: 6, name: "Dr. Sunita Sharma", specialty: "Neurology", hospital: "AIIMS Neuro Wing", tier: "A+", potential: "₹1,10,000/mo", status: "Visited Today", color: "#a855f7", radius: 42, x: 720, y: 280, vx: 0.3, vy: 0.5 },
  { id: 7, name: "Dr. Kabir Malhotra", specialty: "Cardiology", hospital: "Escorts Heart Clinic", tier: "A", potential: "₹90,000/mo", status: "Pending", color: "#6366f1", radius: 35, x: 120, y: 420, vx: -0.5, vy: -0.3 }
];

const SLIDES_DATA = [
  {
    title: "NeuroSyn-X™ Molecular Efficacy & Receptor Binding",
    subtitle: "Targeted N-Methyl-D-Aspartate Complex for Enhanced Cognitive Resilience",
    img: "assets/pharma_product.jpg",
    points: [
      "84% Selective inhibition of hyperactive neuronal receptor sites.",
      "Dual action sustained-release formulation with 24-hour plasma half-life.",
      "Proven clinical trial safety profile across 1,200+ patient cohorts."
    ],
    calcEnabled: true
  },
  {
    title: "In-Clinic Field Detailing & Patient Experience",
    subtitle: "Real-world Patient Outcome Case Studies & Physician Detailing Feedback",
    img: "assets/mr_detailing.jpg",
    points: [
      "94.2% Doctor approval rate during face-to-face tablet e-detailing sessions.",
      "Faster onset of action compared to standard conventional therapies.",
      "Interactive patient compliance tracking via integrated digital therapy log."
    ],
    calcEnabled: false
  },
  {
    title: "Aergzin-OT Respiratory Inhaler Performance",
    subtitle: "Dual Bronchodilator & Anti-Inflammatory Synergy",
    img: "assets/mr_detailing.jpg",
    points: [
      "Rapid symptom relief within 3 minutes of first inhalation dose.",
      "Decreased hospital emergency visits by 68% in 12-week study.",
      "Ergonomic dose counter device designed for senior patient ease."
    ],
    calcEnabled: false
  }
];

const DCR_HISTORY = [
  { doctor: "Dr. David Chen", specialty: "Pulmonology", time: "09:30 AM", status: "Completed", POB: "₹14,500", samples: 3, notes: "Requested 5 additional promo samples for clinic trial." },
  { doctor: "Dr. Vikram Sethi", specialty: "Cardiology", time: "11:15 AM", status: "POB Booked", POB: "₹22,000", samples: 4, notes: "Booked 20 boxes of CardioVast-50." },
  { doctor: "Dr. Sunita Sharma", specialty: "Neurology", time: "02:00 PM", status: "Completed", POB: "₹12,000", samples: 2, notes: "Appreciated NeuroSyn-X trial data presentation." }
];

const SAMPLE_INVENTORY = [
  { name: "NeuroSyn-X 300mg Samples", batch: "NS042", total: 100, current: 65, alert: "Good Stock" },
  { name: "Aergzin-OT Inhalers", batch: "AO918", total: 50, current: 18, alert: "Low Stock Alert" },
  { name: "CardioVast-50 Capsules", batch: "CV114", total: 80, current: 52, alert: "Good Stock" }
];

// --- APP STATE ---
let activeTab = 'overview';
let currentSlideIndex = 0;
let popCount = 0;
let popCombo = 0;
let soundEnabled = true;
let audioCtx = null;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initThemeToggle();
  initScheduleList();
  initDCRSelects();
  initDCRHistory();
  initInventoryGrid();
  initTerritoryCanvas();
  initSlideDeck();
  initMindRefreshCanvas();
  initGlobalSearch();
});

// --- NAVIGATION & TAB SYSTEM ---
function initTabs() {
  const navBtns = document.querySelectorAll('.nav-item');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
}

function switchTab(tabId) {
  activeTab = tabId;
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const activePane = document.getElementById(`tab-${tabId}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  // Trigger canvas resize if switching to canvas tabs
  if (tabId === 'territory') resizeTerritoryCanvas();
  if (tabId === 'mind-refresh') resizeMindPopCanvas();
}

// --- THEME TOGGLE ---
function initThemeToggle() {
  const themeBtn = document.getElementById('themeToggleBtn');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
  });
}

// --- LIGHTBOX PHOTO MODAL ---
function openImageModal(imgSrc, title) {
  const modal = document.getElementById('imageModal');
  document.getElementById('modalImgTag').src = imgSrc;
  document.getElementById('modalImgTitle').innerText = title || 'Photo Showcase';
  modal.classList.add('open');
}

function closeImageModal() {
  document.getElementById('imageModal').classList.remove('open');
}

document.getElementById('fullscreenPhotosBtn')?.addEventListener('click', () => {
  openImageModal('assets/mr_detailing.jpg', 'Side-by-Side Field Showcase Overview');
});

// --- DASHBOARD SCHEDULE & LISTS ---
function initScheduleList() {
  const container = document.getElementById('scheduleList');
  if (!container) return;

  container.innerHTML = DOCTORS_DATA.map(doc => `
    <div class="schedule-item">
      <div class="doc-meta">
        <div class="doc-avatar" style="background:${doc.color}">${doc.name.split(' ').map(n=>n[0]).join('')}</div>
        <div class="doc-info">
          <h4>${doc.name}</h4>
          <p>${doc.specialty} • ${doc.hospital}</p>
        </div>
      </div>
      <div class="doc-action">
        <span class="status-badge ${doc.status === 'Visited Today' ? 'visited' : 'pending'}">${doc.status}</span>
        <button class="btn-sm" onclick="openDoctorDetails(${doc.id})">Details</button>
      </div>
    </div>
  `).join('');
}

// --- DOCTOR MODAL ---
function openDoctorDetails(docId) {
  const doc = DOCTORS_DATA.find(d => d.id === docId);
  if (!doc) return;

  const modal = document.getElementById('doctorModal');
  const content = document.getElementById('doctorModalContent');
  
  content.innerHTML = `
    <h3>${doc.name}</h3>
    <p class="text-muted" style="margin-bottom:14px;">${doc.specialty} • ${doc.hospital}</p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <div class="glass-card"><strong>Territory Tier:</strong> ${doc.tier}</div>
      <div class="glass-card"><strong>Est. Potential:</strong> ${doc.potential}</div>
      <div class="glass-card"><strong>Call Status:</strong> ${doc.status}</div>
      <div class="glass-card"><strong>Primary Product:</strong> NeuroSyn-X</div>
    </div>
    <div style="display:flex; gap:12px;">
      <button class="btn-primary" onclick="closeDoctorModal(); switchTab('detailing');">Launch E-Detailing Deck</button>
      <button class="btn-secondary" onclick="closeDoctorModal(); switchTab('dcr');">Log Call Entry</button>
    </div>
  `;
  modal.classList.add('open');
}

function closeDoctorModal() {
  document.getElementById('doctorModal').classList.remove('open');
}

// --- TERRITORY BUBBLE CANVAS (2D PHYSICS ENGINE) ---
let territoryCanvas, tCtx;
let animFrameTerritory;

function initTerritoryCanvas() {
  territoryCanvas = document.getElementById('territoryCanvas');
  if (!territoryCanvas) return;
  tCtx = territoryCanvas.getContext('2d');

  resizeTerritoryCanvas();
  window.addEventListener('resize', resizeTerritoryCanvas);

  territoryCanvas.addEventListener('click', handleTerritoryClick);

  document.getElementById('resetCanvasPhysics')?.addEventListener('click', () => {
    DOCTORS_DATA.forEach(d => {
      d.vx = (Math.random() - 0.5) * 1.2;
      d.vy = (Math.random() - 0.5) * 1.2;
    });
  });

  animateTerritoryCanvas();
}

function resizeTerritoryCanvas() {
  if (!territoryCanvas) return;
  territoryCanvas.width = territoryCanvas.parentElement.clientWidth;
  territoryCanvas.height = territoryCanvas.parentElement.clientHeight;
}

function animateTerritoryCanvas() {
  if (!tCtx) return;
  const width = territoryCanvas.width;
  const height = territoryCanvas.height;
  const filterVal = document.getElementById('canvasFilterSpecialty')?.value || 'ALL';

  tCtx.clearRect(0, 0, width, height);

  // Update & Draw Bubbles
  DOCTORS_DATA.forEach(doc => {
    if (filterVal !== 'ALL' && doc.specialty !== filterVal) return;

    // Movement
    doc.x += doc.vx;
    doc.y += doc.vy;

    // Boundary Bounce
    if (doc.x - doc.radius < 0 || doc.x + doc.radius > width) doc.vx *= -1;
    if (doc.y - doc.radius < 0 || doc.y + doc.radius > height) doc.vy *= -1;

    // Outer Glow Effect
    tCtx.beginPath();
    tCtx.arc(doc.x, doc.y, doc.radius + 6, 0, Math.PI * 2);
    tCtx.fillStyle = doc.color + '22';
    tCtx.fill();

    // Main Glass Bubble
    tCtx.beginPath();
    tCtx.arc(doc.x, doc.y, doc.radius, 0, Math.PI * 2);
    const grad = tCtx.createRadialGradient(doc.x - doc.radius*0.3, doc.y - doc.radius*0.3, 2, doc.x, doc.y, doc.radius);
    grad.addColorStop(0, '#ffffff99');
    grad.addColorStop(0.4, doc.color + 'dd');
    grad.addColorStop(1, doc.color + '66');
    tCtx.fillStyle = grad;
    tCtx.fill();
    tCtx.strokeStyle = '#ffffffaa';
    tCtx.lineWidth = 1.5;
    tCtx.stroke();

    // Text Label inside Bubble
    tCtx.fillStyle = '#ffffff';
    tCtx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    tCtx.textAlign = 'center';
    tCtx.textBaseline = 'middle';
    tCtx.fillText(doc.name.split(' ')[1] || doc.name, doc.x, doc.y - 4);
    
    tCtx.font = '9px sans-serif';
    tCtx.fillStyle = '#ffffffcc';
    tCtx.fillText(doc.specialty, doc.x, doc.y + 10);
  });

  animFrameTerritory = requestAnimationFrame(animateTerritoryCanvas);
}

function handleTerritoryClick(e) {
  const rect = territoryCanvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  DOCTORS_DATA.forEach(doc => {
    const dist = Math.hypot(clickX - doc.x, clickY - doc.y);
    if (dist <= doc.radius) {
      openDoctorDetails(doc.id);
    }
  });
}

// --- E-DETAILING DECK PRESENTER ---
function initSlideDeck() {
  renderSlide(currentSlideIndex);

  document.getElementById('prevSlideBtn')?.addEventListener('click', () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      renderSlide(currentSlideIndex);
    }
  });

  document.getElementById('nextSlideBtn')?.addEventListener('click', () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      currentSlideIndex++;
      renderSlide(currentSlideIndex);
    }
  });
}

function renderSlide(index) {
  const slide = SLIDES_DATA[index];
  const container = document.getElementById('slideContent');
  const indicator = document.getElementById('slideIndicator');

  if (!slide || !container) return;

  if (indicator) indicator.innerText = `Slide ${index + 1} of ${SLIDES_DATA.length}`;

  container.innerHTML = `
    <div class="slide-wrapper">
      <div class="slide-info">
        <span class="badge-pill">Clinical E-Detailing Slide</span>
        <h2 style="font-size:1.5rem; margin:10px 0;">${slide.title}</h2>
        <p style="color:var(--text-secondary); margin-bottom:20px;">${slide.subtitle}</p>
        <ul style="display:flex; flex-direction:column; gap:12px; list-style:none;">
          ${slide.points.map(pt => `
            <li style="display:flex; align-items:flex-start; gap:10px;">
              <span style="color:var(--accent-green); font-size:1.2rem;">✓</span>
              <span style="font-size:0.9rem; line-height:1.4;">${pt}</span>
            </li>
          `).join('')}
        </ul>

        ${slide.calcEnabled ? `
          <div class="calc-box">
            <h4 style="font-size:0.85rem; margin-bottom:8px;">💡 Interactive Dosage Calculator</h4>
            <div style="display:flex; gap:10px; align-items:center;">
              <input type="number" id="patientWeight" placeholder="Patient Wt (kg)" value="65" style="width:140px;" class="text-input" oninput="calcDose()">
              <span id="calculatedDoseVal" style="font-weight:700; color:var(--accent-cyan);">Recommended: 300mg Daily</span>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="slide-graphic">
        <img src="${slide.img}" alt="Slide Graphic" onclick="openImageModal('${slide.img}', '${slide.title}')">
      </div>
    </div>
  `;
}

function calcDose() {
  const wt = parseFloat(document.getElementById('patientWeight')?.value || 60);
  const dose = Math.round(wt * 4.5);
  const el = document.getElementById('calculatedDoseVal');
  if (el) el.innerText = `Recommended: ${dose}mg / day`;
}

// --- DCR CALL ENTRY & HISTORY ---
function initDCRSelects() {
  const select = document.getElementById('dcrDoctorSelect');
  if (!select) return;
  select.innerHTML = `<option value="">-- Select Doctor --</option>` + 
    DOCTORS_DATA.map(d => `<option value="${d.name}">${d.name} (${d.specialty})</option>`).join('');

  document.getElementById('dcrForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const docName = select.value;
    const status = document.getElementById('dcrVisitStatus').value;
    const pob = document.getElementById('dcrPobVal').value || '0';
    const samples = document.getElementById('dcrSampleQty').value || '1';
    const notes = document.getElementById('dcrNotes').value || 'Call completed.';

    if (!docName) {
      alert('Please select a doctor to log the call!');
      return;
    }

    DCR_HISTORY.unshift({
      doctor: docName,
      specialty: 'Specialist',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: status,
      POB: `₹${pob}`,
      samples: parseInt(samples),
      notes: notes
    });

    initDCRHistory();
    alert('Daily Call Report Entry Logged Successfully!');
    e.target.reset();
  });
}

function initDCRHistory() {
  const container = document.getElementById('dcrHistoryList');
  const countBadge = document.getElementById('dcrCountBadge');
  if (!container) return;

  if (countBadge) countBadge.innerText = `${DCR_HISTORY.length} Visits Recorded`;

  container.innerHTML = DCR_HISTORY.map(log => `
    <div class="dcr-log-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong>${log.doctor}</strong>
        <span class="status-badge visited">${log.status}</span>
      </div>
      <p style="font-size:0.8rem; color:var(--text-muted);">${log.time} • POB: ${log.POB} • Samples: ${log.samples}</p>
      <p style="font-size:0.82rem; margin-top:6px;">"${log.notes}"</p>
    </div>
  `).join('');
}

// --- INVENTORY STYLES & GRID ---
function initInventoryGrid() {
  const container = document.getElementById('inventoryGrid');
  if (!container) return;

  container.innerHTML = SAMPLE_INVENTORY.map(item => `
    <div class="glass-card stock-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4>${item.name}</h4>
        <span class="tag ${item.alert.includes('Low') ? 'pink' : 'green'}">${item.alert}</span>
      </div>
      <p style="font-size:0.78rem; color:var(--text-muted);">Batch No: #${item.batch}</p>
      
      <div>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:6px;">
          <span>Stock Remaining:</span>
          <strong>${item.current} / ${item.total} Units</strong>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${(item.current/item.total)*100}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// --- MIND REFRESH BUBBLE POP GAME ENGINE ---
let popCanvas, popCtx;
let popBubbles = [];

function initMindRefreshCanvas() {
  popCanvas = document.getElementById('mindPopCanvas');
  if (!popCanvas) return;
  popCtx = popCanvas.getContext('2d');

  resizeMindPopCanvas();
  window.addEventListener('resize', resizeMindPopCanvas);

  spawnPopBubbles(25);

  popCanvas.addEventListener('mousedown', handlePopInteraction);
  popCanvas.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) handlePopInteraction(e);
  });

  document.getElementById('clearPopsBtn')?.addEventListener('click', () => {
    popCount = 0;
    popCombo = 0;
    document.getElementById('popCountVal').innerText = '0';
    document.getElementById('popComboVal').innerText = '0x';
    spawnPopBubbles(25);
  });

  document.getElementById('toggleAudioBtn')?.addEventListener('click', (e) => {
    soundEnabled = !soundEnabled;
    e.target.innerText = soundEnabled ? '🔊 Ambient Pop Sound: ON' : '🔇 Audio: OFF';
  });

  animatePopCanvas();
}

function resizeMindPopCanvas() {
  if (!popCanvas) return;
  popCanvas.width = popCanvas.parentElement.clientWidth;
  popCanvas.height = popCanvas.parentElement.clientHeight;
}

function spawnPopBubbles(num) {
  popBubbles = [];
  const colors = ['#6366f1', '#a855f7', '#06b6d4', '#ec4899', '#10b981'];
  for (let i = 0; i < num; i++) {
    popBubbles.push({
      x: Math.random() * (popCanvas?.width || 800),
      y: Math.random() * (popCanvas?.height || 500),
      radius: Math.random() * 20 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.8,
      vy: -Math.random() * 0.8 - 0.2
    });
  }
}

function animatePopCanvas() {
  if (!popCtx) return;
  const w = popCanvas.width;
  const h = popCanvas.height;

  popCtx.clearRect(0, 0, w, h);

  popBubbles.forEach((b, idx) => {
    b.x += b.vx;
    b.y += b.vy;

    // Wrap around screen
    if (b.y + b.radius < 0) b.y = h + b.radius;
    if (b.x < 0) b.x = w;
    if (b.x > w) b.x = 0;

    // Render Pop Bubble
    popCtx.beginPath();
    popCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    const grad = popCtx.createRadialGradient(b.x - b.radius*0.3, b.y - b.radius*0.3, 2, b.x, b.y, b.radius);
    grad.addColorStop(0, '#ffffffaa');
    grad.addColorStop(0.5, b.color + 'bb');
    grad.addColorStop(1, b.color + '44');
    popCtx.fillStyle = grad;
    popCtx.fill();
    popCtx.strokeStyle = '#ffffff66';
    popCtx.stroke();
  });

  requestAnimationFrame(animatePopCanvas);
}

function handlePopInteraction(e) {
  const rect = popCanvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  popBubbles.forEach((b, index) => {
    const dist = Math.hypot(mx - b.x, my - b.y);
    if (dist <= b.radius) {
      // Pop!
      popBubbles.splice(index, 1);
      popCount++;
      popCombo++;

      document.getElementById('popCountVal').innerText = popCount;
      document.getElementById('popComboVal').innerText = `${popCombo}x`;

      playSynthPopSound();

      // Respawn bubble
      setTimeout(() => {
        popBubbles.push({
          x: Math.random() * popCanvas.width,
          y: popCanvas.height + 30,
          radius: Math.random() * 20 + 20,
          color: ['#6366f1', '#a855f7', '#06b6d4', '#ec4899'][Math.floor(Math.random()*4)],
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.8 - 0.2
        });
      }, 500);
    }
  });
}

// Web Audio API Synthesized Bubble Pop
function playSynthPopSound() {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    const freq = 400 + Math.random() * 600;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (err) {
    // Audio context fallback
  }
}

// --- GLOBAL SEARCH ---
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) return;

    const matchedDoc = DOCTORS_DATA.find(d => d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query));
    if (matchedDoc) {
      openDoctorDetails(matchedDoc.id);
    }
  });
}
