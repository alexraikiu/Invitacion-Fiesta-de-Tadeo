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