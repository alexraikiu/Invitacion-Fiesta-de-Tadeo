// Música
const music = document.getElementById(`bgMusic`);
const label = document.getElementById(`audio-label`);
let playing = false;

function tryAutoplay () {
    const p = music.play();
    if (p !== undefined){
        p.then(() => {playing = true ; label.textContent = `pausar`; })
            .catch(() => {
                document.addEventListener(`click`, () => {
                    music.play().then(() => { playing  = true; label.textContent = `Pausar`; });
                }, { once: true });
            });
    }
}

function togglemusic() {
  if (playing) { music.pause(); playing = false; label.textContent = 'Música'; }
  else         { music.play();  playing = true;  label.textContent = 'Pausar'; }
}

tryAutoplay();

// ANIMACIÓN AL HACER SCROLL — revelado tipo "pop" con rebote
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // ya apareció, no repetir
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.fade-up').forEach((el) => revealObserver.observe(el));

// Efecto parallax suave en el gif de Bluey del hero
const heroBg = document.getElementById('hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY;
    heroBg.style.transform = `translateY(${offset * 0.25}px) scale(${1 + Math.min(offset, 400) * 0.0002})`;
  }, { passive: true });
}

// ── RSVP ─────────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8LqrexOdv20xiHtpXSN4O7IqC9Reo_jsmL-PWBm5d6Btn4uQDeKvBxTrgPgeMa4TaGw/exec"
const guestAsiste = document.getElementById('guestAsiste');
if (guestAsiste) {
  guestAsiste.addEventListener('change', function () {
    document.getElementById('guestAcomp').style.display =
      this.value === 'Sí' ? 'block' : 'none';
  });
}

async function confirmarAsistencia() {
  const nombre  = document.getElementById('guestName').value.trim();
  const asiste  = document.getElementById('guestAsiste').value;
  const acomp   = parseInt(document.getElementById('guestAcomp').value || 0);
  const mensaje = document.getElementById('guestMsg').value.trim();
  const status  = document.getElementById('rsvp-status');
  const btn     = document.getElementById('btn-rsvp');
  const input   = document.getElementById('guestName');

  if (!nombre) {
    input.style.borderColor = 'rgba(184,147,90,0.8)';
    input.placeholder = 'Por favor escribe tu nombre';
    return;
  }
  if (!asiste) {
    status.textContent = 'Por favor indica si asistirás.';
    return;
  }

  btn.disabled = true;
  status.textContent = 'Enviando...';

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        asistencia: asiste,
        acompanantes: asiste === 'Sí' ? acomp : 0,
        total: asiste === 'Sí' ? acomp + 1 : 0,
        mensaje
      })
    });

    document.getElementById('rsvp-form').style.display = 'none';
    const s = document.getElementById('rsvp-success');
    s.style.display = 'block';
    document.getElementById('rsvp-ok').textContent = asiste === 'Sí'
      ? '¡Nos vemos en los XV, '    + nombre.split(' ')[0] + '!'
      : '¡Gracias por avisarnos, '   + nombre.split(' ')[0] + '!';

  } catch (err) {
    status.textContent = 'Error al enviar. Intenta de nuevo.';
    btn.disabled = false;
  }
}