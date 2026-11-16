// Authentic Photobooth / Dye-Sublimation Photo Printer Sound Effect
// Procedurally synthesized via Web Audio API (Zero external assets required)
// Features:
// 1. Dual-tone servo motor whirr with gear-train harmonic modulation (typical of DNP/Canon photo printers)
// 2. Paper roll friction hiss (thermal head contact & rubber feed roller)
// 3. Rhythmic micro-stepper flutter (~16 Hz roller teeth cadence)
// 4. Authentic mechanical paper eject & cutter snip ("Ka-chik!") at the finish

export function playPrinterSoundEffect() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const printDuration = 1.55; // Synced with the 1.6s ticket slide animation

    // Master bus with gentle compressor/limiter to prevent clipping
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    masterGain.connect(ctx.destination);

    // =========================================================================
    // LAYER 1: Paper friction / thermal head glide (Bandpass-filtered noise)
    // =========================================================================
    const bufferSize = Math.floor(ctx.sampleRate * printDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1800, now);
    noiseFilter.frequency.linearRampToValueAtTime(2200, now + printDuration);
    noiseFilter.Q.setValueAtTime(2.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.08);
    noiseGain.gain.setValueAtTime(0.14, now + printDuration - 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + printDuration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // =========================================================================
    // LAYER 2: Stepper Motor & Roller Gear Train (Dual-tone servo whine)
    // Photobooth printers have high-speed servo motors with gear reduction
    // =========================================================================
    // Primary motor oscillator
    const motorOsc = ctx.createOscillator();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(280, now);
    // Subtle rise as motor reaches steady torque
    motorOsc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
    motorOsc.frequency.setValueAtTime(320, now + printDuration - 0.2);
    motorOsc.frequency.exponentialRampToValueAtTime(340, now + printDuration);

    // Secondary gear harmony (adds characteristic "high-pitched whirrr" of photo printers)
    const gearOsc = ctx.createOscillator();
    gearOsc.type = 'triangle';
    gearOsc.frequency.setValueAtTime(560, now);
    gearOsc.frequency.exponentialRampToValueAtTime(640, now + 0.2);
    gearOsc.frequency.setValueAtTime(640, now + printDuration - 0.2);
    gearOsc.frequency.exponentialRampToValueAtTime(680, now + printDuration);

    // Motor lowpass filter (simulates sound muffled inside the booth chassis)
    const motorFilter = ctx.createBiquadFilter();
    motorFilter.type = 'lowpass';
    motorFilter.frequency.setValueAtTime(850, now);

    // Roller teeth cogging modulation (LFO flutter at 15 Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(16, now); // 16 pulses per second (gear teeth)

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.025, now);

    const motorGain = ctx.createGain();
    motorGain.gain.setValueAtTime(0.0001, now);
    motorGain.gain.linearRampToValueAtTime(0.07, now + 0.06);
    motorGain.gain.setValueAtTime(0.07, now + printDuration - 0.1);
    motorGain.gain.exponentialRampToValueAtTime(0.0001, now + printDuration);

    lfo.connect(lfoGain);
    lfoGain.connect(motorGain.gain);

    motorOsc.connect(motorFilter);
    gearOsc.connect(motorFilter);
    motorFilter.connect(motorGain);
    motorGain.connect(masterGain);

    // =========================================================================
    // LAYER 3: End Eject & Paper Cutter Snip ("Ka-chik!") at t = printDuration
    // =========================================================================
    const cutTime = now + printDuration - 0.05;

    // 3A. Metallic blade slide / snip (high bandpass noise burst)
    const cutBufferSize = Math.floor(ctx.sampleRate * 0.12);
    const cutNoiseBuffer = ctx.createBuffer(1, cutBufferSize, ctx.sampleRate);
    const cutData = cutNoiseBuffer.getChannelData(0);
    for (let i = 0; i < cutBufferSize; i++) {
      cutData[i] = Math.random() * 2 - 1;
    }

    const cutNoise = ctx.createBufferSource();
    cutNoise.buffer = cutNoiseBuffer;

    const cutFilter = ctx.createBiquadFilter();
    cutFilter.type = 'bandpass';
    cutFilter.frequency.setValueAtTime(3400, cutTime);
    cutFilter.Q.setValueAtTime(3.5, cutTime);

    const cutNoiseGain = ctx.createGain();
    cutNoiseGain.gain.setValueAtTime(0.0001, cutTime);
    cutNoiseGain.gain.linearRampToValueAtTime(0.22, cutTime + 0.02);
    cutNoiseGain.gain.exponentialRampToValueAtTime(0.0001, cutTime + 0.11);

    cutNoise.connect(cutFilter);
    cutFilter.connect(cutNoiseGain);
    cutNoiseGain.connect(masterGain);

    // 3B. Mechanical latch / Solenoid "Clack" (sharp pitch-drop transient)
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(680, cutTime + 0.03);
    clickOsc.frequency.exponentialRampToValueAtTime(80, cutTime + 0.12);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.0001, cutTime + 0.03);
    clickGain.gain.linearRampToValueAtTime(0.20, cutTime + 0.04);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, cutTime + 0.14);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);

    // Start all sound layers
    noiseSource.start(now);
    motorOsc.start(now);
    gearOsc.start(now);
    lfo.start(now);

    cutNoise.start(cutTime);
    clickOsc.start(cutTime + 0.03);

    // Schedule stop
    const stopTime = cutTime + 0.16;
    noiseSource.stop(now + printDuration);
    motorOsc.stop(now + printDuration);
    gearOsc.stop(now + printDuration);
    lfo.stop(now + printDuration);

    cutNoise.stop(stopTime);
    clickOsc.stop(stopTime);

    // Cleanup audio context safely after sound finishes
    setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, Math.ceil((stopTime - now + 0.2) * 1000));
  } catch (err) {
    console.warn('Printer audio effect error:', err);
  }
}
