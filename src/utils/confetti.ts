import confetti from 'canvas-confetti';

// Konfeti animasyonu
export const triggerConfetti = (type: 'small' | 'celebrate' = 'small') => {
  try {
    if (type === 'small') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
      });
    } else {
      const end = Date.now() + 1200;
      const colors = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  } catch (err) {
    console.warn('Konfeti hatası:', err);
  }
};
