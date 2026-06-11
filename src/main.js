/* ==========================================================================
   Dr. Neenu Kuriakose - Immersive Portfolio Main Script
   ========================================================================== */

import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { GlobalParticles, NeuralUniverse, VisualGlobe } from './canvas-network.js';

// --- Register GSAP Plugins ---
gsap.registerPlugin(ScrollTrigger);

// --- Initialize Smooth Scroll (Lenis) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5
});

// Link Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- Navigation Scroll Background Transition ---
const header = document.querySelector('.glass-nav');
lenis.on('scroll', (e) => {
  if (e.scroll > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// --- Mouse Custom Glow Cursor Accent ---
const cursor = document.getElementById('glow-cursor');
window.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: 'power2.out'
  });
});

// --- Initialize Canvas Visualizers and Animations on Window Load ---
window.addEventListener('load', () => {
  const bgParticles = new GlobalParticles('global-particles');
  const neuralNet = new NeuralUniverse('neural-canvas', 'neural-info-panel');
  const globe = new VisualGlobe('globe-canvas', 'globe-tooltip');

  // Theme Color Syncing with Canvas Background Particles
  ScrollTrigger.create({
    trigger: '#universe',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => bgParticles.setThemeColor('purple'),
    onEnterBack: () => bgParticles.setThemeColor('purple'),
    onLeave: () => bgParticles.setThemeColor('cyan'),
    onLeaveBack: () => bgParticles.setThemeColor('cyan')
  });

  // --- Match Media for Desktop and Mobile Motion Designs ---
  let mm = gsap.matchMedia();

  // --- Section 1: Hero Animations ---
  // Letter-by-letter name reveal
  const nameEl = document.getElementById('hero-name');
  if (nameEl) {
    const nameText = 'Dr. Neenu Kuriakose';
    nameEl.innerHTML = nameText
      .split('')
      .map(letter => `<span>${letter === ' ' ? '&nbsp;' : letter}</span>`)
      .join('');

    gsap.fromTo('#hero-name span', 
      { opacity: 0, y: 40, rotateX: -45 }, 
      { opacity: 1, y: 0, rotateX: 0, duration: 1.0, stagger: 0.04, ease: 'power4.out' }
    );
    
    gsap.fromTo('.fade-in-init',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.8, stagger: 0.2, ease: 'power3.out' }
    );
  }

  // Persistent Fixed Desktop Avatar Scroll Motion (Unified Timeline for Scroll Back Stability)
  mm.add("(min-width: 1025px)", () => {
    const avatarTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    // First half of scroll (Hero to About): Move left & scale
    avatarTimeline.to('#fixed-avatar', {
      x: '-50vw',
      scale: 0.85,
      opacity: 1,
      ease: 'none',
      duration: 1
    });

    // Second half of scroll (About to Universe): Fade out
    avatarTimeline.to('#fixed-avatar', {
      opacity: 0,
      ease: 'none',
      duration: 1
    });
  });

  // --- Section 2: Who I Am Animations ---
  // Words reveals on scroll
  const revealWords = document.querySelectorAll('.reveal-word');
  revealWords.forEach((word) => {
    ScrollTrigger.create({
      trigger: word,
      start: 'top 80%',
      end: 'top 40%',
      scrub: true,
      onEnter: () => word.classList.add('active'),
      onLeaveBack: () => word.classList.remove('active')
    });
  });

  // Typewriter Bio effect
  let bioTriggered = false;
  const bioText = "Dr. Neenu Kuriakose is a leading academician and cyber intelligence pioneer. Combining rigorous security principles with next-generation machine learning architectures, her research defines ethical AI guidelines and cloud-hardened environments. She has published multiple peer-reviewed papers in high-impact journals and holds registered patents in decentralized security protocols. In the classroom and at conferences, she empowers developers and students to build secure systems for humanity.";
  const typewriterEl = document.getElementById('typewriter-bio');

  function typeWriter(text, index) {
    if (index < text.length) {
      if (typewriterEl) {
        typewriterEl.innerHTML += text.charAt(index);
      }
      setTimeout(() => typeWriter(text, index + 1), 15);
    }
  }

  ScrollTrigger.create({
    trigger: '.bio-box',
    start: 'top 80%',
    onEnter: () => {
      if (!bioTriggered) {
        bioTriggered = true;
        if (typewriterEl) typewriterEl.innerHTML = '';
        typeWriter(bioText, 0);
      }
    }
  });

  // --- Section 4: Publications 3D Tilt & Parallax Rotation ---
  const pubCards = document.querySelectorAll('.pub-card');
  pubCards.forEach((card) => {
    // Parallax fade-in and scale on scroll
    gsap.fromTo(card,
      { rotateY: -15, rotateX: 10, y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 65%',
          scrub: true
        },
        rotateY: 0,
        rotateX: 0,
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    );

    // 3D Tilt card matching mouse tracking
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const rotateY = ((x - xc) / xc) * 12; // Max 12deg
      const rotateX = -((y - yc) / yc) * 12;
      
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotateY(0deg) rotateX(0deg) scale(1)`;
    });
  });

  // --- Section 5: Teaching Impact Timeline & Counters ---
  // Draw Active Path on scroll
  const path = document.querySelector('.timeline-path-active');
  if (path) {
    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.to(path, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: '.timeline-wrapper',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: true
      }
    });
  }

  // Fade in timeline cards
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
    gsap.fromTo(item, 
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          end: 'top 55%',
          scrub: true,
          onEnter: () => item.classList.add('active'),
          onLeaveBack: () => item.classList.remove('active')
        },
        opacity: 1,
        y: 0
      }
    );
  });

  // Counting up statistics numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((num) => {
    const target = parseInt(num.getAttribute('data-target'));
    const counterObj = { count: 0 };
    
    ScrollTrigger.create({
      trigger: num,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(counterObj, {
          count: target,
          duration: 2.0,
          ease: 'power3.out',
          onUpdate: () => {
            num.innerText = Math.floor(counterObj.count).toLocaleString() + '+';
          }
        });
      }
    });
  });

  // --- Section 6: Quote Masking Reveals ---
  const quotes = document.querySelectorAll('.vision-quote');
  quotes.forEach((quote) => {
    ScrollTrigger.create({
      trigger: quote,
      start: 'top 88%',
      onEnter: () => quote.classList.add('revealed'),
      onLeaveBack: () => quote.classList.remove('revealed')
    });
  });

  // --- Section 7: Linked Horizontal Scrolling Slide Deck ---
  mm.add("(min-width: 1025px)", () => {
    const container = document.querySelector('.horizontal-scroll-container');
    if (container) {
      // 1. Smooth horizontal slide of the entire container linked to vertical scroll
      gsap.to(container, {
        x: () => -(container.scrollWidth - window.innerWidth + 200),
        ease: 'none',
        scrollTrigger: {
          trigger: '#speaker',
          pin: true,
          start: 'top top',
          end: () => '+=' + container.scrollWidth,
          scrub: 1.5, // buttery smooth scrub lag
          invalidateOnRefresh: true
        }
      });

      // 2. Smooth reveal of the "Engagement / Speaker & Industry Mentor" text
      gsap.from('.speaker-intro-card > *', {
        scrollTrigger: {
          trigger: '#speaker',
          start: 'top 50%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 3. Staggered fade and slide-in of the individual cards
      gsap.from('.speaker-slides-wrapper .slide-card', {
        scrollTrigger: {
          trigger: '#speaker',
          start: 'top 40%',
          toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: 'power4.out'
      });
    }
  });

  // Mobile vertical cards smooth fade-in
  mm.add("(max-width: 1024px)", () => {
    const mobileCards = document.querySelectorAll('.slide-card');
    mobileCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 65%',
          scrub: true
        },
        y: 40,
        opacity: 0,
        ease: 'power2.out'
      });
    });
  });

  // --- Section 8: Global Impact Active Item Syncing ---
  const hubItems = document.querySelectorAll('.hub-item');
  hubItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      hubItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // --- Section 9: Contact Modal Overlay Actions ---
  const modal = document.getElementById('contact-modal');
  const openModalBtn = document.getElementById('open-contact-btn');
  const closeModalBtn = document.getElementById('close-contact-btn');
  const contactForm = document.getElementById('portfolio-contact-form');
  const successMsg = document.getElementById('form-success');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      modal.classList.add('open');
      lenis.stop();
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      lenis.start();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        lenis.start();
      }
    });
  }

  if (contactForm && successMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      successMsg.classList.add('active');
    });
  }

  // --- Mobile Navigation Menu Overlay Actions ---
  const menuToggleBtn = document.querySelector('.mobile-menu-btn');
  const navDrawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (menuToggleBtn && navDrawer) {
    menuToggleBtn.addEventListener('click', () => {
      menuToggleBtn.classList.toggle('open');
      navDrawer.classList.toggle('open');
      if (navDrawer.classList.contains('open')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggleBtn && navDrawer) {
        menuToggleBtn.classList.remove('open');
        navDrawer.classList.remove('open');
        lenis.start();
      }
    });
  });

  // Anchor link navigation redirection syncing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        lenis.scrollTo(targetEl, {
          offset: -40,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

  // Force ScrollTrigger to compute layout values
  ScrollTrigger.refresh();
});
