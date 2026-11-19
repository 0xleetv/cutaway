"""Procedural score for the smartphone teardown film.
Generates synchronized studio procedural sound using the cutaway sfx engine.
"""
import os
import sys

from sfx.score_kit import airy, bed, chords, hz, thud
from sfx.synth import blip, click, envelope, pad

TIMELINE = os.environ.get("TL", os.path.join(os.path.dirname(__file__), "../phone-film/timeline.json"))
OUT = os.environ.get("OUT", os.path.join(os.environ.get("CUTAWAY_OUT", "cutaway-out"), "phone-score.wav"))
TARGET_LUFS = -14.0
SEED = 52

# Elegant technological harmony in F minor (Fm9, Dbmaj7, Bbm9, C7sus)
CHORDS = chords(
    "Fm9:F2 C3 Eb3 G3 Ab3/F1",
    "Dbmaj7:Db2 F3 Ab3 C4 F4/Db1",
    "Bbm9:Bb1 F2 Ab2 C3 Db3/Bb0",
    "C7sus:C2 F2 G2 Bb2 Eb3/C1"
)
MOTIF = [(0.5, hz("C5")), (1.5, hz("Ab4")), (2.5, hz("G4"))]

def snap(mix, t, level=0.06, pan=0.0):
    """Clean mechanical snap on part latching."""
    mix.put(t, click(2200, 0.025), level, pan=pan)
    mix.put(t, thud(120, 0.05, 0.2), level * 0.4, pan=pan)

def score(mix, tl):
    dur = tl["duration"]
    # Ambient electronic music bed
    left, right, low, drums = bed(
        dur, 90, CHORDS, MOTIF,
        motif_voice="blip",
        kicks=(0, 2),
        snares=(1, 3),
        hats=8,
        swing=0.06,
        keys_vel=0.7,
        keys_lp=3400
    )
    mix.put_stereo(0, left, right, 0.12)
    mix.put(0, low, 0.12)
    mix.put(0, drums, 0.045)

    bar = 4 * 60 / 90
    changes = [(0.1 + b * bar, [f for f in CHORDS[b % len(CHORDS)][0][:4]]) for b in range(int(dur / bar) + 1)]
    pl, pr = pad(dur, changes, volume=envelope([(0, 0), (1.0, 1), (dur - 1.5, 1), (dur, 0)]), detune=0.6, tremolo=0.15)
    mix.put_stereo(0, pl, pr, 0.06)

    # Initial overview sweep
    mix.put(0.0, airy(2.2, 500, 1400, 0.5), 0.018, pan=-0.2)

    for e in tl["script"]:
        t, act = e["t"], e["act"]
        # UI button click cue
        mix.put(t, click(2800, 0.02), 0.045, pan=0.3)

        if act == "overview":
            mix.put(t + 0.2, airy(1.2, 600, 1800, 0.5), 0.015)
        elif act == "optics":
            # Camera lens clicks and zoom sound
            mix.put(t + 0.3, airy(0.8, 1400, 2800, 0.5), 0.012, pan=-0.2)
            for i, dt in enumerate((0.4, 0.55, 0.7, 0.85)):
                mix.put(t + dt, click(3400 - 150 * i, 0.015), 0.03, pan=-0.2)
            mix.put(t + 1.8, click(2200, 0.025), 0.04, pan=-0.2)
        elif act == "board":
            # RF shield metallic clicks and micro-coax clicks
            mix.put(t + 0.3, airy(0.7, 800, 2200, 0.5), 0.015, pan=0.1)
            for i, dt in enumerate((0.4, 0.6, 0.8, 1.0)):
                mix.put(t + dt, blip(hz("F5") * (1.1 ** i), 0.15, 0.05), 0.014, pan=0.15)
            mix.put(t + 2.0, click(2400, 0.02), 0.04, pan=0.1)
        elif act == "shield":
            # Resonant copper ping & slide
            mix.put(t + 0.2, blip(hz("C6"), 0.4, 0.15), 0.018, pan=-0.1)
            mix.put(t + 0.4, airy(0.6, 1200, 600, 0.5), 0.012)
        elif act == "battery":
            # Battery connector click
            mix.put(t + 0.2, click(1800, 0.025), 0.04, pan=0.2)
            mix.put(t + 0.4, thud(110, 0.06, 0.2), 0.03, pan=0.2)
        elif act == "display":
            # Flex cable ribbon swoosh
            mix.put(t + 0.2, airy(0.9, 900, 2400, 0.6), 0.02, pan=0.25)
            mix.put(t + 0.6, click(2600, 0.02), 0.035, pan=0.25)
        elif act == "exploded":
            # Big smooth airy whoosh into 3D exploded turntable
            mix.put(t + 0.2, airy(1.8, 400, 2600, 0.7), 0.035, pan=0.0)
            mix.put(t + 0.3, blip(hz("F5"), 0.5, 0.12), 0.022)
            for k in range(6):
                mix.put(t + 0.8 + 0.3 * k, click(3000 + 80 * k, 0.012), 0.015, pan=-0.3 + 0.1 * k)
        elif act == "assemble":
            # Rapid snap clicks as all parts reassemble into the phone
            mix.put(t + 0.1, airy(1.2, 2200, 500, 0.6), 0.025)
            for i, dt in enumerate((0.3, 0.55, 0.8, 1.05, 1.3)):
                snap(mix, t + dt, 0.05 + 0.01 * i, pan=-0.2 + 0.1 * i)
        elif act == "hero":
            # Final solid lock & settle
            snap(mix, t + 0.3, 0.07, pan=0.0)
            mix.put(t + 0.35, blip(hz("C5"), 0.8, 0.2), 0.025)
