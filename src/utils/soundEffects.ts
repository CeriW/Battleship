// We need to access the global audio ref for fade out
// This will be set by the MusicButton component
let globalAudioRef: HTMLAudioElement | null = null;
let globalAudioEnabled = false; // Start with audio disabled by default

// Module-scoped handles for fade effects to prevent overlapping intervals/timeouts
let activeFadeInterval: NodeJS.Timeout | null = null;
let activeFadeTimeout: NodeJS.Timeout | null = null;

export const setGlobalAudioRef = (ref: HTMLAudioElement | null) => {
  globalAudioRef = ref;
};

export const setGlobalAudioEnabled = (enabled: boolean) => {
  globalAudioEnabled = enabled;
};

// Export function to check if audio is enabled
export const isAudioEnabled = () => globalAudioEnabled;

// Sound effects utility for the battleship game
export const playHitSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const hitSounds = ['hit-1.mp3', 'hit-2.mp3', 'hit-3.mp3', 'hit-4.mp3', 'hit-5.mp3'];
  const randomSound = hitSounds[Math.floor(Math.random() * hitSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 0.7; // Slightly louder than background music
  audio.play().catch((error) => {
    console.log('Hit sound playback failed:', error);
  });
};

export const playMissSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const missSounds = ['miss-1.mp3', 'miss-2.mp3', 'miss-3.mp3', 'miss-4.mp3', 'miss-5.mp3', 'miss-6.mp3', 'miss-7.mp3'];
  const randomSound = missSounds[Math.floor(Math.random() * missSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 0.6; // Slightly quieter than hit sounds
  audio.play().catch((error) => {
    console.log('Miss sound playback failed:', error);
  });
};

export const playAlarmSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const alarmSounds = ['alarm-1.mp3', 'alarm-2.mp3', 'alarm-3.mp3'];
  const randomSound = alarmSounds[Math.floor(Math.random() * alarmSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 0.8; // Louder than other sounds to grab attention
  audio.play().catch((error) => {
    console.log('Alarm sound playback failed:', error);
  });
};

export const playSuccessSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const successSounds = ['success-1.mp3', 'success-2.mp3', 'success-3.mp3'];
  const randomSound = successSounds[Math.floor(Math.random() * successSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 0.9; // Loudest sound to celebrate the success
  audio.play().catch((error) => {
    console.log('Success sound playback failed:', error);
  });
};

export const playFailSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const failSounds = ['fail-1.mp3', 'fail-2.mp3', 'fail-3.mp3'];
  const randomSound = failSounds[Math.floor(Math.random() * failSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 0.8; // Loud to emphasize the loss
  audio.play().catch((error) => {
    console.log('Fail sound playback failed:', error);
  });
};

export const playWinSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const winSounds = ['win-1.mp3', 'win-2.mp3', 'win-3.mp3'];
  const randomSound = winSounds[Math.floor(Math.random() * winSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 1.0; // Maximum volume for victory celebration
  audio.play().catch((error) => {
    console.log('Win sound playback failed:', error);
  });
};

export const playLoseSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const loseSounds = ['lose-1.mp3', 'lose-2.mp3', 'lose-3.mp3'];
  const randomSound = loseSounds[Math.floor(Math.random() * loseSounds.length)];

  const audio = new Audio(`/audio/${randomSound}`);
  audio.volume = 1.0; // Maximum volume for defeat emphasis
  audio.play().catch((error) => {
    console.log('Lose sound playback failed:', error);
  });
};

export const fadeOutMusic = () => {
  // Clear any existing fade effects to prevent overlapping
  cancelFadeEffects();

  if (!globalAudioRef || !isAudioEnabled()) {
    return;
  }

  activeFadeInterval = setInterval(() => {
    // Check current state before each action to prevent stale closures
    if (!globalAudioRef || !isAudioEnabled()) {
      cancelFadeEffects();
      return;
    }

    if (globalAudioRef.volume > 0.1) {
      globalAudioRef.volume -= 0.1;
    } else {
      globalAudioRef.pause();
      clearInterval(activeFadeInterval!);
      activeFadeInterval = null;

      // Fade back in after 4 seconds
      activeFadeTimeout = setTimeout(() => {
        // Check current state before fading back in
        if (!globalAudioRef || !isAudioEnabled()) {
          cancelFadeEffects();
          return;
        }

        globalAudioRef.play().catch((error) => {
          console.log('Audio playback failed:', error);
        });

        // Fade back in
        activeFadeInterval = setInterval(() => {
          // Check current state before each fade in step
          if (!globalAudioRef || !isAudioEnabled()) {
            cancelFadeEffects();
            return;
          }

          if (globalAudioRef.volume < 0.5) {
            globalAudioRef.volume += 0.1;
          } else {
            clearInterval(activeFadeInterval!);
            activeFadeInterval = null;
          }
        }, 100); // Fade in over ~1 second
      }, 4000); // Wait 4 seconds before fading back in
    }
  }, 100); // Fade out over ~1 second
};

// Function to cancel all fade effects and clear handles
export const cancelFadeEffects = () => {
  if (activeFadeInterval) {
    clearInterval(activeFadeInterval);
    activeFadeInterval = null;
  }
  if (activeFadeTimeout) {
    clearTimeout(activeFadeTimeout);
    activeFadeTimeout = null;
  }
};

export const playSunkSound = () => {
  // You can add ship sunk sounds here if desired
  // const sunkSounds = ['sunk-1.mp3', 'sunk-2.mp3'];
  // const randomSound = sunkSounds[Math.floor(Math.random() * sunkSounds.length)];
  // const audio = new Audio(`/audio/${randomSound}`);
  // audio.volume = 0.8;
  // audio.play().catch((error) => {
  //   console.log('Sunk sound playback failed:', error);
  // });
};

export const playBeepSound = () => {
  // Check if audio is enabled before playing sound
  if (!isAudioEnabled()) {
    return;
  }

  const audio = new Audio('/audio/beep-1.mp3');
  audio.volume = 0.7; // Moderate volume for button feedback
  audio.play().catch((error) => {
    console.log('Beep sound playback failed:', error);
  });
};
