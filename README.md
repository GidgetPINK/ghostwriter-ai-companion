# Ghostwriter – AI Romance Writing Companion

Ghostwriter is an AI-powered writing companion for romance authors. It helps with developmental edits, line edits, grammar, dialogue, pacing, and character voice while letting you define rich character profiles and see diffs between your original text and AI rewrites.

Features:

Dev Edit (detailed report + rewrite)

Line Edit, Grammar, Dialogue, Emotion, Sensory, Pacing, Voice, Tense Check

Character profiles with advanced metadata

Rewrite diff mode

Tech Stack:

HTML, CSS, vanilla JS

Node.js, Express

Groq API (LLaMA model)

How it works:

Frontend builds prompts based on selected tool + character profile

Backend proxy talks to Groq using API key

Diff mode uses diff_match_patch to show changes

Run locally:

cd backend && npm install && npm run dev (or whatever your script is)

cd frontend and open with Live Server / simple static server
 
