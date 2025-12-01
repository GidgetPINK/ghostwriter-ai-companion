/* ------------------------------------------------------
   GLOBAL STATE
------------------------------------------------------ */
let currentTool = "developmental";
let activeCharacterIndex = 0;
let lastInputText = "";

// Tools that should trigger rewrite diff mode
const rewriteTools = [
    "developmental",
    "lineedit",
    "dialogue",
    "emotion",
    "sensory",
    "pacing",
    "voice",
    "grammar",
    "tense"
];

/* ------------------------------------------------------
   SIDEBAR OPEN / CLOSE
------------------------------------------------------ */
const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

document.getElementById("openSidebar").addEventListener("click", () => {
    sidebar.classList.add("open");
    sidebarBackdrop.classList.add("visible");
});

document.getElementById("closeSidebar").addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("visible");
});

sidebarBackdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("visible");
});

/* ------------------------------------------------------
   ADVANCED MODAL OPEN / CLOSE
------------------------------------------------------ */
const advancedModal = document.getElementById("advancedModal");
const modalBackdrop = document.getElementById("modalBackdrop");

document.getElementById("openAdvanced").addEventListener("click", () => {
    advancedModal.classList.add("open");
    modalBackdrop.classList.add("visible");
});

document.getElementById("closeModal").addEventListener("click", () => {
    advancedModal.classList.remove("open");
    modalBackdrop.classList.remove("visible");
});

modalBackdrop.addEventListener("click", () => {
    advancedModal.classList.remove("open");
    modalBackdrop.classList.remove("visible");
});

/* ------------------------------------------------------
   CHARACTER STORAGE HELPERS
------------------------------------------------------ */
function loadCharacters() {
    return JSON.parse(localStorage.getItem("characters")) || [];
}

function saveCharacters(chars) {
    localStorage.setItem("characters", JSON.stringify(chars));
}

function createEmptyCharacter() {
    return {
        name: "",
        voice: "",
        backstory: "",
        dob: "",
        zodiac: "",
        birthplace: "",
        ethnicity: "",
        religion: "",
        parents: "",
        siblings: "",
        bestfriends: "",
        residence: "",
        highschool: "",
        college: "",
        career: ""
    };
}

/* ------------------------------------------------------
   SIDEBAR CHARACTER LIST
------------------------------------------------------ */
function refreshCharacterList() {
    const chars = loadCharacters();
    const list = document.getElementById("characterList");
    list.innerHTML = "";

    chars.forEach((char, index) => {
        const li = document.createElement("li");
        li.textContent = char.name || `Character ${index + 1}`;
        li.dataset.index = index;

        if (index === activeCharacterIndex) {
            li.style.borderColor = "var(--accent)";
        }

        li.addEventListener("click", () => {
            activeCharacterIndex = index;
            loadCharacterIntoForm();
            refreshCharacterList();
        });

        li.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            if (confirm(`Delete "${char.name || "Unnamed Character"}"?`)) {
                deleteCharacter(index);
            }
        });

        list.appendChild(li);
    });
}

function deleteCharacter(index) {
    let chars = loadCharacters();
    chars.splice(index, 1);

    if (activeCharacterIndex >= chars.length) {
        activeCharacterIndex = chars.length - 1;
    }
    if (activeCharacterIndex < 0) activeCharacterIndex = 0;

    saveCharacters(chars);
    refreshCharacterList();
    loadCharacterIntoForm();
}

document.getElementById("addCharacterBtn").addEventListener("click", () => {
    let chars = loadCharacters();
    chars.push(createEmptyCharacter());
    activeCharacterIndex = chars.length - 1;
    saveCharacters(chars);
    refreshCharacterList();
    loadCharacterIntoForm();
});

/* ------------------------------------------------------
   LOAD CHARACTER INTO FORM
------------------------------------------------------ */
function loadCharacterIntoForm() {
    const chars = loadCharacters();
    const char = chars[activeCharacterIndex];
    if (!char) return;

    document.getElementById("char-name").value = char.name || "";
    document.getElementById("char-voice").value = char.voice || "";
    document.getElementById("char-backstory").value = char.backstory || "";

    document.getElementById("adv-dob").value = char.dob || "";
    document.getElementById("adv-zodiac").value = char.zodiac || "";
    document.getElementById("adv-birthplace").value = char.birthplace || "";
    document.getElementById("adv-ethnicity").value = char.ethnicity || "";
    document.getElementById("adv-religion").value = char.religion || "";
    document.getElementById("adv-parents").value = char.parents || "";
    document.getElementById("adv-siblings").value = char.siblings || "";
    document.getElementById("adv-bestfriends").value = char.bestfriends || "";
    document.getElementById("adv-residence").value = char.residence || "";
    document.getElementById("adv-highschool").value = char.highschool || "";
    document.getElementById("adv-college").value = char.college || "";
    document.getElementById("adv-career").value = char.career || "";
}

/* ------------------------------------------------------
   SAVE MAIN CHARACTER FIELDS
------------------------------------------------------ */
function saveMainCharacterFields() {
    const chars = loadCharacters();
    const char = chars[activeCharacterIndex];

    char.name = document.getElementById("char-name").value.trim();
    char.voice = document.getElementById("char-voice").value.trim();
    char.backstory = document.getElementById("char-backstory").value.trim();

    saveCharacters(chars);
    refreshCharacterList();
}

document.getElementById("char-name").addEventListener("input", saveMainCharacterFields);
document.getElementById("char-voice").addEventListener("input", saveMainCharacterFields);
document.getElementById("char-backstory").addEventListener("input", saveMainCharacterFields);

/* ------------------------------------------------------
   SAVE ADVANCED META FIELDS
------------------------------------------------------ */
document.getElementById("saveAdvanced").addEventListener("click", () => {
    const chars = loadCharacters();
    const char = chars[activeCharacterIndex];

    char.dob = document.getElementById("adv-dob").value.trim();
    char.zodiac = document.getElementById("adv-zodiac").value.trim();
    char.birthplace = document.getElementById("adv-birthplace").value.trim();
    char.ethnicity = document.getElementById("adv-ethnicity").value.trim();
    char.religion = document.getElementById("adv-religion").value.trim();
    char.parents = document.getElementById("adv-parents").value.trim();
    char.siblings = document.getElementById("adv-siblings").value.trim();
    char.bestfriends = document.getElementById("adv-bestfriends").value.trim();
    char.residence = document.getElementById("adv-residence").value.trim();
    char.highschool = document.getElementById("adv-highschool").value.trim();
    char.college = document.getElementById("adv-college").value.trim();
    char.career = document.getElementById("adv-career").value.trim();

    saveCharacters(chars);
    advancedModal.classList.remove("open");
    modalBackdrop.classList.remove("visible");
});

/* ------------------------------------------------------
   COLLAPSIBLE CHARACTER PANEL
------------------------------------------------------ */
const charHeader = document.getElementById("characterPanelHeader");
const charContent = document.getElementById("characterPanelContent");
const charIcon = document.querySelector(".collapse-icon");

charHeader.addEventListener("click", () => {
    const open = charContent.classList.contains("open");

    if (open) {
        charContent.classList.remove("open");
        charIcon.classList.remove("rotated");
    } else {
        charContent.classList.add("open");
        charIcon.classList.add("rotated");
    }
});

/* ------------------------------------------------------
   TOOLBAR BUTTONS
------------------------------------------------------ */
document.querySelectorAll(".tool-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTool = btn.dataset.tool;
        console.log("Tool selected:", currentTool);
    });
});

/* ------------------------------------------------------
   STRIP HTML SAFELY
------------------------------------------------------ */
function stripHTML(text) {
    return text
        .replace(/<\/?[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

/* ------------------------------------------------------
   PROMPT GENERATOR (DEV EDIT FIRST-CLASS)
------------------------------------------------------ */
function buildPrompt(tool, inputText) {
    const chars = loadCharacters();
    const char = chars[activeCharacterIndex] || {};

    const basic = {
        name: char.name || "The character",
        voice: char.voice || "No voice notes provided.",
        backstory: char.backstory || "No backstory provided."
    };

    let metadata = "";
    const fields = {
        "DOB": char.dob,
        "Zodiac": char.zodiac,
        "Birthplace": char.birthplace,
        "Ethnicity": char.ethnicity,
        "Religion": char.religion,
        "Parents": char.parents,
        "Siblings": char.siblings,
        "Best Friends": char.bestfriends,
        "Residence": char.residence,
        "High School": char.highschool,
        "College": char.college,
        "Career": char.career
    };

    Object.entries(fields).forEach(([label, value]) => {
        if (value && value.trim() !== "") {
            metadata += `- ${label}: ${value}\n`;
        }
    });

    const characterSection = `
CHARACTER PROFILE:
Name: ${basic.name}
Voice Style: ${basic.voice}
Backstory: ${basic.backstory}

ADVANCED CHARACTER METADATA:
${metadata || "(No advanced metadata provided)"} 

Use this character's authentic voice and internal psychology in all rewrites.
    `;

    switch (tool) {

        case "developmental":
            return `
${characterSection}

You are performing a DEVELOPMENTAL EDIT on a romance scene.

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

OUTPUT FORMAT (use these headings exactly, in all caps, one per section):

DETAILED ASSESSMENT:
[Write 2–4 paragraphs of high-level analysis about structure, character motivation, emotional stakes, pacing, POV, and scene purpose.]

ISSUES:
[- Use dash-led bullet-style lines to describe specific problems or weak spots.]

RECOMMENDATIONS:
[- Use dash-led bullet-style lines with specific, actionable craft suggestions.]

REWRITTEN SCENE:
[Rewrite the entire passage in a polished, emotionally resonant form, preserving plot but improving voice, tension, and clarity.]

Now perform the edit in this exact structure.

TEXT:
${inputText}
            `;

        case "lineedit":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Perform a LINE EDIT on the passage.

Your task:
- improve sentence structure
- tighten phrasing
- enhance clarity
- eliminate redundancy
- refine word choice
- strengthen rhythm
- maintain original meaning & tone
- preserve the author's voice
- do NOT add new story events

Deliver:
1. One-paragraph explanation  
2. A fully line-edited version  

TEXT:
${inputText}
            `;

        case "grammar":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Perform a PROFESSIONAL-GRADE grammar and punctuation correction.

Fix:
- grammar errors
- comma misuse
- punctuation issues
- dialogue punctuation
- run-ons and fragments (only when incorrect)
- capitalization
- spacing & formatting issues

Maintain:
- the author's voice
- tone
- character personality
- narrative vibe

Deliver:
1. Bullet list of major corrections  
2. A corrected version of the passage  

TEXT:
${inputText}
            `;

        case "dialogue":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Perform a DIALOGUE EDIT.

Focus on:
- natural conversational flow
- emotional subtext
- pacing between lines
- character-specific voice
- reactions and beats
- eliminating on-the-nose dialogue

Deliver:
1. Dialogue issues (bullet list)  
2. A rewritten, improved version  

TEXT:
${inputText}
            `;

        case "emotion":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Enhance the EMOTIONAL DEPTH.

Your job:
- identify weak emotional beats
- strengthen internal conflict
- show emotion through action, tone, and body language
- maintain believability
- avoid melodrama

Deliver:
1. Emotional analysis  
2. Opportunities to deepen emotion  
3. A revised version  

TEXT:
${inputText}
            `;

        case "sensory":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Enhance SENSORY DETAIL.

Focus on:
- sight, sound, touch, scent, atmosphere
- subtle, grounded sensory cues
- descriptions that support tone & emotion
- avoid over-writing

Deliver:
1. Sensory opportunities  
2. A tastefully enhanced rewrite  

TEXT:
${inputText}
            `;

        case "pacing":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Analyze PACING.

Assess:
- slow or dragging sections
- rushed emotional beats
- uneven rhythm
- transitions between beats
- balance of action vs reflection

Deliver:
1. Pacing diagnosis  
2. What slows the scene  
3. What feels rushed  
4. A tightened rewrite  

TEXT:
${inputText}
            `;

        case "summary":
            return `
${characterSection}

Summarize the passage in 3–5 strong bullet points.

Include:
- core emotional beats
- relationship dynamics
- key actions
- stakes or conflict

TEXT:
${inputText}
            `;

        case "voice":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Rewrite the passage in the character's authentic voice.

Goals:
- deepen interiority
- enhance emotional clarity
- sharpen personality-based narration
- strengthen tone consistency
- maintain plot accuracy

TEXT:
${inputText}
            `;

        case "tense":
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Step 1: Analyze the passage for tense consistency.
Step 2: Assume the story should be in PAST TENSE.
Step 3: Rewrite the passage so that:
- all narration is in past tense
- verbs and auxiliary verbs are corrected
- timeline remains consistent
- voice, tone, and emotional beats are preserved

Deliver:
1. Brief explanation of original tense issues
2. Rewritten, tense-corrected version

TEXT:
${inputText}
            `;

        default:
            return `
${characterSection}

DO NOT use HTML, XML, or Markdown formatting. Use plain text only.
Separate paragraphs with TWO line breaks.

Rewrite this text with the selected tool.

TEXT:
${inputText}
            `;
    }
}

/* ------------------------------------------------------
   FORMAT AI OUTPUT — BOLD SECTION TITLES, PARAGRAPHS
------------------------------------------------------ */
function formatAIOutput(text) {
    if (!text) return "";

    let html = text
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // HEADINGS like "DETAILED ASSESSMENT:"
    html = html.replace(
        /^([A-Z][A-Z ]+):$/gm,
        "<h3><strong>$1</strong></h3>"
    );

    // bullet points: "- something"
    html = html.replace(/^- (.*)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    // numbered list: "1. something"
    html = html.replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ol>$1</ol>");

    // paragraph breaks based on blank lines
    html = html.replace(/\n{2,}/g, "</p><p>");

    // single line breaks → soft breaks
    html = html.replace(/\n/g, "<br>");

    html = `<p>${html}</p>`;
    return html;
}

/* ------------------------------------------------------
   EXTRACT REWRITTEN SCENE FOR DEV EDIT
------------------------------------------------------ */
function extractDevEditRewrite(fullText) {
    // Look for "REWRITTEN SCENE:" marker
    const marker = "REWRITTEN SCENE:";
    const altMarker = "REWRITTEN VERSION:";

    let idx = fullText.indexOf(marker);
    let offset = marker.length;

    if (idx === -1) {
        idx = fullText.indexOf(altMarker);
        offset = altMarker.length;
    }

    if (idx === -1) {
        // Fallback: if we can't find it, just return the whole thing
        return fullText;
    }

    return fullText.slice(idx + offset).trim();
}

/* ------------------------------------------------------
   RUN AI — CALL BACKEND
------------------------------------------------------ */
document.getElementById("runButton").addEventListener("click", runAI);

async function runAI() {
    console.log("Run AI clicked with tool:", currentTool);

    const input = document.getElementById("input-text").value.trim();
    lastInputText = input;

    const outputBox = document.getElementById("output-box");
    const diffBox = document.getElementById("diff-output");
    const toggleDiffBtn = document.getElementById("toggle-diff");

    if (!input) {
        outputBox.textContent = "Please enter text first.";
        return;
    }

    outputBox.style.display = "block";
    diffBox.style.display = "none";
    toggleDiffBtn.style.display = "none";

    outputBox.classList.add("loading");
    outputBox.textContent = "Analyzing...";

    const prompt = buildPrompt(currentTool, input);

    try {
        const response = await fetch("http://localhost:3001/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional romance editor. Never output HTML, XML, or Markdown. Use plain text only. Separate paragraphs with TWO line breaks."
                    },
                    { role: "user", content: prompt }
                ]
            })
        });

        const data = await response.json();
        const rawOutput = data.output || "";
        const cleanText = stripHTML(rawOutput);

        console.log("AI raw output:", cleanText);

        outputBox.classList.remove("loading");

        // Always populate clean view with formatted full report
        outputBox.innerHTML = formatAIOutput(cleanText);

        // For non-rewrite tools (like Summary), we're done
        if (!rewriteTools.includes(currentTool)) {
            diffBox.style.display = "none";
            toggleDiffBtn.style.display = "none";
            return;
        }

        // For Dev Edit, diff should compare original vs REWRITTEN SCENE only
        let rewriteForDiff = cleanText;
        if (currentTool === "developmental") {
            rewriteForDiff = extractDevEditRewrite(cleanText);
        }

        // Show diff view and enable toggle
        showDiff(lastInputText, rewriteForDiff);
        diffBox.style.display = "block";
        outputBox.style.display = "none";
        toggleDiffBtn.style.display = "block";
        toggleDiffBtn.textContent = "Show Clean Output";

    } catch (err) {
        console.error("Frontend Error:", err);
        outputBox.classList.remove("loading");
        outputBox.textContent = "Error contacting AI server.";
    }
}

/* ------------------------------------------------------
   DIFF MODE
------------------------------------------------------ */
function showDiff(oldText, newText) {
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(oldText, newText);
    dmp.diff_cleanupSemantic(diffs);

    const diffBox = document.getElementById("diff-output");

    const html = diffs
        .map(([op, part]) => {
            const safe = part
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>");

            if (op === 0) return `<span>${safe}</span>`;
            if (op === -1) return `<del style="background: rgba(255,150,150,0.35);">${safe}</del>`;
            if (op === 1) return `<ins style="background: rgba(150,255,150,0.35);">${safe}</ins>`;
        })
        .join("");

    diffBox.innerHTML = html;
    diffBox.style.display = "block";
}

/* ------------------------------------------------------
   TOGGLE CLEAN / DIFF VIEW
------------------------------------------------------ */
document.getElementById("toggle-diff").addEventListener("click", () => {
    const diff = document.getElementById("diff-output");
    const clean = document.getElementById("output-box");
    const btn = document.getElementById("toggle-diff");

    if (diff.style.display === "none") {
        diff.style.display = "block";
        clean.style.display = "none";
        btn.textContent = "Show Clean Output";
    } else {
        diff.style.display = "none";
        clean.style.display = "block";
        btn.textContent = "Show Diff";
    }
});

/* ------------------------------------------------------
   INIT
------------------------------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
    refreshCharacterList();
    loadCharacterIntoForm();
    charContent.classList.add("open");
    charIcon.classList.add("rotated");
});
