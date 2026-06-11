/* ==========================================================================
   Dr. Neenu Kuriakose - Canvas Visuals (Particles, Neural Net, 3D Globe)
   ========================================================================== */

// --- Global Particle Background Class ---
export class GlobalParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.colorSet = {
      purple: 'rgba(123, 97, 255, 0.4)',
      cyan: 'rgba(0, 240, 255, 0.4)',
      active: 'rgba(123, 97, 255, 0.4)'
    };
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  init() {
    this.resize();
    this.particles = [];
    const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        baseOpacity: Math.random() * 0.5 + 0.1,
        colorType: Math.random() > 0.5 ? 'purple' : 'cyan'
      });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handleMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  setThemeColor(theme) {
    if (theme === 'cyan') {
      this.colorSet.active = 'rgba(0, 240, 255, 0.4)';
    } else {
      this.colorSet.active = 'rgba(123, 97, 255, 0.4)';
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Smooth transition back of active color if scroll updates
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.speedX;
      p.y += p.speedY;

      // Bound collisions
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

      // Mouse interactive push
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }
      }

      // Draw particle
      const color = p.colorType === 'purple' ? this.colorSet.active : 'rgba(0, 240, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.shadowBlur = p.size > 2 ? 8 : 0;
      this.ctx.shadowColor = color;
      this.ctx.fill();
    }
    
    this.ctx.shadowBlur = 0; // Reset
    requestAnimationFrame(() => this.animate());
  }
}

// --- Interactive AI Neural Network Section 3 ---
export class NeuralUniverse {
  constructor(canvasId, infoPanelId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.panel = document.getElementById(infoPanelId);
    
    this.nodes = [];
    this.links = [];
    this.mouse = { x: null, y: null, activeNode: null };
    
    // Core Research Spheres definitions
    this.coreData = [
      {
        id: 'cyber',
        name: 'Cybersecurity',
        desc: 'Establishing next-gen resilience frameworks, post-quantum cryptography, cloud intrusion detection systems, and vulnerability predictability mappings.',
        keywords: ['Zero-Trust', 'Cloud Security', 'Applied Cryptography', 'Threat Intel'],
        color: '#00f0ff',
        size: 26,
        pulseSpeed: 0.05
      },
      {
        id: 'ai',
        name: 'Artificial Intelligence',
        desc: 'Innovating generative model alignment, security analytics, adaptive neural parsing, and automated vulnerability scanning pipelines.',
        keywords: ['Adversarial ML', 'Transformers', 'Predictive Analysis', 'Deep Learning'],
        color: '#7b61ff',
        size: 26,
        pulseSpeed: 0.04
      },
      {
        id: 'ethical',
        name: 'Ethical AI',
        desc: 'Pioneering mathematical validation systems to audit model biases, guarantee transparency in decision neural matrices, and define ethical bounds for autonomous nodes.',
        keywords: ['Model Bias', 'Explainable AI (XAI)', 'Regulatory Policy', 'Fairness Metrics'],
        color: '#ff007a',
        size: 24,
        pulseSpeed: 0.06
      },
      {
        id: 'transformation',
        name: 'Digital Transformation',
        desc: 'Leading enterprise migrations, industrial automation security audits, and setting safe compliance paradigms for operational technologies.',
        keywords: ['Industry 4.0', 'IoT Security', 'Distributed Ledger', 'Edge Compute'],
        color: '#ffae00',
        size: 22,
        pulseSpeed: 0.035
      },
      {
        id: 'emerging',
        name: 'Emerging Technologies',
        desc: 'Analyzing vulnerabilities in quantum key distribution networks, swarm intelligence systems, and hardware security anchors (HSMs / PUFs).',
        keywords: ['Quantum Cryptography', 'Swarm Robotics', 'Hardware Anchors', 'Biometrics'],
        color: '#00ff66',
        size: 22,
        pulseSpeed: 0.045
      }
    ];

    this.init();
    this.animate();
    
    window.addEventListener('resize', () => {
      this.init();
    });
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', () => this.handleClick());
  }

  init() {
    this.resize();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.65;
    
    this.nodes = [];
    // Instantiate Core Nodes arranged circularly
    this.coreData.forEach((data, index) => {
      const angle = (index * (Math.PI * 2)) / this.coreData.length;
      this.nodes.push({
        ...data,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        baseX: centerX + Math.cos(angle) * radius,
        baseY: centerY + Math.sin(angle) * radius,
        currentSize: data.size,
        pulse: 0,
        isCore: true,
        hover: false
      });
    });

    // Populate Auxiliary Nodes to create neural mesh look
    const auxCount = 20;
    for (let i = 0; i < auxCount; i++) {
      const parentIndex = Math.floor(Math.random() * this.nodes.length);
      const parent = this.nodes[parentIndex];
      const dist = 60 + Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      this.nodes.push({
        id: `aux_${i}`,
        name: '',
        x: parent.x + Math.cos(angle) * dist,
        y: parent.y + Math.sin(angle) * dist,
        baseX: parent.x + Math.cos(angle) * dist,
        baseY: parent.y + Math.sin(angle) * dist,
        size: Math.random() * 5 + 3,
        currentSize: Math.random() * 5 + 3,
        color: 'rgba(123, 97, 255, 0.4)',
        isCore: false,
        pulse: 0,
        pulseSpeed: Math.random() * 0.03,
        hover: false
      });
    }

    // Define Connections
    this.links = [];
    // Link Core Nodes with each other
    for (let i = 0; i < this.coreData.length; i++) {
      for (let j = i + 1; j < this.coreData.length; j++) {
        this.links.push({ from: i, to: j, active: false });
      }
    }
    // Link Auxiliary nodes to their closest core nodes
    for (let i = this.coreData.length; i < this.nodes.length; i++) {
      let closestIdx = 0;
      let minDist = Infinity;
      for (let j = 0; j < this.coreData.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const d = dx*dx + dy*dy;
        if (d < minDist) {
          minDist = d;
          closestIdx = j;
        }
      }
      this.links.push({ from: i, to: closestIdx, active: false });
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    
    let hoveredNode = null;
    
    this.nodes.forEach(n => {
      if (n.isCore) {
        const dx = this.mouse.x - n.x;
        const dy = this.mouse.y - n.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < n.size + 15) {
          hoveredNode = n;
          n.hover = true;
        } else {
          n.hover = false;
        }
      }
    });

    if (hoveredNode !== this.mouse.activeNode) {
      this.mouse.activeNode = hoveredNode;
      if (hoveredNode) {
        this.updatePanel(hoveredNode);
        
        // Activate links attached to this node
        this.links.forEach(l => {
          const fromNode = this.nodes[l.from];
          const toNode = this.nodes[l.to];
          if (fromNode.id === hoveredNode.id || toNode.id === hoveredNode.id) {
            l.active = true;
          } else {
            l.active = false;
          }
        });
      } else {
        this.links.forEach(l => l.active = false);
      }
    }
  }

  handleClick() {
    if (this.mouse.activeNode) {
      this.updatePanel(this.mouse.activeNode);
    }
  }

  updatePanel(node) {
    const titleEl = document.getElementById('node-info-title');
    const descEl = document.getElementById('node-info-desc');
    const keywordsEl = document.getElementById('node-info-keywords');
    
    if (titleEl && descEl && keywordsEl) {
      titleEl.innerText = node.name;
      titleEl.style.color = node.color;
      descEl.innerText = node.desc;
      
      keywordsEl.innerHTML = '';
      node.keywords.forEach(kw => {
        const span = document.createElement('span');
        span.innerText = kw;
        span.style.color = node.color;
        span.style.borderColor = node.color + '44';
        span.style.background = node.color + '11';
        keywordsEl.appendChild(span);
      });
      
      this.panel.classList.add('active');
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = Date.now() * 0.001;

    // Draw Links
    this.links.forEach(l => {
      const from = this.nodes[l.from];
      const to = this.nodes[l.to];
      
      this.ctx.beginPath();
      this.ctx.moveTo(from.x, from.y);
      this.ctx.lineTo(to.x, to.y);
      
      if (l.active) {
        this.ctx.strokeStyle = from.isCore ? from.color : to.color;
        this.ctx.lineWidth = 2.0;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = from.isCore ? from.color : to.color;
      } else {
        this.ctx.strokeStyle = 'rgba(123, 97, 255, 0.12)';
        this.ctx.lineWidth = 1.0;
        this.ctx.shadowBlur = 0;
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0; // Reset
      
      // Moving energy pulses along active links
      if (l.active && Math.random() > 0.6) {
        const ratio = (time * 1.5) % 1;
        const pulseX = from.x + (to.x - from.x) * ratio;
        const pulseY = from.y + (to.y - from.y) * ratio;
        
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
        this.ctx.fillStyle = from.isCore ? from.color : to.color;
        this.ctx.fill();
      }
    });

    // Draw Nodes
    this.nodes.forEach(n => {
      // Floating animation offset
      const floatX = Math.sin(time + n.pulseSpeed * 100) * 3;
      const floatY = Math.cos(time + n.pulseSpeed * 200) * 3;
      n.x = n.baseX + floatX;
      n.y = n.baseY + floatY;

      n.pulse += n.pulseSpeed;
      
      if (n.isCore) {
        const pulseScale = n.hover ? 1.25 : 1 + Math.sin(n.pulse) * 0.08;
        n.currentSize = n.size * pulseScale;

        // Glowing outer stroke
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.currentSize * 1.35, 0, Math.PI * 2);
        this.ctx.strokeStyle = n.color + '15';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.currentSize, 0, Math.PI * 2);
        
        // Node Fill
        const grad = this.ctx.createRadialGradient(n.x, n.y, 1, n.x, n.y, n.currentSize);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, n.color);
        grad.addColorStop(1, 'rgba(5, 5, 10, 0.9)');
        
        this.ctx.fillStyle = grad;
        this.ctx.shadowBlur = n.hover ? 25 : 10;
        this.ctx.shadowColor = n.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset
        
        // Node Label
        this.ctx.font = '500 13px Space Grotesk';
        this.ctx.fillStyle = n.hover ? '#fff' : 'rgba(255,255,255,0.7)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(n.name, n.x, n.y + n.currentSize + 22);
      } else {
        // Simple small dot
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.currentSize, 0, Math.PI * 2);
        this.ctx.fillStyle = n.color;
        this.ctx.fill();
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// --- Section 8: 3D Particle-projected Globe ---
export class VisualGlobe {
  constructor(canvasId, tooltipId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = document.getElementById(tooltipId);
    
    this.points = [];
    this.globeRadius = 180;
    this.rotationY = 0;
    this.rotationX = 0.2;
    this.mouse = { x: null, y: null };
    
    // Hub coordinate definitions (lat/lng, name)
    this.hubs = [
      { name: 'Boston Hub', lat: 42.3601, lng: -71.0589, desc: 'Machine Learning integrity studies.', color: '#7b61ff' },
      { name: 'London Advisory', lat: 51.5074, lng: -0.1278, desc: 'Academic cybersecurity advisory boards.', color: '#00f0ff' },
      { name: 'Bangalore Tech Policy', lat: 12.9716, lng: 77.5946, desc: 'AI Governance keynote symposiums.', color: '#ff007a' },
      { name: 'Tokyo Symposium', lat: 35.6762, lng: 139.6503, desc: 'Asia-Pacific threat vectors research panels.', color: '#ffae00' }
    ];
    
    this.projectedHubs = [];
    
    this.initPoints();
    this.animate();
    
    window.addEventListener('resize', () => {
      this.initPoints();
    });
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  // Pre-calculate latitude and longitude grid points to represent globe outline
  initPoints() {
    this.resize();
    this.points = [];
    
    // Build a neat sphere of points
    const step = 15;
    for (let lat = -90; lat <= 90; lat += step) {
      const phi = (lat * Math.PI) / 180;
      const ringRadius = Math.cos(phi);
      const stepLng = Math.max(step, Math.floor(step / ringRadius));
      for (let lng = -180; lng < 180; lng += stepLng) {
        const theta = (lng * Math.PI) / 180;
        this.points.push({
          x: Math.cos(phi) * Math.sin(theta),
          y: Math.sin(phi),
          z: Math.cos(phi) * Math.cos(theta),
          isHub: false
        });
      }
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 450;
    this.canvas.height = rect.height || 450;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  // Rotate coordinates in 3D space
  rotateY(p, theta) {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x * cos - p.z * sin,
      y: p.y,
      z: p.x * sin + p.z * cos
    };
  }

  rotateX(p, theta) {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x,
      y: p.y * cos - p.z * sin,
      z: p.y * sin + p.z * cos
    };
  }

  // Convert lat/lng to 3D Cartesian coordinates on sphere
  latLngToCartesian(lat, lng) {
    const phi = (lat * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180; // Add offset to match standard mapping rotation
    return {
      x: -Math.cos(phi) * Math.sin(theta),
      y: Math.sin(phi),
      z: Math.cos(phi) * Math.cos(theta)
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    
    // Increment rotation
    this.rotationY += 0.0035;
    
    this.projectedHubs = [];
    let hoveredHub = null;

    // Draw background faint atmosphere sphere glow
    const radialGlow = this.ctx.createRadialGradient(cx, cy, this.globeRadius * 0.7, cx, cy, this.globeRadius * 1.15);
    radialGlow.addColorStop(0, 'rgba(123, 97, 255, 0.0)');
    radialGlow.addColorStop(0.7, 'rgba(123, 97, 255, 0.03)');
    radialGlow.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    this.ctx.fillStyle = radialGlow;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, this.globeRadius * 1.25, 0, Math.PI * 2);
    this.ctx.fill();

    // 1. Draw Globe Base Outline Points
    this.points.forEach(p => {
      // 3D Rotations
      let rot = this.rotateY(p, this.rotationY);
      rot = this.rotateX(rot, this.rotationX);
      
      // Perspective projection
      const perspective = 400;
      const scale = perspective / (perspective + rot.z * this.globeRadius);
      const projX = cx + rot.x * this.globeRadius * scale;
      const projY = cy + rot.y * this.globeRadius * scale;

      // Only draw forward hemisphere points with full opacity, fade back hemisphere points
      if (rot.z > -0.2) {
        const opacity = (rot.z + 0.2) * 0.45;
        this.ctx.beginPath();
        this.ctx.arc(projX, projY, 1.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(160, 160, 186, ${opacity})`;
        this.ctx.fill();
      }
    });

    // 2. Project and Draw Connection Arcs between Hubs
    for (let i = 0; i < this.hubs.length; i++) {
      const h1 = this.hubs[i];
      const h2 = this.hubs[(i + 1) % this.hubs.length]; // Link sequentially or customized
      
      const p1 = this.latLngToCartesian(h1.lat, h1.lng);
      const p2 = this.latLngToCartesian(h2.lat, h2.lng);
      
      // Rotate 3D
      let r1 = this.rotateY(p1, this.rotationY);
      r1 = this.rotateX(r1, this.rotationX);
      let r2 = this.rotateY(p2, this.rotationY);
      r2 = this.rotateX(r2, this.rotationX);
      
      if (r1.z > 0 && r2.z > 0) { // Both on screen
        const scale1 = 400 / (400 + r1.z * this.globeRadius);
        const x1 = cx + r1.x * this.globeRadius * scale1;
        const y1 = cy + r1.y * this.globeRadius * scale1;
        
        const scale2 = 400 / (400 + r2.z * this.globeRadius);
        const x2 = cx + r2.x * this.globeRadius * scale2;
        const y2 = cy + r2.y * this.globeRadius * scale2;
        
        // Draw Bezier Arc Curve (pull arc outwards)
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const d = Math.sqrt(dx*dx + dy*dy);
        
        // Control point pulled outwards normal to chord
        const nx = -dy / d;
        const ny = dx / d;
        const arcHeight = d * 0.25;
        const cxArc = mx + nx * arcHeight;
        const cyArc = my + ny * arcHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(cxArc, cyArc, x2, y2);
        this.ctx.strokeStyle = 'rgba(123, 97, 255, 0.15)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    }

    // 3. Project and Draw Hub Points
    this.hubs.forEach(h => {
      const p = this.latLngToCartesian(h.lat, h.lng);
      
      // 3D Rotations
      let rot = this.rotateY(p, this.rotationY);
      rot = this.rotateX(rot, this.rotationX);
      
      const perspective = 400;
      const scale = perspective / (perspective + rot.z * this.globeRadius);
      const projX = cx + rot.x * this.globeRadius * scale;
      const projY = cy + rot.y * this.globeRadius * scale;
      
      const isFront = rot.z > 0;
      
      if (isFront) {
        this.projectedHubs.push({
          name: h.name,
          desc: h.desc,
          color: h.color,
          x: projX,
          y: projY,
          size: 7
        });

        // Hover detection
        if (this.mouse.x !== null) {
          const dx = this.mouse.x - projX;
          const dy = this.mouse.y - projY;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 15) {
            hoveredHub = h;
          }
        }

        // Animated Pulse rings
        const timeScale = (Date.now() * 0.002) % 1;
        this.ctx.beginPath();
        this.ctx.arc(projX, projY, 6 + timeScale * 14, 0, Math.PI * 2);
        this.ctx.strokeStyle = h.color + `${Math.floor((1 - timeScale) * 255).toString(16).padStart(2, '0')}`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Draw solid node core
        this.ctx.beginPath();
        this.ctx.arc(projX, projY, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = h.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset
      }
    });

    // Handle Tooltip display
    if (this.tooltip) {
      if (hoveredHub) {
        this.tooltip.innerHTML = `<strong>${hoveredHub.name}</strong><br>${hoveredHub.desc}`;
        this.tooltip.style.opacity = 1;
        this.tooltip.style.left = `${this.mouse.x + 15}px`;
        this.tooltip.style.top = `${this.mouse.y - 45}px`;
        
        // Link active hub item class on left
        const listItems = document.querySelectorAll('.hub-item');
        listItems.forEach(item => {
          if (item.getAttribute('data-label') === hoveredHub.name) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      } else {
        // Fades tooltip slowly if not hovering
        if (this.tooltip.style.opacity === '1') {
          this.tooltip.style.opacity = 0;
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}
