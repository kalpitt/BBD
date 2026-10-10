# 20s festive beat, 120 BPM, A minor. Writes beat.wav (stereo, 44.1 kHz).
import numpy as np, wave
SR = 44100; DUR = 24.5; N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
B = 0.5  # one beat in seconds

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i >= N or j <= i: return
    s = sig[:j - i] * gain
    L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))

def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def kick(big=False):
    n = int(SR * (0.9 if big else 0.45)); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (3 if big else 7))
    return np.tanh(s * 2.2)

def noise(n): return rng.standard_normal(n)
def hp(x, k=0.95):  # crude high-pass
    y = np.copy(x); y[1:] = x[1:] - k * x[:-1]; return y
def lp(x, a=0.1):   # one-pole low-pass
    y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y

def clap():
    n = int(SR * 0.25); s = hp(noise(n), 0.9)
    e = np.zeros(n)
    for o in (0, 0.012, 0.024): e += env(n, 0.001, 0.015 if o < 0.02 else 0.12) * (np.arange(n) / SR >= o)
    return s * e * 0.5

def hat(open_=False):
    n = int(SR * (0.18 if open_ else 0.05)); return hp(hp(noise(n))) * env(n, 0.001, 0.06 if open_ else 0.012) * 0.25

def pluck(freq, dur=0.9, bright=0.5):  # Karplus-Strong: sitar-ish pluck
    n = int(SR * dur); p = int(SR / freq)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.996 * (bright * buf[i % p] + (1 - bright) * buf[(i + 1) % p])
    # slight buzz (jawari) for a sitar flavour
    return np.tanh(out * 1.6) * env(n, 0.002, dur * 0.6)

def bass(freq, dur):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(4 * np.pi * freq * t) + 0.15 * np.sign(np.sin(2 * np.pi * freq * t))
    return s * np.minimum(1, t / 0.01) * np.minimum(1, (dur - t) / 0.05) * 0.35

def pad(freqs, dur):
    n = int(SR * dur); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-0.4, 0.4): s += np.sin(2 * np.pi * (f + d) * t + rng.uniform(0, 6))
    s = lp(s / len(freqs) / 2, 0.08)
    return s * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.3) * 0.18

def whoosh(dur=0.6, rise=True):
    n = int(SR * dur); s = noise(n); t = np.arange(n) / SR
    y = np.zeros(n); acc = 0.0
    for i in range(n):
        a = 0.02 + 0.5 * (t[i] / dur if rise else 1 - t[i] / dur) ** 2
        acc += a * (s[i] - acc); y[i] = acc
    sh = (t / dur) ** 2 if rise else (1 - t / dur) ** 1.5
    return y * sh * 0.9

def blip(f=1200, d=0.06):
    n = int(SR * d); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env(n, 0.001, 0.02) * 0.25

note = lambda m: 440 * 2 ** ((m - 69) / 12)
# chord per 2-second bar: Am F C G
prog = [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])]

# ---- intro hook (0-3s): slams on words, no full groove yet
for t in (0.05, 0.3, 0.55, 0.8): add(kick(), t + 0.12, 0.8); add(clap(), t + 0.12, 0.4)
add(whoosh(0.2), 1.3, 0.4)                                   # anticipation before the big hit
add(kick(True), 1.5, 1.0); add(pluck(note(69), 1.4, 0.3), 1.5, 0.6)
add(whoosh(0.9), 2.1, 0.5)
add(pad([note(57), note(60), note(64)], 3.0), 0, 0.8)

# ---- groove 3s -> 20.5s
t = 3.0
while t < 20.4:
    beat = round((t - 3.0) / B)
    add(kick(), t, 0.9)
    if beat % 2 == 1: add(clap(), t, 0.7)
    add(hat(), t + B / 2, 0.8, 0.3); add(hat(), t, 0.4, -0.3)
    if beat % 4 == 3: add(hat(True), t + B * 0.75, 0.5, 0.4)
    t += B
add(whoosh(1.4), 19.1, 0.8)                                  # riser into the end card

mel = [69, 72, 76, 74, 72, 69, 67, 69, 76, 79, 76, 74, 72, 74, 72, 69]
for bar in range(3, 20, 2):
    root, ch = prog[((bar - 3) // 2) % 4]
    add(pad([note(m) for m in ch], 2.0), bar, 1.0)
    for k in range(4):
        add(bass(note(root), 0.22), bar + k * B + B / 2, 1.0)
        add(bass(note(root), 0.18), bar + k * B, 0.6)
for i, t in enumerate(np.arange(3.0, 20.0, B / 2)):
    if i % 8 in (0, 3, 6) or (6 <= t < 12.5 and i % 2 == 0):
        add(pluck(note(mel[i % len(mel)]), 0.7, 0.45), t, 0.32, (-0.4, 0.4)[i % 2])

# ---- UI SFX, synced to the animation
for t in (3.0, 6.0, 12.5, 15.0): add(whoosh(0.35, False), t, 0.6)
for i in range(9): add(blip(900 + i * 90), 4.42 + i * 0.09, 0.7)          # category chips land
for a, b in ((6.95, 7.55), (8.75, 9.35), (10.45, 11.05)):                 # slider: press, slide, stop
    add(blip(700, 0.05), a - 0.15, 0.5); add(whoosh(0.5, True), a, 0.25); add(blip(1600, 0.12), b, 0.8)
    add(whoosh(0.3, True), b - 0.1, 0.35)                                  # card swings in
for t in (12.5, 13.0, 13.5, 14.0): add(whoosh(0.25, True), t - 0.05, 0.45); add(blip(1300, 0.08), t + 0.26, 0.6)
for i in range(18): add(blip(2600 + rng.integers(0, 600), 0.025), 15.5 + i * 0.062, 0.5)  # typing
add(blip(1100, 0.15), 16.8, 0.6)                                           # answer arrives

# ---- end card (20.5s+)
add(kick(True), 20.5, 1.1); add(whoosh(0.5, False), 20.5, 0.6)
for k, t in enumerate((20.74, 20.99, 21.24)): add(clap(), t, 0.5); add(pluck(note([64, 67, 69][k]), 1.0, 0.4), t, 0.4)
add(whoosh(0.3, True), 21.32, 0.5)                                         # URL wind-up
add(kick(True), 21.62, 1.2); add(clap(), 21.62, 0.8)
for m in (57, 64, 69, 72, 76): add(pluck(note(m), 3.0, 0.25), 21.62 + (m - 57) * 0.004, 0.3)
add(pad([note(57), note(64), note(69), note(72)], 3.0), 21.62, 1.3)
for t in np.arange(22.0, 23.5, B):
    add(kick(), t, 0.5); add(hat(), t + B / 2, 0.6)

# ---- master
fade = np.ones(N); fs = int(23.5 * SR); fade[fs:] = np.linspace(1, 0, N - fs) ** 1.5
L *= fade; R *= fade
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.3); mix /= np.abs(mix).max() / 0.89
with wave.open('beat.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('ok')
