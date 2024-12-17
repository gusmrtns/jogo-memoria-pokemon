document.getElementById('btnMute').addEventListener('click', function() {
    var musica = document.getElementById('musica');
    
    // Verifica se a música está pausada ou tocando
    if (musica.paused) {
      musica.play(); // Se pausada, retoma a música
      this.textContent = 'Mute'; // Atualiza o texto do botão para "Mute"
    } else {
      musica.pause(); // Se tocando, pausa a música
      this.textContent = 'Unmute'; // Atualiza o texto do botão para "Unmute"
    }
  });
  

musica.volume = 0.05; 