import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outputDir = process.argv[2] ? resolve(process.argv[2]) : join(here, "sounds");
const sampleRate = 44_100;
await mkdir(outputDir, { recursive: true });

function envelope(time, duration, attack = 0.008, release = 0.035) {
  const fadeIn = Math.min(1, time / attack);
  const fadeOut = Math.min(1, (duration - time) / release);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

function toneAt(voice, time) {
  if (time < voice.start || time >= voice.start + voice.duration) return 0;
  const local = time - voice.start;
  const phase = 2 * Math.PI * voice.frequency * local;
  const wave = voice.wave === "square" ? (Math.sin(phase) >= 0 ? 1 : -1) : Math.sin(phase);
  return wave * voice.level * envelope(local, voice.duration, voice.attack, voice.release);
}

function makeWav(duration, voices) {
  const frameCount = Math.round(sampleRate * duration);
  const dataSize = frameCount * 2;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write("RIFF", 0, "ascii");
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8, "ascii");
  wav.write("fmt ", 12, "ascii");
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36, "ascii");
  wav.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < frameCount; index += 1) {
    const time = index / sampleRate;
    const mixed = voices.reduce((sum, voice) => sum + toneAt(voice, time), 0);
    const sample = Math.round(Math.max(-1, Math.min(1, mixed)) * 32767);
    wav.writeInt16LE(sample, 44 + index * 2);
  }
  return wav;
}

const sounds = [
  ["standard.wav", 0.10, [
    { start: 0, duration: 0.10, frequency: 392, level: 0.09 },
    { start: 0, duration: 0.10, frequency: 588, level: 0.035 },
  ]],
  ["fehler.wav", 0.18, [
    { start: 0, duration: 0.085, frequency: 220, level: 0.08, release: 0.025 },
    { start: 0.095, duration: 0.085, frequency: 185, level: 0.075, release: 0.025 },
  ]],
  ["benachrichtigung.wav", 0.16, [
    { start: 0, duration: 0.075, frequency: 523.25, level: 0.075 },
    { start: 0.075, duration: 0.085, frequency: 659.25, level: 0.07 },
  ]],
  ["geraet-verbunden.wav", 0.20, [
    { start: 0, duration: 0.08, frequency: 329.63, level: 0.065 },
    { start: 0.06, duration: 0.08, frequency: 440, level: 0.065 },
    { start: 0.12, duration: 0.08, frequency: 554.37, level: 0.06 },
  ]],
  ["geraet-getrennt.wav", 0.20, [
    { start: 0, duration: 0.08, frequency: 554.37, level: 0.06 },
    { start: 0.06, duration: 0.08, frequency: 440, level: 0.065 },
    { start: 0.12, duration: 0.08, frequency: 329.63, level: 0.065 },
  ]],
];

for (const [filename, duration, voices] of sounds) {
  await writeFile(join(outputDir, filename), makeWav(duration, voices));
  console.log(`Erzeugt: ${filename} (${Math.round(duration * 1000)} ms)`);
}
