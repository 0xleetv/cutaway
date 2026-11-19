# Antigravity Setup for cutaway

Why this file: cutaway ships as a Claude Code skill, but nothing in it is Claude-locked. It is a folder of markdown instructions plus node scripts. Any desktop agent, Antigravity included, can read SKILL.md and follow it. This file holds the setup steps and the prompts to paste into Antigravity. The `npx skills add` install path is for Claude Code only; Antigravity skips it and works straight from this repo folder.

## Phone or desktop

Viewing a finished build runs anywhere: cutaway bundles everything into one self-contained HTML file that opens in any browser, phone included.

Building needs a desktop. The build step itself is light, but the film render drives headless Chromium and ffmpeg, which a phone cannot run.

Verdict: build on the laptop through Antigravity, view the output anywhere.

## Performance bar: it must play smooth on a phone

Every finished build gets tested on a mid-range Android phone before it is called done. If it lags, scrolls rough or drops frames, the build is not finished. The tarantula example lags on a phone; that is the floor to beat, not the standard.

Rules the build follows to stay smooth:

1. Low poly counts. Model parts from simple primitives, not imported meshes.
2. No heavy post-processing. No full-screen bloom, blur or shader passes.
3. Cap the pixel ratio at 2.
4. Prefer baked or simple lighting; avoid realtime shadows on many lights.
5. Interaction (orbit, drag, explode) must stay at 60 fps on the phone.
6. Keep the html lean; the tarantula file is 885 KB and that is about the ceiling.

## One-time setup, about ten minutes

1. Node.js 20 or newer from nodejs.org, LTS version. Check with `node --version`.
2. `git clone https://github.com/0xleetv/cutaway.git` then `cd cutaway`.
3. `npm install` (pulls three.js, esbuild, playwright).
4. `npx playwright install chromium` (the headless browser, about 150 MB).
5. ffmpeg, only if you want rendered mp4 files. Windows: `winget install Gyan.FFmpeg`. macOS: `brew install ffmpeg`.
6. Python 3, only if you want the procedural sound. python.org.
7. Smoke test: `node sims/build.mjs tarantula-film`, then open `cutaway-out/dist/tarantula-film.html` in a browser. The example exists to prove the pipeline, not to ship. Real work starts fresh from your own picture.

## Prompt 1: environment setup (paste this first)

Read SKILL.md and docs/JOB_DESCRIPTION.md in this repo. Then set up my environment: confirm node is version 20 or newer, run npm install, run npx playwright install chromium, then check for ffmpeg and python 3. If either is missing, tell me plainly and give me the exact install command for this machine, or install it yourself if you can. Do not build anything yet. When everything is ready, print a short checklist of what passed and what is missing.

## Prompt 2: the build (paste this once setup passes)

Read SKILL.md and docs/JOB_DESCRIPTION.md in this repo. If SKILL.md is not in the current folder, first run git clone https://github.com/0xleetv/cutaway.git and cd into it.

Build a smartphone teardown from this reference picture: download it from https://guide-images.cdn.ifixit.com/igi/uZnks2HEM3CAp1KO.full into the repo folder first (an iFixit parts-layout photo of a disassembled phone on a white background). Follow SKILL.md exactly. Rebuild it in three.js as a 3D object I can take apart: glass, frame, camera modules, board, battery, display, every part visible in the reference. Write the checklist from the reference, build the still, then stop and show me the still. Do not film until I approve the still.

It must run smooth on a mid-range Android phone: low poly, no heavy post-processing, pixel ratio capped at 2, interaction at 60 fps. Test the final html on a phone and fix any lag before you call it done. Sound on: use the procedural sfx engine for the teardown.

After my approval, film it the way the piranha example is filmed, about 20 seconds, every part on its own camera, and give me the html.

## How the loop works, so you know what to expect

One reference picture sets the look. The agent rebuilds it in three.js from code; it never imports the image. The agent writes a 10 to 12 line checklist from your picture and grades itself against it every round. It stops after round 2 with a still and waits for your yes; nothing is filmed before that. Your corrections go into docs/JOB_DESCRIPTION.md as numbers and measurements, not vibes. The film gives every part its own camera, rendered frame by frame to a 60 fps mp4 with synced procedural sound, and the final piece is one HTML file.

## Repo map

SKILL.md: the order of work and the rules. docs/: JOB_DESCRIPTION.md, CHECKLIST.md, PROMPTS.md, LESSONS.md (the whole method, readable with or without the code). sims/: three complete example objects (tarantula, piranha, wasp), each in object, film and 10-second forms, plus sims/green/ page shell and review tools. sims/capture.mjs: the frame-by-frame mp4 renderer. sfx/ and run_sfx.py: the sound engine. sims/build.mjs: bundles any object into one HTML file.

Upstream credits stay intact: whaleyxbt/claude-motion (MIT) for the runtime, capture and sound engine; Barty-Bart/motion-graphics (CC0 Freesound samples).
