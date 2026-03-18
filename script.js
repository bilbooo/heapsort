// ── Node positions for 8-node binary tree (SVG 560×274) ──────────────────────
const NODE_POS = [
  { x: 280, y: 36  },  // 0
  { x: 150, y: 100 },  // 1
  { x: 410, y: 100 },  // 2
  { x:  80, y: 168 },  // 3
  { x: 220, y: 168 },  // 4
  { x: 340, y: 168 },  // 5
  { x: 480, y: 168 },  // 6
  { x:  44, y: 238 },  // 7
];
const EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7]];

// ── Step generator ────────────────────────────────────────────────────────────
function generateSteps() {
  const steps = [];
  const A = [7, 2, 9, 1, 8, 3, 6, 5];
  let hs = A.length;

  function snap(desc, hl = [], sw = [], phase, stack, cmp = []) {
    steps.push({
      array:     [...A],
      heapSize:  hs,
      highlights: [...hl],
      swapping:  [...sw],
      comparing: [...cmp],
      description: desc,
      phase,
      callStack: [...stack],
    });
  }

  const left  = i => 2 * i + 1;
  const right = i => 2 * i + 2;

  function maxHeapify(i, stack, phase) {
    const newStack = [...stack, `Max-Heapify(A, ${i})`];

    snap(
      `📞 Chiamata: Max-Heapify(A, ${i})\nIpotesi: sottoalberi di Left(${i})=${left(i)} e Right(${i})=${right(i)} sono già max-heap`,
      [i], [], phase, newStack
    );

    const l = left(i), r = right(i);
    let max = i;

    snap(
      `Calcolo: l = Left(${i}) = ${l},   r = Right(${i}) = ${r}\nmax = ${i}  (nodo corrente)`,
      [i], [], phase, newStack
    );

    snap(
      `Confronto sinistro: l=${l} < A.hs=${hs}? ${l < hs ? 'SÌ' : 'NO'}` +
      (l < hs ? `  →  A[${l}]=${A[l]} > A[${i}]=${A[i]}? ${A[l] > A[i] ? 'SÌ → max=' + l : 'NO → max rimane ' + max}` : ''),
      [i], [], phase, newStack, l < hs ? [l, i] : []
    );
    if (l < hs && A[l] > A[i]) max = l;

    snap(
      `Confronto destro:   r=${r} < A.hs=${hs}? ${r < hs ? 'SÌ' : 'NO'}` +
      (r < hs ? `  →  A[${r}]=${A[r]} > A[${max}]=${A[max]}? ${A[r] > A[max] ? 'SÌ → max=' + r : 'NO → max rimane ' + max}` : ''),
      [i, max], [], phase, newStack, r < hs ? [r, max] : []
    );
    if (r < hs && A[r] > A[max]) max = r;

    if (max !== i) {
      snap(
        `max(${max}) ≠ i(${i})  →  SWAP A[${i}]=${A[i]} ↔ A[${max}]=${A[max]}\nIl massimo non è nella radice: bisogna scambiare!`,
        [i, max], [i, max], phase, newStack
      );
      [A[i], A[max]] = [A[max], A[i]];
      snap(
        `✅ Swap eseguito: A[${i}]=${A[i]},  A[${max}]=${A[max]}\nRicorsione: Max-Heapify(A, ${max})`,
        [max], [], phase, newStack
      );
      maxHeapify(max, newStack, phase);
    } else {
      snap(
        `max(${max}) = i(${i})  →  Nessuno swap necessario ✅\nIl nodo ${i} rispetta già la proprietà max-heap`,
        [i], [], phase, newStack
      );
    }

    snap(`↩️ Ritorno da Max-Heapify(A, ${i})`, [], [], phase, stack);
  }

  // ── Build-Max-Heap ──────────────────────────────────────────────────────────
  hs = A.length;
  const buildStack = ['HeapSort(A)', 'Build-Max-Heap(A, 8)'];

  snap(
    `🏗️ BUILD-MAX-HEAP(A, 8)\nA.hs = ${hs}\nPartenza: i = ⌊8/2⌋−1 = ${Math.floor(A.length/2)-1}\nLe foglie non hanno figli → non serve heapify-arle`,
    [], [], 'build', buildStack
  );

  for (let i = Math.floor(A.length / 2) - 1; i >= 0; i--) {
    snap(
      `🔄 Iterazione Build: i = ${i}\nChiamo Max-Heapify sul nodo ${i} (valore ${A[i]})`,
      [i], [], 'build', buildStack
    );
    maxHeapify(i, buildStack, 'build');
  }

  snap(
    `✅ BUILD-MAX-HEAP completato!\nArray: [${A.join(', ')}]\nA[0]=${A[0]} è il massimo → inizio fase 2`,
    [], [], 'build', ['HeapSort(A)', 'Build-Max-Heap ✅']
  );

  // ── HeapSort extraction ─────────────────────────────────────────────────────
  for (let i = A.length - 1; i >= 1; i--) {
    snap(
      `📤 HEAPSORT — iterazione i = ${i}\nSwap A[0]=${A[0]} ↔ A[${i}]=${A[i]}\nIl massimo va nella posizione definitiva [${i}]`,
      [0, i], [0, i], 'sort', ['HeapSort(A)']
    );
    [A[0], A[i]] = [A[i], A[0]];
    hs--;
    snap(
      `✅ Swap: A[0]=${A[0]},  A[${i}]=${A[i]}  (ordinato!)\nA.hs-- = ${hs}\n${hs > 1 ? `Chiamo Max-Heapify(A, 0) per ripristinare il max-heap` : 'A.hs=1 → heap banale, stop'}`,
      [0], [], 'sort', ['HeapSort(A)']
    );
    if (hs > 1) maxHeapify(0, ['HeapSort(A)'], 'sort');
    snap(
      `✅ Max-heap ripristinato.\nElementi ordinati: ${8 - hs} / 8`,
      [], [], 'sort', ['HeapSort(A)']
    );
  }

  snap(
    `🎉 HEAPSORT COMPLETATO!\nArray ordinato: [${A.join(', ')}]`,
    Array.from({length: 8}, (_, i) => i), [], 'sort', []
  );

  return steps;
}

// ── Color scheme ──────────────────────────────────────────────────────────────
function nodeStyle(i, step) {
  if (step.swapping.includes(i))   return { fill: '#f97316', stroke: '#fb923c', text: '#fff' };
  if (step.comparing.includes(i))  return { fill: '#eab308', stroke: '#fbbf24', text: '#1a1a1a' };
  if (step.highlights.includes(i)) return { fill: '#3b82f6', stroke: '#60a5fa', text: '#fff' };
  if (i >= step.heapSize)          return { fill: '#0d2d0d', stroke: '#22c55e', text: '#22c55e' };
  return { fill: '#1e293b', stroke: '#475569', text: '#94a3b8' };
}

// ── SVG helpers ───────────────────────────────────────────────────────────────
function svgEl(tag, attrs = {}, text = '') {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text) el.textContent = text;
  return el;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render(step) {
  const svg = document.getElementById('treeSvg');
  svg.innerHTML = '';

  // edges
  for (const [p, ch] of EDGES) {
    const isActive = step.highlights.includes(p) || step.highlights.includes(ch) ||
                     step.swapping.includes(p)   || step.swapping.includes(ch);
    const bothInHeap = p < step.heapSize && ch < step.heapSize;
    svg.appendChild(svgEl('line', {
      x1: NODE_POS[p].x, y1: NODE_POS[p].y,
      x2: NODE_POS[ch].x, y2: NODE_POS[ch].y,
      stroke: isActive ? '#f97316' : bothInHeap ? '#334155' : '#1a2a1a',
      'stroke-width': isActive ? 2 : 1,
      'stroke-dasharray': !bothInHeap ? '4,4' : '',
    }));
  }

  // nodes
  for (let i = 0; i < 8; i++) {
    const { x, y } = NODE_POS[i];
    const col = nodeStyle(i, step);
    const inHeap = i < step.heapSize;
    const g = svgEl('g');

    // glow ring on swap
    if (step.swapping.includes(i)) {
      g.appendChild(svgEl('circle', { cx: x, cy: y, r: 28, fill: 'none', stroke: '#f97316', 'stroke-width': 1, opacity: 0.4 }));
    }
    g.appendChild(svgEl('circle', { cx: x, cy: y, r: 22, fill: col.fill, stroke: col.stroke, 'stroke-width': 2, opacity: inHeap ? 1 : 0.6 }));

    const val = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 14, 'font-weight': 700, fill: col.text, 'font-family': 'inherit' });
    val.textContent = step.array[i];
    g.appendChild(val);

    const idx = svgEl('text', { x, y: y + 32, 'text-anchor': 'middle', 'font-size': 10, fill: inHeap ? '#475569' : '#1e4a1e', 'font-family': 'inherit' });
    idx.textContent = `[${i}]`;
    g.appendChild(idx);

    if (!inHeap) {
      const chk = svgEl('text', { x, y: y - 30, 'text-anchor': 'middle', 'font-size': 11, fill: '#22c55e', 'font-family': 'inherit' });
      chk.textContent = '✓';
      g.appendChild(chk);
    }

    svg.appendChild(g);
  }

  // Array
  const arrayRow = document.getElementById('arrayRow');
  arrayRow.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const col = nodeStyle(i, step);
    const inHeap = i < step.heapSize;
    const cell = document.createElement('div');
    cell.className = 'array-cell';
    cell.innerHTML = `
      <div class="cell-box" style="background:${col.fill};border-color:${col.stroke};color:${col.text};opacity:${inHeap?1:0.6};${step.swapping.includes(i)?'box-shadow:0 0 14px '+col.stroke+'88':''}">
        ${step.array[i]}
        ${!inHeap ? '<span style="position:absolute;top:-8px;right:-4px;font-size:10px;color:#22c55e">✓</span>' : ''}
      </div>
      <div class="cell-idx">[${i}]</div>
    `;
    arrayRow.appendChild(cell);
  }
  document.getElementById('arrayInfo').textContent =
    `A.hs = ${step.heapSize}   |   Elementi ordinati: ${8 - step.heapSize} / 8`;

  // Description
  document.getElementById('description').textContent = step.description;

  // Call stack
  const cs = document.getElementById('callStack');
  cs.innerHTML = '';
  if (step.callStack.length === 0) {
    cs.innerHTML = '<span class="stack-empty">— vuoto —</span>';
  } else {
    step.callStack.forEach((fn, i) => {
      const frame = document.createElement('div');
      frame.className = 'stack-frame' + (i === step.callStack.length - 1 ? ' active' : '');
      frame.style.paddingLeft = `${10 + i * 10}px`;
      frame.textContent = fn;
      cs.appendChild(frame);
    });
  }

  // Pseudocode
  const pseudo = document.getElementById('pseudocode');
  if (step.phase === 'build') {
    pseudo.innerHTML = `<span class="kw">Build-Max-Heap(A, n):</span>
  A.hs = n
  for i = ⌊n/2⌋-1 downto 0
    Max-Heapify(A, i)

<span class="kw">Max-Heapify(A, i):</span>
  l=Left(i); r=Right(i); max=i
  <span class="cm">// left child</span>
  if l &lt; hs &amp;&amp; A[l]&gt;A[i]: max=l
  <span class="cm">// right child</span>
  if r &lt; hs &amp;&amp; A[r]&gt;A[max]: max=r
  if max ≠ i:
    swap(A[i], A[max])
    Max-Heapify(A, max)`;
  } else {
    pseudo.innerHTML = `<span class="kw2">HeapSort(A):</span>
  Build-Max-Heap(A)
  for i = n-1 downto 1
    swap(A[0], A[i])
    A.hs--
    Max-Heapify(A, 0)`;
  }

  // Phase badge
  const badge = document.getElementById('phaseBadge');
  badge.textContent = step.phase === 'build' ? '🏗️ Build-Max-Heap' : '📤 HeapSort — Estrazione';
  badge.className = 'phase-badge ' + step.phase;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const STEPS = generateSteps();
let idx     = 0;
let playing = false;
let speed   = 1200;
let timer   = null;

function goTo(i) {
  idx = Math.max(0, Math.min(i, STEPS.length - 1));
  render(STEPS[idx]);
  document.getElementById('progressBar').style.width = `${((idx + 1) / STEPS.length) * 100}%`;
  document.getElementById('stepCounter').textContent = `Passo ${idx + 1} / ${STEPS.length}`;
  document.getElementById('btnPrev').disabled = idx === 0;
  document.getElementById('btnNext').disabled = idx === STEPS.length - 1;
}

function startPlay() {
  if (idx >= STEPS.length - 1) { stopPlay(); return; }
  playing = true;
  document.getElementById('btnPlay').textContent = '⏸ Pausa';
  timer = setTimeout(() => { goTo(idx + 1); if (playing) startPlay(); }, speed);
}

function stopPlay() {
  playing = false;
  clearTimeout(timer);
  document.getElementById('btnPlay').textContent = '▶ Play';
}

document.getElementById('btnStart').onclick = () => { stopPlay(); goTo(0); };
document.getElementById('btnPrev').onclick  = () => { stopPlay(); goTo(idx - 1); };
document.getElementById('btnNext').onclick  = () => { stopPlay(); goTo(idx + 1); };
document.getElementById('btnEnd').onclick   = () => { stopPlay(); goTo(STEPS.length - 1); };
document.getElementById('btnPlay').onclick  = () => playing ? stopPlay() : startPlay();

document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.onclick = () => {
    speed = parseInt(btn.dataset.ms);
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (playing) { clearTimeout(timer); startPlay(); }
  };
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopPlay(); goTo(idx + 1); }
  if (e.key === 'ArrowLeft')  { stopPlay(); goTo(idx - 1); }
  if (e.key === ' ')          { e.preventDefault(); playing ? stopPlay() : startPlay(); }
});

// Init
goTo(0);