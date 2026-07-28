// ---------- Compare table rows sync with product tabs ----------
const compareRows = document.querySelectorAll('#compare-table tbody tr');
compareRows.forEach(row => {
  row.addEventListener('click', () => {
    const target = row.dataset.tabTarget;
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${target}"]`);
    if (tabBtn) {
      tabBtn.click();
      compareRows.forEach(r => r.classList.remove('row-active'));
      row.classList.add('row-active');
      document.getElementById('pallets').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
// Keep table highlight in sync if a tab is clicked directly
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    compareRows.forEach(r => {
      r.classList.toggle('row-active', r.dataset.tabTarget === btn.dataset.tab);
    });
  });
});

// ---------- Shipment configurator ----------
const freightGroup = document.getElementById('cf-freight');
const customGroup = document.getElementById('cf-custom');
const weightInput = document.getElementById('cf-weight');

let cfState = { freight: 'sea', custom: 'no' };

function setupToggleGroup(group, stateKey) {
  if (!group) return;
  group.querySelectorAll('.cf-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.cf-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cfState[stateKey] = btn.dataset.value;
      updateConfigurator();
    });
  });
}
setupToggleGroup(freightGroup, 'freight');
setupToggleGroup(customGroup, 'custom');
if (weightInput) weightInput.addEventListener('input', updateConfigurator);

function updateConfigurator() {
  const nameEl = document.getElementById('cr-product-name');
  const specsEl = document.getElementById('cr-specs');
  const noteEl = document.getElementById('cr-note');
  const warnEl = document.getElementById('cr-warning');
  if (!nameEl) return;

  const weight = parseFloat(weightInput && weightInput.value ? weightInput.value : '');
  const isSea = cfState.freight === 'sea';

  if (cfState.custom === 'yes') {
    nameEl.textContent = 'Custom Dimensions Build';
    specsEl.innerHTML = `
      <div><span>Dimensions</span><span>Client-specified</span></div>
      <div><span>Treatment</span><span>ISPM 15 on request</span></div>
      <div><span>Angle board length</span><span>${isSea ? '2400mm (sea)' : '1600mm / 1000mm (air)'}</span></div>
      <div><span>Lead time</span><span>Discussed at quoting</span></div>`;
    noteEl.textContent = "Your cargo doesn't fit a standard footprint, so our production team builds to the exact dimensions the shipment requires, with ISPM 15 treatment available on request.";
    warnEl.innerHTML = '';
    return;
  }

  nameEl.textContent = isSea
    ? 'Export-Grade Pallet · Kenyan Standard / Euro'
    : 'Export-Grade Pallet · Lightweight Air Build';

  specsEl.innerHTML = `
    <div><span>Dimensions</span><span>1200 × 1000mm / 1200 × 800mm Euro</span></div>
    <div><span>Safe Working Load</span><span>Up to 1,200kg</span></div>
    <div><span>Angle board length</span><span>${isSea ? '2400mm (sea freight)' : '1600mm / 1000mm (air freight)'}</span></div>
    <div><span>Suggested material</span><span>${isSea ? 'Eucalyptus / Cypress' : 'Pine (lightweight)'}</span></div>`;

  noteEl.textContent = isSea
    ? 'The Kenyan standard footprint suits most tea, coffee, and horticultural export loads moving through Mombasa. Pair it with sea-freight-length angle board corners and a pallet top if the load will be stacked.'
    : 'For air freight, a lighter pine build keeps chargeable weight down while still meeting ISPM 15. Air-length angle board corners protect corners without adding unnecessary bulk.';

  if (!isNaN(weight) && weight > 1200) {
    warnEl.innerHTML = `<div class="cr-warn">Your cargo weight (${weight}kg) exceeds our standard 1,200kg safe working load. Let's talk about reinforced stringers or a custom build for this shipment.</div>`;
  } else {
    warnEl.innerHTML = '';
  }
}
updateConfigurator();

// ---------- Gallery lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || img.alt;
    lightbox.classList.add('is-open');
  });
});
function closeLightbox() { lightbox.classList.remove('is-open'); }
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
