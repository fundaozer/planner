import type { AmbientSoundType } from '../interfaces';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gürültü tamponu oluşturma
  private createNoiseBuffer(duration: number = 5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }
    return buffer;
  }

  public play(type: AmbientSoundType, volume: number = 0.5) {
    if (type === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    if (this.isPlaying && this.currentType === type) {
      this.setVolume(volume);
      return;
    }

    this.stop();
    this.currentType = type;
    this.isPlaying = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const noiseBuffer = this.createNoiseBuffer(6);
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    if (type === 'rain') {
      // Yağmur efekti
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter);
    } else if (type === 'waves') {
      // Dalga efekti
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start();
      lfo.start();
      this.activeNodes.push(noiseSource, filter, lfo, lfoGain);
    } else if (type === 'fire') {
      // Şömine efekti
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter);

      this.intervalId = window.setInterval(() => {
        if (!this.ctx || !this.gainNode || !this.isPlaying) return;
        if (Math.random() > 0.4) {
          const pop = this.ctx.createOscillator();
          const popGain = this.ctx.createGain();
          pop.type = 'triangle';
          pop.frequency.setValueAtTime(400 + Math.random() * 800, this.ctx.currentTime);
          popGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
          popGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          pop.connect(popGain);
          popGain.connect(this.gainNode);
          pop.start();
          pop.stop(this.ctx.currentTime + 0.04);
        }
      }, 150);
    } else if (type === 'cafe') {
      // Kafe gürültüsü
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.gainNode);
      noiseSource.start();
      this.activeNodes.push(noiseSource, filter);
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume * 0.4)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentType = 'none';

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.activeNodes.forEach((node) => {
      if (typeof node === 'object' && 'stop' in node && typeof node.stop === 'function') {
        try {
          node.stop();
        } catch {}
      }
      if (typeof node === 'object' && 'disconnect' in node && typeof node.disconnect === 'function') {
        try {
          node.disconnect();
        } catch {}
      }
    });
    this.activeNodes = [];

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }
  }
}

export const ambientSound = new AmbientSoundEngine();
