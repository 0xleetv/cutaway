# Antigravity Setup for cutaway

Why this file: cutaway ships as a Claude Code skill, but nothing in it is Claude-locked. It is a folder of markdown instructions plus node scripts. Any desktop agent, Antigravity included, can read SKILL.md and follow it. This file holds the setup steps and the prompts to paste into Antigravity. The `npx skills add` install path is for Claude Code only; Antigravity skips it and works straight from this repo folder.

## Phone or desktop

Viewing a finished build runs anywhere: cutaway bundles everything into one self-contained HTML file that opens in any browser, phone included. Heavy films can lag on a phone, which the tarantula example already showed.

Building needs a desktop. The build step itself is light, but the film render drives headless Chromium and ffmpeg, which a phone cannot run.

Verdict: build on the laptop through Antigravity, view the output anywhere.

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

## Prompt 2: first fresh build (from your own picture)

Here is my reference picture: [drag the image into Antigravity, or give its file path]. Follow SKILL.md exactly. Rebuild it in three.js as a 3D object I can take apart. Write the checklist for it from the picture, build the still, then stop and show me the still. Do not film until I approve the still. After my approval, film it the way the piranha example is filmed, about 20 seconds, every part on its own camera, and give me the html. I will decide about the mp4 after I see it.

## How the loop works, so you know what to expect

One reference picture sets the look. The agent rebuilds it in three.js from code; it never imports the image. The agent writes a 10 to 12 line checklist from your picture and grades itself against it every round. It stops after round 2 with a still and waits for your yes; nothing is filmed before that. Your corrections go into docs/JOB_DESCRIPTION.md as numbers and measurements, not vibes. The film gives every part its own camera, rendered frame by frame to a 60 fps mp4 with synced procedural sound, and the final piece is one HTML file.

## Repo map

SKILL.md: the order of work and the rules. docs/: JOB_DESCRIPTION.md, CHECKLIST.md, PROMPTS.md, LESSONS.md (the whole method, readable with or without the code). sims/: three complete example objects (tarantula, piranha, wasp), each in object, film and 10-second forms, plus sims/green/ page shell and review tools. sims/capture.mjs: the frame-by-frame mp4 renderer. sfx/ and run_sfx.py: the sound engine. sims/build.mjs: bundles any object into one HTML file.

Upstream credits stay intact: whaleyxbt/claude-motion (MIT) for the runtime, capture and sound engine; Barty-Bart/motion-graphics (CC0 Freesound samples).
