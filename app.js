(() => {
  "use strict";

  const routeMeta = [
    { id: "overview", title: "Overview", summary: "Chapter map, core heart-failure model, connected study routes, and quick tools.", keywords: "heart failure syndrome filling pressure cardiac output chapter map" },
    { id: "foundations", title: "Foundations", summary: "Definition, ejection-fraction phenotypes, NYHA class, ACC/AHA stages, and clinical labels.", keywords: "HFrEF HFmrEF HFpEF HFimpEF NYHA stage A B C D" },
    { id: "mechanisms", title: "Causes & mechanisms", summary: "Etiologies, high-output states, neurohormonal compensation, remodeling, and precipitants.", keywords: "RAAS sympathetic vasopressin remodeling anemia thyrotoxicosis ischemia" },
    { id: "clinical", title: "Clinical assessment", summary: "Left- and right-sided failure, congestion, hypoperfusion, bedside examination, and Framingham criteria.", keywords: "dyspnea orthopnea PND JVP edema crackles S3 Framingham" },
    { id: "diagnosis", title: "Diagnosis", summary: "Diagnostic sequence, core tests, echocardiography, natriuretic peptides, and differential diagnosis.", keywords: "ECG chest xray echo BNP NT-proBNP troponin MRI differential" },
    { id: "chronic", title: "Chronic management", summary: "Self-care, four foundational HFrEF therapies, selected add-ons, devices, and HFpEF care.", keywords: "ARNI ACE ARB beta blocker MRA SGLT2 diuretics ICD CRT HFpEF" },
    { id: "pharmacology", title: "Focused pharmacology", summary: "Diuretic classes, digoxin, beta-blockers, ARNI, MRA, SGLT2 inhibitors, and safety checks.", keywords: "furosemide metolazone spironolactone digoxin toxicity beta blocker" },
    { id: "acute", title: "Acute heart failure", summary: "Acute presentations, warm/cold and wet/dry profiles, urgent assessment, stabilization, and shock.", keywords: "pulmonary edema cardiogenic shock warm wet cold dry norepinephrine NIV" },
    { id: "advanced", title: "Advanced HF", summary: "Refractory reassessment, mechanical support, transplantation, devices, and palliative integration.", keywords: "LVAD transplant mechanical circulatory support palliative advanced refractory" },
    { id: "revision", title: "Revision lab", summary: "High-yield comparisons, examination traps, management memory aids, and flip cards.", keywords: "HFrEF versus HFpEF left right congestion hypoperfusion traps" },
    { id: "cases", title: "Clinical cases", summary: "Twelve case-based questions with immediate explanations and a saved best score.", keywords: "quiz cases exam MCQ clinical reasoning" },
    { id: "sources", title: "Sources & notes", summary: "Uploaded chapter, guideline references, educational scope, and text-to-speech behavior.", keywords: "references PDF ESC AHA ACC HFSA TTS Google UK English Female" }
  ];

  const routeIds = routeMeta.map(item => item.id);
  const contentRoot = document.getElementById("app-content");
  const currentLabel = document.getElementById("current-section-label");
  const nav = document.getElementById("course-nav");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");
  const menuButton = document.getElementById("menu-button");
  const closeButton = document.getElementById("sidebar-close");
  const searchInput = document.getElementById("site-search");
  const searchResults = document.getElementById("search-results");
  const progressLabel = document.getElementById("progress-label");
  const progressBar = document.getElementById("progress-bar");
  const toast = document.getElementById("toast");
  const voiceStatus = document.getElementById("voice-status");
  const voicePill = document.getElementById("voice-pill");
  const speechRate = document.getElementById("speech-rate");

  const escapeHtml = value => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const hero = ({ eyebrow, title, intro, chips = [], actions = [] }) => `
    <header class="page-hero tts-unit" data-tts-label="${escapeHtml(title)}">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${title}</h1>
      <p>${intro}</p>
      ${actions.length ? `<div class="hero-actions" data-no-speak>${actions.map(action => `<button class="button ${action.className || ""}" data-route="${action.route}" type="button">${action.label}</button>`).join("")}</div>` : ""}
      ${chips.length ? `<div class="hero-meta">${chips.map(chip => `<span class="meta-chip">${chip}</span>`).join("")}</div>` : ""}
    </header>`;

  const sectionHeader = (kicker, title, intro = "") => `
    <div class="section-header tts-unit" data-tts-label="${escapeHtml(title)}">
      <div>
        <div class="section-kicker">${kicker}</div>
        <h2>${title}</h2>
        ${intro ? `<p>${intro}</p>` : ""}
      </div>
    </div>`;

  const table = (headers, rows, ariaLabel = "Clinical comparison table", ttsLabel = ariaLabel) => `
    <div class="data-table-wrap tts-unit" role="region" tabindex="0" aria-label="${escapeHtml(ariaLabel)}" data-tts-label="${escapeHtml(ttsLabel)}">
      <table>
        <thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;

  const tabSet = (id, tabs) => `
    <div class="tab-set" data-tab-group="${id}">
      <div class="tab-list" role="tablist" aria-label="Topic views" data-no-speak>
        ${tabs.map((tab, index) => `<button class="tab-button" id="${id}-tab-${index}" role="tab" aria-selected="${index === 0}" aria-controls="${id}-panel-${index}" tabindex="${index === 0 ? 0 : -1}" type="button">${tab.label}</button>`).join("")}
      </div>
      ${tabs.map((tab, index) => `<section class="tab-panel" id="${id}-panel-${index}" role="tabpanel" aria-labelledby="${id}-tab-${index}" ${index === 0 ? "" : "hidden"}>${tab.content}</section>`).join("")}
    </div>`;

  const ttsCard = (title, body, className = "card", icon = "") => `
    <article class="${className} tts-unit" data-tts-label="${escapeHtml(title)}">
      ${icon ? `<div class="concept-icon" aria-hidden="true">${icon}</div>` : ""}
      <h3>${title}</h3>
      ${body}
    </article>`;

  const heartDiagram = () => `
    <div class="heart-visual tts-unit" data-tts-label="How heart failure produces congestion and low output">
      <svg viewBox="0 0 680 360" role="img" aria-labelledby="hf-heart-title hf-heart-desc">
        <title id="hf-heart-title">Simplified heart failure mechanism diagram</title>
        <desc id="hf-heart-desc">A central heart connects to pulmonary congestion on the left, systemic venous congestion on the right, and reduced forward perfusion below.</desc>
        <defs>
          <linearGradient id="hfRed" x1="0" x2="1"><stop offset="0" stop-color="#f7d7da"/><stop offset="1" stop-color="#eaa4aa"/></linearGradient>
          <linearGradient id="hfBlue" x1="0" x2="1"><stop offset="0" stop-color="#dceef6"/><stop offset="1" stop-color="#9fd0e3"/></linearGradient>
          <filter id="hfShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#0d2742" flood-opacity=".13"/></filter>
        </defs>
        <path d="M336 278C257 234 196 184 197 120c1-66 79-95 139-30 60-65 138-36 139 30 1 64-60 114-139 158Z" fill="white" stroke="#98aebd" stroke-width="3" filter="url(#hfShadow)"/>
        <path d="M336 276c-62-38-105-77-111-122-7-49 43-72 84-30 16 16 24 37 27 62Z" fill="url(#hfBlue)"/>
        <path d="M336 276c62-38 105-77 111-122 7-49-43-72-84-30-16 16-24 37-27 62Z" fill="url(#hfRed)"/>
        <path d="M336 92v184" stroke="#8298a8" stroke-width="4"/>
        <path d="M224 140C160 121 113 91 83 58" fill="none" stroke="#1e79ad" stroke-width="8" stroke-linecap="round"/>
        <path d="M448 143c64-19 112-48 144-83" fill="none" stroke="#c6535b" stroke-width="8" stroke-linecap="round"/>
        <path d="M335 278v52" stroke="#6552a2" stroke-width="8" stroke-linecap="round"/>
        <circle cx="70" cy="50" r="33" fill="#e7f3f9" stroke="#1e79ad" stroke-width="2"/>
        <path d="M53 49c7-12 27-12 34 0M53 59c7-8 27-8 34 0" fill="none" stroke="#1e79ad" stroke-width="3" stroke-linecap="round"/>
        <circle cx="607" cy="51" r="33" fill="#fcebed" stroke="#c6535b" stroke-width="2"/>
        <path d="M594 37v28M607 33v36M620 39v25" stroke="#c6535b" stroke-width="3" stroke-linecap="round"/>
        <circle cx="336" cy="331" r="25" fill="#f0edfb" stroke="#6552a2" stroke-width="2"/>
        <path d="M326 331h20M336 321v20" stroke="#6552a2" stroke-width="3" stroke-linecap="round"/>
        <text x="27" y="103" class="anatomy-label">Pulmonary congestion</text>
        <text x="27" y="122" class="anatomy-small">Dyspnea · orthopnea · crackles</text>
        <text x="488" y="103" class="anatomy-label">Systemic venous congestion</text>
        <text x="488" y="122" class="anatomy-small">Raised JVP · edema · ascites</text>
        <text x="365" y="334" class="anatomy-label">Reduced forward perfusion</text>
        <text x="365" y="352" class="anatomy-small">Fatigue · cool limbs · oliguria</text>
        <text x="276" y="178" class="anatomy-label">Pressure / volume stress</text>
        <text x="278" y="197" class="anatomy-small">Remodeling and dysfunction</text>
      </svg>
    </div>`;

  function overviewPage() {
    const routes = routeMeta.slice(1, 9).map((item, index) => `
      <button class="card concept-card interactive route-card" data-route="${item.id}" type="button" style="text-align:left;cursor:pointer">
        <div class="concept-icon">${String(index + 2).padStart(2, "0")}</div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <span class="route-arrow">Open module →</span>
      </button>`).join("");

    return `
      ${hero({
        eyebrow: "Cardiology · Chapter 2",
        title: "Heart Failure, learned as a connected clinical system",
        intro: "Move from definition and mechanism to bedside pattern, diagnostic confirmation, long-term disease modification, acute stabilization, and advanced care. Every compact learning block has its own UK female text-to-speech button.",
        chips: ["12 interconnected modules", "Google UK female TTS", "Interactive bedside tools", "Case-based revision"],
        actions: [
          { route: "foundations", label: "Start the core lesson" },
          { route: "acute", label: "Open acute HF lab", className: "ghost" }
        ]
      })}

      <section class="content-grid four" aria-label="Chapter highlights">
        ${ttsCard("A syndrome, not one disease", `<p>Heart failure means a structural or functional cardiac problem causes raised intracardiac pressures and/or inadequate cardiac output, producing symptoms or signs plus objective evidence of dysfunction.</p>`, "card stat-card", "HF")}
        ${ttsCard("Four EF phenotypes", `<p>HFrEF, HFmrEF, HFpEF, and HFimpEF organize therapy and prognosis, but ejection fraction alone never establishes the clinical diagnosis.</p>`, "card stat-card", "4")}
        ${ttsCard("Four bedside profiles", `<p>Warm-dry, warm-wet, cold-dry, and cold-wet combine perfusion with congestion and guide priorities in acute heart failure.</p>`, "card stat-card", "2×2")}
        ${ttsCard("Four HFrEF pillars", `<p>RAAS/ARNI therapy, an evidence-based beta-blocker, an MRA, and an SGLT2 inhibitor should generally be introduced early when tolerated.</p>`, "card stat-card", "4")}
      </section>

      ${sectionHeader("Core mental model", "Two final pathways explain most findings", "Backward pressure produces congestion; inadequate forward flow produces hypoperfusion. Both may coexist, and the dominant pattern changes management.")}
      <section class="hero-visual-grid">
        ${heartDiagram()}
        <aside class="card sticky-card tts-unit" data-tts-label="How to reason through heart failure">
          <h3>Use the same sequence every time</h3>
          <ol class="number-list">
            <li><strong>Confirm the syndrome:</strong> symptoms or signs plus objective cardiac dysfunction.</li>
            <li><strong>Classify:</strong> EF phenotype, stage, NYHA class, side, course, and perfusion/congestion profile.</li>
            <li><strong>Find the cause:</strong> ischemia, pressure/volume overload, rhythm, myocardium, valves, pericardium, or high-output stress.</li>
            <li><strong>Separate wet from cold:</strong> congestion needs decongestion; hypoperfusion demands urgent assessment for low output or shock.</li>
            <li><strong>Treat beyond symptoms:</strong> add disease-modifying therapy and address devices, cause, comorbidities, and follow-up.</li>
          </ol>
        </aside>
      </section>

      ${sectionHeader("Quick classifier", "Place an ejection fraction in context", "Enter the current LVEF and whether the patient previously had LVEF at or below 40%. The result is an educational phenotype label, not a diagnosis.")}
      <section class="card interactive-only tts-unit" data-tts-label="Ejection fraction classifier">
        <div class="inline-form" data-no-speak>
          <label class="form-field"><span>Current LVEF (%)</span><input id="overview-ef" type="number" min="5" max="80" value="35"></label>
          <label class="form-field"><span>Previous LVEF ≤ 40%?</span><select id="overview-previous"><option value="no">No / unknown</option><option value="yes">Yes</option></select></label>
          <button class="button" id="overview-ef-button" type="button">Classify</button>
        </div>
        <div class="output-panel classification-result" id="overview-ef-output" aria-live="polite"><strong>HFrEF</strong><span>LVEF 40% or lower; systolic dysfunction is prominent.</span></div>
      </section>

      ${sectionHeader("Chapter map", "Choose a route through the material", "Each module links forward and backward, and the navigation remembers what you have visited on this device.")}
      <section class="content-grid three">${routes}</section>

      <div class="callout warning section-block tts-unit" data-tts-label="High-yield warning"><strong>High-yield rule:</strong> preserved ejection fraction does not mean normal cardiac function. HFpEF can produce major symptoms because filling is impaired and filling pressures rise.</div>
    `;
  }

  function foundationsPage() {
    const efTable = table(
      ["Phenotype", "LVEF", "Interpretation"],
      [
        ["<strong>HFrEF</strong>", "≤ 40%", "Reduced EF; systolic dysfunction is prominent."],
        ["<strong>HFmrEF</strong>", "41–49%", "Mildly reduced EF; often resembles HFrEF biologically and therapeutically."],
        ["<strong>HFpEF</strong>", "≥ 50%", "Preserved EF; evidence of raised filling pressure or structural/functional abnormality is important."],
        ["<strong>HFimpEF</strong>", "Previous EF ≤ 40%, later > 40%", "Improved EF; disease-modifying therapy is generally continued because relapse can occur."]
      ],
      "Classification by left ventricular ejection fraction",
      "Heart failure phenotypes by ejection fraction"
    );

    return `
      ${hero({
        eyebrow: "Module 02 · Foundations",
        title: "Define and classify the syndrome before choosing treatment",
        intro: "Heart failure is diagnosed clinically and objectively. EF phenotype is essential, but it sits beside functional class, disease stage, clinical course, side, output, and perfusion profile.",
        chips: ["Symptoms/signs + objective evidence", "EF is not the diagnosis", "NYHA can change", "Stage does not reverse"]
      })}

      ${sectionHeader("Definition", "What heart failure actually means")}
      <section class="content-grid two">
        ${ttsCard("Clinical syndrome", `<p>A cardiac abnormality prevents the heart from meeting metabolic needs without abnormally high filling pressures. The problem may involve contraction, filling, valves, rhythm, the pericardium, or several mechanisms together.</p><div class="callout teal"><strong>Core equation:</strong> compatible symptoms or signs + objective cardiac dysfunction = supported HF diagnosis.</div>`, "card concept-card teal", "≠")}
        ${ttsCard("Do not diagnose from EF alone", `<p>A reduced EF supports systolic dysfunction but does not replace the clinical syndrome. A normal EF does not exclude heart failure because filling pressure and diastolic reserve may be abnormal.</p><div class="callout warning"><strong>Exam trap:</strong> “EF 55%” does not automatically mean the patient has no HF.</div>`, "card concept-card amber", "EF")}
      </section>

      ${sectionHeader("Ejection-fraction phenotypes", "Four categories, different emphases")}
      ${efTable}

      <section class="card section-block interactive-only tts-unit" data-tts-label="Interactive ejection fraction phenotype tool">
        <h3>Interactive phenotype tool</h3>
        <div class="form-grid" data-no-speak>
          <label class="form-field"><span>Current LVEF</span><div class="range-row"><input id="ef-range" type="range" min="10" max="75" value="45"><output id="ef-value">45%</output></div></label>
          <label class="form-field"><span>Previous LVEF ≤ 40%</span><select id="ef-previous"><option value="no">No or unknown</option><option value="yes">Yes</option></select></label>
        </div>
        <div class="ef-meter">
          <div class="ef-scale"><span></span><span></span><span></span><i class="ef-marker" id="ef-marker" style="left:53.8%"></i></div>
          <div class="ef-labels"><span>HFrEF ≤40</span><span>41–49</span><span>HFpEF ≥50</span></div>
        </div>
        <div class="output-panel classification-result" id="ef-result"><strong>HFmrEF</strong><span>LVEF 41–49%; assess the full syndrome and cause.</span></div>
      </section>

      ${sectionHeader("Other classifications", "Describe the patient from several useful axes")}
      ${table(
        ["Axis", "Categories", "Clinical use"],
        [
          ["Side", "Left-sided, right-sided, biventricular", "Predicts the dominant congestion pattern."],
          ["Course", "Acute, chronic, acute-on-chronic", "Guides urgency and stabilization."],
          ["Output", "Low-output, high-output", "Clarifies the hemodynamic mechanism."],
          ["Visibility", "Asymptomatic structural disease, symptomatic HF, advanced/refractory HF", "Aligns with staging and prognosis."],
          ["Perfusion/congestion", "Warm-dry, warm-wet, cold-dry, cold-wet", "Useful at the bedside in acute HF."]
        ],
        "Other useful heart failure classifications"
      )}

      ${sectionHeader("NYHA functional class", "Current symptom limitation")}
      ${table(
        ["Class", "Functional limitation"],
        [
          ["I", "No limitation of ordinary physical activity; ordinary activity does not cause symptoms."],
          ["II", "Slight limitation; comfortable at rest, but ordinary activity causes symptoms."],
          ["III", "Marked limitation; comfortable at rest, but less-than-ordinary activity causes symptoms."],
          ["IV", "Symptoms at rest or inability to perform any physical activity without discomfort."]
        ],
        "NYHA functional classes"
      )}

      <section class="card section-block interactive-only tts-unit" data-tts-label="NYHA practice classifier">
        <h3>NYHA practice classifier</h3>
        <label class="form-field" data-no-speak><span>Choose the best description</span><select id="nyha-select"><option value="1">Ordinary activity causes no symptoms</option><option value="2">Ordinary activity causes symptoms, but the patient is comfortable at rest</option><option value="3">Less-than-ordinary activity causes symptoms, but the patient is comfortable at rest</option><option value="4">Symptoms occur at rest or any physical activity causes discomfort</option></select></label>
        <div class="output-panel" id="nyha-output"><h3>NYHA I</h3><p>No limitation of ordinary physical activity.</p></div>
      </section>

      ${sectionHeader("ACC/AHA stages", "Disease progression rather than today's symptom burden")}
      <section class="content-grid four">
        ${ttsCard("Stage A · At risk", `<p>Risk factors for HF without symptoms, structural heart disease, or biomarker evidence of myocardial injury.</p>`, "card concept-card", "A")}
        ${ttsCard("Stage B · Pre-HF", `<p>No symptoms, but structural disease, abnormal filling pressures, or elevated cardiac biomarkers are present.</p>`, "card concept-card teal", "B")}
        ${ttsCard("Stage C · Symptomatic HF", `<p>Current or previous symptoms caused by structural heart disease.</p>`, "card concept-card amber", "C")}
        ${ttsCard("Stage D · Advanced HF", `<p>Severe symptoms despite optimized treatment, often requiring advanced therapy, palliative support, or transplant assessment.</p>`, "card concept-card red", "D")}
      </section>

      <div class="callout success section-block tts-unit" data-tts-label="NYHA class and ACC AHA stage are not interchangeable"><strong>NYHA and stage are not interchangeable:</strong> NYHA class can improve or worsen with symptoms. ACC/AHA stage represents progression; a patient with previous symptomatic structural HF remains Stage C even after symptoms improve.</div>
    `;
  }

  function mechanismsPage() {
    const causesTabs = tabSet("cause-tabs", [
      {
        label: "HFrEF causes",
        content: table(
          ["Mechanism", "Representative causes"],
          [
            ["Myocardial loss or injury", "Ischemic heart disease or MI, myocarditis, cardiotoxic drugs, infiltrative disease, genetic or idiopathic dilated cardiomyopathy."],
            ["Chronic pressure overload", "Systemic hypertension, aortic stenosis, coarctation of the aorta."],
            ["Chronic volume overload", "Mitral or aortic regurgitation, ventricular septal defect, patent ductus arteriosus."],
            ["Persistent tachycardia or rhythm disturbance", "AF with rapid ventricular response, incessant supraventricular tachycardia, frequent ventricular ectopy."],
            ["Right ventricular failure mechanisms", "Pulmonary hypertension, pulmonary embolism, chronic lung disease, right-sided valve disease, RV infarction."]
          ],
          "Common causes of HFrEF"
        )
      },
      {
        label: "HFpEF causes",
        content: `<article class="card tts-unit" data-tts-label="Common causes of HFpEF"><ul class="mini-list"><li>Long-standing hypertension with left ventricular hypertrophy.</li><li>Older age, obesity, diabetes, chronic kidney disease, and atrial fibrillation.</li><li>Aortic stenosis and other pressure-overload states.</li><li>Hypertrophic or restrictive cardiomyopathy, amyloidosis, and other infiltrative disorders.</li><li>Constrictive pericarditis or other constraints on ventricular filling.</li><li>Prior myocardial infarction with scar and impaired relaxation.</li></ul></article>`
      },
      {
        label: "High-output HF",
        content: table(
          ["Cause", "Why output demand rises"],
          [
            ["Severe anemia", "Reduced oxygen-carrying capacity drives increased cardiac output."],
            ["Thyrotoxicosis", "Increased metabolic demand, heart rate, and contractility."],
            ["Thiamine deficiency (wet beriberi)", "Peripheral vasodilation and impaired myocardial energy metabolism."],
            ["Large arteriovenous fistula", "A low-resistance shunt increases venous return and cardiac workload."],
            ["Advanced liver disease or severe obesity", "Reduced vascular resistance, expanded plasma volume, and increased metabolic demand."]
          ],
          "High-output heart failure causes"
        )
      }
    ]);

    return `
      ${hero({
        eyebrow: "Module 03 · Etiology and pathophysiology",
        title: "Compensation preserves circulation first, then drives progression",
        intro: "The failing circulation activates sympathetic, RAAS, and vasopressin pathways. These support pressure and output in the short term but increase afterload, fluid retention, fibrosis, arrhythmia risk, and remodeling over time.",
        chips: ["Cause determines phenotype", "Compensation has a cost", "Congestion is neurohormonal", "Search for precipitants"]
      })}

      ${sectionHeader("Etiology", "Match the mechanism to the phenotype")}
      ${causesTabs}

      ${sectionHeader("Mechanism chain", "Helpful first, harmful later")}
      <div class="flow-chain">
        <div class="flow-node tts-unit" data-tts-label="Reduced effective cardiac output">Reduced effective output</div>
        <div class="flow-node tts-unit" data-tts-label="Sympathetic activation">Sympathetic activation</div>
        <div class="flow-node tts-unit" data-tts-label="RAAS and vasopressin activation">RAAS + vasopressin activation</div>
        <div class="flow-node tts-unit" data-tts-label="Sodium and water retention">Sodium / water retention</div>
        <div class="flow-node tts-unit" data-tts-label="Congestion and remodeling">Congestion + remodeling</div>
      </div>

      ${table(
        ["Response", "Early benefit", "Long-term cost"],
        [
          ["Tachycardia and increased contractility", "Maintains cardiac output.", "Higher oxygen demand, arrhythmia risk, and shorter diastolic filling time."],
          ["Frank-Starling mechanism", "Greater fiber stretch can increase stroke volume.", "Excess dilatation raises wall stress and promotes functional mitral or tricuspid regurgitation."],
          ["Ventricular hypertrophy", "Normalizes wall stress during pressure overload.", "Stiffness, ischemia, fibrosis, and diastolic dysfunction."],
          ["Peripheral vasoconstriction", "Preserves perfusion of the brain and heart.", "Raises afterload and worsens limb, renal, and gut perfusion."],
          ["RAAS and vasopressin", "Supports blood pressure and circulating volume.", "Sodium retention, edema, fibrosis, and electrolyte disturbance."],
          ["Natriuretic peptides", "Promote natriuresis, vasodilation, and counter-regulation.", "Their effect is often insufficient to overcome persistent neurohormonal activation."]
        ],
        "Compensatory mechanisms in heart failure"
      )}

      ${sectionHeader("Interactive mechanism explorer", "Select a response to connect benefit with harm")}
      <section class="card interactive-only tts-unit" data-tts-label="Interactive compensation mechanism explorer">
        <div class="compare-controls" id="mechanism-buttons" data-no-speak>
          <button class="filter-button is-active" data-mechanism="sympathetic" type="button">Sympathetic</button>
          <button class="filter-button" data-mechanism="raas" type="button">RAAS / vasopressin</button>
          <button class="filter-button" data-mechanism="starling" type="button">Frank-Starling</button>
          <button class="filter-button" data-mechanism="hypertrophy" type="button">Hypertrophy</button>
          <button class="filter-button" data-mechanism="peptides" type="button">Natriuretic peptides</button>
        </div>
        <div class="comparison-band" id="mechanism-output">
          <div><h3>Immediate purpose</h3><p>Raise heart rate and contractility to preserve cardiac output.</p></div>
          <div><h3>Why it becomes harmful</h3><p>Increases oxygen demand, shortens filling time, and promotes arrhythmia and remodeling.</p></div>
        </div>
      </section>

      ${sectionHeader("Decompensation", "Find the trigger instead of treating congestion alone")}
      ${table(
        ["Category", "Examples"],
        [
          ["Ischemia or structural deterioration", "Acute coronary syndrome, acute valve regurgitation, mechanical complication of MI."],
          ["Rhythm", "Atrial fibrillation, sustained tachyarrhythmia, severe bradycardia, heart block."],
          ["Pressure or volume stress", "Uncontrolled hypertension, excessive salt or fluid intake, renal deterioration."],
          ["Infection and inflammation", "Pneumonia, sepsis, infective endocarditis."],
          ["Medication related", "Non-adherence, NSAIDs, corticosteroids, non-dihydropyridine calcium-channel blockers in HFrEF, cardiotoxic therapy."],
          ["Systemic stress", "Anemia, thyroid disease, pregnancy, pulmonary embolism, COPD exacerbation."]
        ],
        "Precipitating factors for heart failure decompensation"
      )}

      <div class="callout warning tts-unit" data-tts-label="Mechanism memory aid"><strong>Memory aid:</strong> when a stable patient becomes wet or cold, ask “Why now?” before assuming simple disease progression.</div>
    `;
  }

  function clinicalPage() {
    return `
      ${hero({
        eyebrow: "Module 04 · Clinical assessment",
        title: "Recognize patterns, not isolated signs",
        intro: "No single symptom or sign proves heart failure. The bedside diagnosis becomes stronger when dyspnea, orthopnea, JVP, edema, crackles, cardiac sounds, perfusion, and a plausible cause point in the same direction.",
        chips: ["Backward failure = congestion", "Forward failure = hypoperfusion", "Left and right may coexist", "Pattern recognition"]
      })}

      ${sectionHeader("Left-sided failure", "Pulmonary congestion and reduced systemic perfusion")}
      ${table(
        ["Dominant mechanism", "Manifestations"],
        [
          ["Pulmonary congestion · backward failure", "Exertional dyspnea, orthopnea, paroxysmal nocturnal dyspnea, cough, basal crackles, pulmonary edema, pleural effusion, occasionally hemoptysis."],
          ["Reduced systemic perfusion · forward failure", "Fatigue, weakness, dizziness, confusion, oliguria, cool extremities, narrow pulse pressure, weak pulse, exercise intolerance."],
          ["Cardiac findings", "Displaced or diffuse apex, tachycardia, S3 in volume-overloaded systolic HF, functional MR, pulsus alternans in advanced disease."]
        ],
        "Left-sided heart failure findings"
      )}

      ${sectionHeader("Right-sided failure", "Systemic venous congestion and RV findings")}
      ${table(
        ["Domain", "Manifestations"],
        [
          ["Systemic venous congestion", "Raised JVP, positive hepatojugular reflux, dependent edema, ascites, hepatomegaly, hepatic tenderness, early satiety, abdominal discomfort."],
          ["Low output", "Fatigue, cool peripheries, weak pulse, oliguria, confusion in severe cases."],
          ["Cardiac findings", "Parasternal heave, right-sided S3, functional TR, systolic murmur louder with inspiration."],
          ["Common cause", "Left-sided HF is the most common cause; pulmonary hypertension and primary RV disease are important alternatives."]
        ],
        "Right-sided heart failure findings"
      )}

      ${sectionHeader("Mechanism view", "Separate congestion from hypoperfusion")}
      <section class="content-grid three">
        ${ttsCard("Congestion", `<p><strong>Symptoms:</strong> dyspnea, orthopnea, nocturnal dyspnea, abdominal fullness, edema, weight gain.</p><p><strong>Signs:</strong> crackles, raised JVP, edema, hepatomegaly, ascites, pleural effusion.</p>`, "card concept-card teal", "Wet")}
        ${ttsCard("Hypoperfusion", `<p><strong>Symptoms:</strong> fatigue, dizziness, confusion, reduced urine output, exercise intolerance.</p><p><strong>Signs:</strong> cool clammy limbs, narrow pulse pressure, weak pulse, altered mentation, oliguria.</p>`, "card concept-card red", "Cold")}
        ${ttsCard("Neurohormonal activation", `<p><strong>Symptoms:</strong> palpitations, sweating, anxiety, thirst.</p><p><strong>Signs:</strong> tachycardia, vasoconstriction, pallor, diaphoresis.</p>`, "card concept-card amber", "SNS")}
      </section>

      ${sectionHeader("Bedside checklist", "Build a coherent examination")}
      <section class="content-grid two">
        <article class="card tts-unit" data-tts-label="Congestion examination checklist"><h3>Look for congestion</h3><ul class="checklist"><li>Respiratory effort, oxygenation, basal or diffuse crackles</li><li>JVP height and hepatojugular reflux</li><li>Peripheral edema, sacral edema, ascites</li><li>Hepatomegaly, tenderness, early satiety</li><li>Recent weight gain and reduced diuretic response</li></ul></article>
        <article class="card tts-unit" data-tts-label="Perfusion examination checklist"><h3>Look for hypoperfusion</h3><ul class="checklist"><li>Mental state and dizziness</li><li>Skin temperature, capillary refill, diaphoresis</li><li>Pulse volume and pulse pressure</li><li>Urine output and renal function trend</li><li>Blood pressure, rhythm, and signs of shock</li></ul></article>
      </section>

      ${sectionHeader("Framingham-style framework", "A classical support tool, not the modern endpoint")}
      <section class="card interactive-only tts-unit" data-tts-label="Framingham criteria calculator">
        <p>The classical framework supports HF when at least <strong>two major</strong>, or <strong>one major plus two minor</strong>, criteria are present. Modern diagnosis still depends heavily on echocardiography and natriuretic peptides.</p>
        <div class="form-grid" data-no-speak>
          <fieldset><legend><strong>Major criteria</strong></legend><div class="criteria-list" id="major-criteria">
            ${["PND or orthopnea", "Neck-vein distention", "Pulmonary rales", "Radiographic cardiomegaly", "Acute pulmonary edema", "S3 gallop", "Raised CVP or hepatojugular reflux", "Rapid weight loss with diuresis"].map((item, i) => `<label class="criteria-option"><input type="checkbox" value="${i}"><span>${item}</span></label>`).join("")}
          </div></fieldset>
          <fieldset><legend><strong>Minor criteria</strong></legend><div class="criteria-list" id="minor-criteria">
            ${["Bilateral ankle edema", "Nocturnal cough", "Dyspnea on ordinary exertion", "Hepatomegaly", "Pleural effusion", "Reduced vital capacity", "Tachycardia"].map((item, i) => `<label class="criteria-option"><input type="checkbox" value="${i}"><span>${item}</span></label>`).join("")}
          </div></fieldset>
        </div>
        <div class="output-panel" id="framingham-output"><h3>Not yet supported by the classical rule</h3><p>Selected: 0 major, 0 minor.</p></div>
      </section>

      <div class="callout teal tts-unit" data-tts-label="Clinical examination pattern recognition"><strong>Clinical examination is pattern recognition:</strong> integrate side, congestion, perfusion, rhythm, sounds, and likely cause. Avoid diagnosing or excluding HF from one sign.</div>
    `;
  }

  function diagnosisPage() {
    return `
      ${hero({
        eyebrow: "Module 05 · Diagnostic approach",
        title: "Confirm the syndrome, define the phenotype, and identify the cause",
        intro: "Start with compatible symptoms and urgency, use ECG and natriuretic peptides to refine probability, perform transthoracic echocardiography, then use targeted advanced testing when the cause or phenotype remains uncertain.",
        chips: ["Echo defines phenotype", "Low BNP can rule out", "Normal CXR does not exclude", "Troponin ≠ always type 1 MI"]
      })}

      ${sectionHeader("Practical sequence", "A five-step diagnostic pathway")}
      <div class="pathway">
        <article class="pathway-step tts-unit" data-tts-label="Step one confirm presentation and urgency"><span class="pathway-number">1</span><div><h3>Confirm compatibility and urgency</h3><p>Decide whether symptoms and signs fit HF, then look immediately for shock, respiratory failure, severe hypertension, or another time-critical state.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Step two find alternative diagnoses and precipitants"><span class="pathway-number">2</span><div><h3>Look for alternatives and precipitants</h3><p>Consider ACS, arrhythmia, infection, pulmonary embolism, anemia, renal failure, thyroid disease, valve failure, and medication-related deterioration.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Step three ECG and natriuretic peptide"><span class="pathway-number">3</span><div><h3>Use ECG and natriuretic peptides</h3><p>A completely normal ECG makes significant HF less likely; a low BNP or NT-proBNP argues against HF in many settings.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Step four transthoracic echocardiography"><span class="pathway-number">4</span><div><h3>Perform transthoracic echocardiography</h3><p>Assess LVEF, chamber size, wall motion, valves, RV function, pulmonary pressure, diastolic indices, and pericardium.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Step five targeted advanced testing"><span class="pathway-number">5</span><div><h3>Add targeted advanced testing</h3><p>Use coronary imaging, cardiac MRI, CT, stress testing, or invasive hemodynamics when the cause or phenotype remains uncertain.</p></div></article>
      </div>

      ${sectionHeader("Core investigations", "Know what each test contributes—and what it cannot do")}
      ${table(
        ["Test", "What it contributes", "Important limitation"],
        [
          ["ECG", "Rhythm, conduction, prior or acute infarction, hypertrophy, ischemia.", "Often abnormal but rarely diagnostic by itself."],
          ["Chest radiograph", "Cardiomegaly, vascular redistribution, interstitial or alveolar edema, pleural effusion, alternative lung disease.", "A normal film does not exclude chronic compensated HF."],
          ["Echocardiography", "LVEF, chamber size, diastolic indices, valves, RV function, pulmonary pressure, pericardial disease.", "Image quality and loading conditions affect interpretation."],
          ["BNP or NT-proBNP", "Supports diagnosis, risk stratification, and assessment of dyspnea.", "Higher with age, renal dysfunction, and AF; lower with obesity and sometimes very early disease."],
          ["Laboratory profile", "CBC, electrolytes, renal/liver function, glucose or HbA1c, lipids, TSH, iron studies when appropriate.", "Abnormality may be cause, consequence, or treatment effect."],
          ["Troponin", "Identifies myocardial injury and helps evaluate ACS.", "Can rise in acute HF without type 1 MI."],
          ["Cardiac MRI", "Tissue characterization, myocarditis, infiltrative disease, scar, cardiomyopathy phenotype.", "Availability, cost, devices, and renal function may limit use."],
          ["Coronary assessment", "Identifies ischemic etiology and revascularization targets.", "Choice depends on pre-test probability and stability."]
        ],
        "Core investigations in heart failure"
      )}

      ${sectionHeader("Echocardiographic measurements", "Interpret EF as one part of a larger study")}
      ${table(
        ["Parameter", "Formula or meaning", "Interpretation"],
        [
          ["Ejection fraction", "(End-diastolic volume − end-systolic volume) / end-diastolic volume × 100", "Proportion of LV volume ejected per beat; it does not directly measure total cardiac output."],
          ["Fractional shortening", "(LVEDD − LVESD) / LVEDD × 100", "Linear systolic shortening; less reliable with regional wall-motion abnormality or altered geometry."],
          ["Diastolic assessment", "Mitral inflow, tissue Doppler, LA volume, TR velocity, filling-pressure estimates", "No single parameter is sufficient; interpretation is integrated."],
          ["RV assessment", "TAPSE, S′, fractional area change, RV size and function", "Important for prognosis and RV-dominant disease."]
        ],
        "Echocardiographic measurements in heart failure"
      )}

      ${sectionHeader("Natriuretic peptides", "The number changes with context")}
      <section class="content-grid two">
        ${ttsCard("May increase BNP or NT-proBNP", `<ul class="mini-list"><li>Older age</li><li>Renal dysfunction</li><li>Atrial fibrillation</li><li>Pulmonary hypertension</li><li>Acute coronary syndromes</li><li>Severe valvular disease</li></ul>`, "card concept-card red", "↑")}
        ${ttsCard("May produce unexpectedly lower levels", `<ul class="mini-list"><li>Obesity</li><li>Very early presentation</li><li>Successful treatment and decongestion</li><li>Some flash pulmonary edema before biomarker rise</li></ul>`, "card concept-card teal", "↓")}
      </section>

      <section class="card section-block interactive-only tts-unit" data-tts-label="BNP context explorer">
        <h3>BNP context explorer</h3>
        <div class="form-grid" data-no-speak>
          <label class="form-field"><span>Clinical feature</span><select id="bnp-context"><option value="obesity">Obesity</option><option value="renal">Renal dysfunction</option><option value="af">Atrial fibrillation</option><option value="age">Older age</option><option value="treated">After successful decongestion</option><option value="early">Very early presentation</option></select></label>
          <label class="form-field"><span>Measured result</span><select id="bnp-result"><option value="low">Low</option><option value="high">High</option></select></label>
        </div>
        <div class="output-panel" id="bnp-output"><h3>Interpret cautiously</h3><p>Obesity can lower natriuretic peptide concentrations, so a low result may be less reassuring than usual when the clinical picture strongly suggests HF.</p></div>
      </section>

      ${sectionHeader("Differential diagnosis", "Common mimics by presentation")}
      ${table(
        ["Presentation", "Important alternatives"],
        [
          ["Dyspnea and orthopnea", "COPD or asthma, pneumonia, pulmonary embolism, obesity, anemia, deconditioning, pleural disease, anxiety, neuromuscular disease."],
          ["Peripheral edema and ascites", "Cirrhosis, nephrotic syndrome, chronic kidney disease, venous insufficiency, medications, malnutrition."],
          ["Raised JVP", "Pericardial constriction or tamponade, pulmonary hypertension, massive PE, right-sided valve disease."],
          ["Cardiomegaly", "Pericardial effusion, athletic remodeling, cardiomyopathy, significant valvular disease."]
        ],
        "Differential diagnosis of heart failure presentations"
      )}

      <div class="callout warning tts-unit" data-tts-label="Natriuretic peptide warning"><strong>Interpret the number in context:</strong> BNP or NT-proBNP is not a stand-alone diagnosis. Consider assay, setting, renal function, rhythm, body habitus, and local cutoffs.</div>
    `;
  }

  function chronicPage() {
    return `
      ${hero({
        eyebrow: "Module 06 · Chronic management",
        title: "Relieve congestion, modify disease, and treat the cause together",
        intro: "Modern HFrEF care is not a slow one-drug ladder. Introduce the four disease-modifying classes early at low doses when tolerated, while controlling congestion, correcting causes, supporting self-care, and assessing devices.",
        chips: ["Four pillars early", "Diuretics treat symptoms", "Monitor BP, kidney, K+", "HFpEF needs comorbidity care"]
      })}

      ${sectionHeader("Management goals", "What successful chronic care should achieve")}
      <section class="content-grid two">
        <article class="card tts-unit" data-tts-label="Heart failure management goals"><ul class="checklist"><li>Treat the cause and reversible precipitating factors.</li><li>Relieve congestion and improve functional capacity.</li><li>Reduce hospitalization and cardiovascular death.</li><li>Prevent remodeling, arrhythmia, thromboembolism, renal deterioration, and sudden death.</li><li>Support self-care, vaccination, rehabilitation, adherence, and palliative care when appropriate.</li></ul></article>
        <article class="card tts-unit" data-tts-label="Non pharmacological care"><h3>Non-pharmacological care</h3><ul class="mini-list"><li>Teach warning signs: worsening dyspnea, edema, rapid weight gain, dizziness, reduced urine output.</li><li>Encourage individualized exercise or cardiac rehabilitation when stable.</li><li>Avoid excessive sodium; use fluid restriction selectively, not universally.</li><li>Address obesity, cachexia, iron deficiency, alcohol excess, and malnutrition.</li><li>Use appropriate vaccination and review drugs such as NSAIDs that can worsen HF.</li></ul></article>
      </section>

      ${sectionHeader("Four foundational therapies", "Click each pillar to see benefit and monitoring")}
      <section class="pillar-grid interactive-only" id="pillar-grid">
        <article class="pillar-card is-active"><button data-pillar="arni" type="button"><span class="pillar-number">1</span><h3>ARNI / ACEi / ARB</h3><p>Suppress maladaptive RAAS signaling and remodeling.</p></button></article>
        <article class="pillar-card"><button data-pillar="beta" type="button"><span class="pillar-number">2</span><h3>Evidence-based beta-blocker</h3><p>Reduces mortality, sudden death, and hospitalization.</p></button></article>
        <article class="pillar-card"><button data-pillar="mra" type="button"><span class="pillar-number">3</span><h3>MRA</h3><p>Blocks aldosterone effects and reduces events.</p></button></article>
        <article class="pillar-card"><button data-pillar="sglt2" type="button"><span class="pillar-number">4</span><h3>SGLT2 inhibitor</h3><p>Reduces HF events with or without diabetes.</p></button></article>
      </section>
      <section class="card section-block tts-unit" id="pillar-output" data-tts-label="ARNI ACE inhibitor or ARB pillar details">
        <h3>ARNI, or ACE inhibitor / ARB when ARNI is unsuitable</h3>
        <div class="comparison-band"><div><h3>Main benefit</h3><p>Reduces death and HF hospitalization and limits maladaptive RAAS signaling and remodeling.</p></div><div><h3>Key cautions</h3><p>Monitor hypotension, renal function, and potassium. Do not combine ARNI with an ACE inhibitor; use an appropriate washout.</p></div></div>
      </section>

      ${sectionHeader("Selected additional therapy", "Add treatment for a clear indication")}
      ${table(
        ["Therapy", "When it may be considered"],
        [
          ["Loop diuretic", "Signs or symptoms of congestion; adjust to achieve and maintain euvolemia."],
          ["Hydralazine plus nitrate", "Unable to take RAAS-modifying therapy, or evidence-based add-on in selected populations with persistent symptoms."],
          ["Ivabradine", "Sinus rhythm with persistent elevated heart rate despite maximally tolerated beta-blocker when criteria are met."],
          ["Digoxin", "Persistent symptoms despite foundational therapy or selected AF rate control; reduces hospitalization more than mortality."],
          ["Intravenous iron", "Symptomatic HF with documented iron deficiency, particularly in reduced or mildly reduced EF when criteria are met."],
          ["Anticoagulation", "AF, VTE, mechanical valve, intracardiac thrombus, or another established indication—not routinely for HF alone."],
          ["Revascularization or valve intervention", "Ischemia or structural valve disease is a major driver and procedural criteria are met."]
        ],
        "Additional chronic heart failure therapies"
      )}

      ${sectionHeader("Symptom relief versus disease modification", "Do not confuse the two roles")}
      <section class="comparison-band">
        <div class="tts-unit" data-tts-label="Symptom relief in heart failure"><h3>Primarily symptom relief</h3><p>Diuretics reduce edema and pulmonary congestion. Nitrates may provide selected venodilator relief. Oxygen treats hypoxemia. Positive inotropes are short-term support for shock or severe hypoperfusion.</p></div>
        <div class="tts-unit" data-tts-label="Disease modification in HFrEF"><h3>Disease modification</h3><p>The four foundational classes reduce hospitalization and/or death. A patient can feel better after diuresis yet remain undertreated if disease-modifying therapy has not been optimized.</p></div>
      </section>

      ${sectionHeader("Devices and advanced options", "Escalate after optimized therapy and reassessment")}
      ${table(
        ["Option", "Purpose"],
        [
          ["ICD", "Prevention of sudden cardiac death in appropriately selected patients after optimized therapy and reassessment of EF."],
          ["CRT", "Improves synchrony, symptoms, and outcomes in selected patients with reduced EF, prolonged QRS, and appropriate conduction features."],
          ["Mechanical circulatory support", "Bridge to recovery, decision, transplantation, or destination therapy in advanced HF."],
          ["Heart transplantation", "Definitive option for carefully selected end-stage HF despite optimal treatment."],
          ["Palliative and supportive care", "Symptom control, goals-of-care discussions, and quality-of-life support alongside active HF therapy."]
        ],
        "Heart failure devices and advanced therapy"
      )}

      ${sectionHeader("HFmrEF and HFpEF", "Confirm the phenotype and treat what drives filling pressure")}
      ${table(
        ["Strategy", "Practical emphasis"],
        [
          ["SGLT2 inhibitor", "Strongly supported across mildly reduced and preserved EF to reduce HF events in suitable patients."],
          ["Diuretics", "Use for congestion; avoid excessive preload reduction."],
          ["Blood-pressure control", "Treat hypertension carefully and consistently."],
          ["MRA, ARB, or ARNI", "May be considered in selected patients, especially toward the lower EF range or with recurrent hospitalization."],
          ["Rhythm and rate management", "AF can significantly worsen filling and exercise tolerance."],
          ["Disease-specific therapy", "Treat amyloidosis, hypertrophic cardiomyopathy, constrictive pericarditis, significant valve disease, and other specific causes."]
        ],
        "Management of HFmrEF and HFpEF"
      )}
    `;
  }

  function pharmacologyPage() {
    return `
      ${hero({
        eyebrow: "Module 07 · Focused pharmacology",
        title: "Know what each drug is for, what to monitor, and when not to use it",
        intro: "Diuretics control volume, disease-modifying therapies change outcomes, digoxin has a selective role, and inotropes belong mainly to acute low-output states. Safety depends on clinical stability, renal function, electrolytes, blood pressure, and rhythm.",
        chips: ["Diuresis ≠ mortality therapy", "Digoxin effect ≠ toxicity", "Beta-blockers require stability", "Monitor kidney and potassium"]
      })}

      ${sectionHeader("Diuretics", "Choose the nephron site and monitor the cost")}
      ${table(
        ["Class", "Examples", "Site and role", "Key adverse effects"],
        [
          ["Loop", "Furosemide, bumetanide, torsemide", "Loop of Henle; most effective for significant congestion.", "Hypovolemia, renal dysfunction, hypokalemia, hyponatremia, hypomagnesemia, metabolic alkalosis, ototoxicity at high exposure."],
          ["Thiazide or thiazide-like", "Hydrochlorothiazide, metolazone, chlorthalidone", "Distal nephron; may be added for sequential nephron blockade in resistant edema.", "Hyponatremia, hypokalemia, hyperuricemia, hyperglycemia; thiazides reduce urinary calcium."],
          ["Potassium-sparing / MRA", "Spironolactone, eplerenone", "Weak diuresis but important neurohormonal benefit in HFrEF.", "Hyperkalemia, renal dysfunction; spironolactone can cause gynecomastia."]
        ],
        "Diuretic pharmacology in heart failure"
      )}
      <div class="callout warning tts-unit" data-tts-label="Diuretic resistance"><strong>Diuretic resistance:</strong> check adherence, perfusion, renal function, NSAID use, gut edema, and sodium intake. Strategies include IV loop dosing, increased frequency, or carefully monitored sequential nephron blockade.</div>

      ${sectionHeader("Digoxin", "Selective use, narrow safety margin")}
      <section class="content-grid two">
        ${ttsCard("Mechanism and potential use", `<p>Digoxin inhibits Na+/K+-ATPase, indirectly increasing intracellular calcium and contractility. It also increases vagal tone and slows AV nodal conduction.</p><ul class="mini-list"><li>Selected symptomatic HFrEF despite optimized therapy</li><li>Ventricular rate control in some patients with AF</li><li>More effect on hospitalization than mortality</li></ul>`, "card concept-card", "Dg")}
        ${ttsCard("Toxicity pattern", `<ul class="mini-list"><li><strong>Risk:</strong> renal dysfunction, older age, low body mass, low K+, low Mg2+, high Ca2+, hypothyroidism, interactions</li><li><strong>Non-cardiac:</strong> anorexia, nausea, vomiting, confusion, weakness, color disturbance</li><li><strong>Cardiac:</strong> many atrial or ventricular arrhythmias and AV block</li><li><strong>Severe toxicity:</strong> stop drug, correct electrolytes, manage rhythm, use digoxin-specific antibody fragments when indicated</li></ul>`, "card concept-card red", "!")}
      </section>
      <div class="callout danger tts-unit" data-tts-label="Digoxin effect is not digoxin toxicity"><strong>Important correction:</strong> PR prolongation, shortened QT, sagging ST depression, and T-wave changes can occur as the classic digoxin effect without toxicity. Toxicity is a clinical diagnosis supported by rhythm, kidney function, electrolytes, interactions, and serum concentration.</div>

      ${sectionHeader("Beta-blockers", "Negative inotropy now, survival benefit later")}
      <article class="card tts-unit" data-tts-label="Beta blockers in HFrEF"><p>Evidence-based beta-blockers improve survival and reverse remodeling when started in stable patients at low dose and titrated gradually.</p><ul class="checklist danger"><li>Do not start or aggressively increase during active shock or severe fluid overload.</li><li>Continue chronic therapy during many admissions unless hypotension, shock, severe bradycardia, or another clear contraindication is present.</li><li>Use outcome-proven agents such as carvedilol, bisoprolol, or metoprolol succinate rather than assuming a class effect.</li></ul></article>

      ${sectionHeader("ARNI, MRA, and SGLT2 inhibitors", "Mechanism and monitoring")}
      ${table(
        ["Class", "Mechanism summary", "Monitoring"],
        [
          ["ARNI", "Neprilysin inhibition increases beneficial natriuretic peptide signaling; ARB component blocks angiotensin II receptor effects.", "Blood pressure, renal function, potassium, angioedema history, and ACE-inhibitor washout."],
          ["MRA", "Blocks aldosterone-mediated sodium retention, fibrosis, and remodeling.", "Potassium and renal function soon after initiation and dose changes."],
          ["SGLT2 inhibitor", "Promotes glycosuria/natriuresis and favorable cardiorenal effects independent of glucose lowering.", "Volume status, renal function, genital infection risk, and sick-day or perioperative withholding guidance."]
        ],
        "ARNI MRA and SGLT2 inhibitor pharmacology"
      )}

      ${sectionHeader("Interactive safety check", "Choose the situation and identify the main concern")}
      <section class="card interactive-only tts-unit" data-tts-label="Heart failure medication safety checker">
        <div class="form-grid" data-no-speak>
          <label class="form-field"><span>Therapy</span><select id="med-drug"><option value="beta">Evidence-based beta-blocker</option><option value="arni">ARNI</option><option value="mra">MRA</option><option value="sglt2">SGLT2 inhibitor</option><option value="digoxin">Digoxin</option><option value="loop">Loop diuretic</option></select></label>
          <label class="form-field"><span>Clinical situation</span><select id="med-situation"><option value="shock">Active shock / severe hypoperfusion</option><option value="renal">Worsening renal function</option><option value="hyperk">Hyperkalemia</option><option value="fasting">Major fasting or severe acute illness</option><option value="congestion">Significant congestion</option><option value="stable">Stable and euvolemic</option></select></label>
        </div>
        <div class="output-panel" id="med-output"><h3>Do not initiate or up-titrate now</h3><p>Active shock is a major reason not to start or aggressively increase a beta-blocker. Reassess once perfusion and congestion are stabilized.</p></div>
      </section>
    `;
  }

  function acutePage() {
    return `
      ${hero({
        eyebrow: "Module 08 · Acute heart failure",
        title: "Stabilize physiology while finding the time-critical cause",
        intro: "Acute HF is rapid onset or worsening that requires urgent evaluation and treatment. First assess airway, breathing, circulation, oxygenation, blood pressure, rhythm, urine output, mental state, and shock—then classify wet/dry and warm/cold.",
        chips: ["Treat hypoxemia, not every patient with oxygen", "Inotropes for hypoperfusion", "Norepinephrine may support shock", "Urgent echo when unstable"]
      })}

      ${sectionHeader("Common presentations", "Recognize the dominant acute pattern")}
      ${table(
        ["Presentation", "Typical pattern"],
        [
          ["Acute pulmonary edema", "Severe respiratory distress, orthopnea, diffuse crackles, hypoxemia, often hypertension."],
          ["Acute decompensated chronic HF", "Progressive congestion, edema, weight gain, renal dysfunction, or reduced response to oral diuretics."],
          ["Cardiogenic shock", "Hypotension with tissue hypoperfusion due to cardiac dysfunction."],
          ["Isolated RV failure", "Raised JVP, systemic congestion, low output, often with clear lungs depending on cause."],
          ["Hypertensive acute HF", "Marked blood-pressure elevation with pulmonary congestion and fluid redistribution."]
        ],
        "Acute heart failure presentations"
      )}

      ${sectionHeader("Bedside profiles", "Select the profile to see the priority")}
      <section class="profile-grid interactive-only" id="profile-grid" data-no-speak>
        <button class="profile-card is-active" data-profile="warm-wet" type="button"><strong>Warm–wet</strong><small>Adequate perfusion · congestion present</small><div class="profile-badges"><span class="tag teal">Warm</span><span class="tag red">Wet</span></div><p>Most common decompensated profile.</p></button>
        <button class="profile-card" data-profile="cold-wet" type="button"><strong>Cold–wet</strong><small>Reduced perfusion · congestion present</small><div class="profile-badges"><span class="tag amber">Cold</span><span class="tag red">Wet</span></div><p>High-risk profile; assess shock urgently.</p></button>
        <button class="profile-card" data-profile="cold-dry" type="button"><strong>Cold–dry</strong><small>Reduced perfusion · little congestion</small><div class="profile-badges"><span class="tag amber">Cold</span><span class="tag">Dry</span></div><p>Distinguish true underfilling from low output.</p></button>
        <button class="profile-card" data-profile="warm-dry" type="button"><strong>Warm–dry</strong><small>Adequate perfusion · no congestion</small><div class="profile-badges"><span class="tag teal">Warm</span><span class="tag">Dry</span></div><p>Usually compensated.</p></button>
      </section>
      <section class="card section-block tts-unit" id="profile-output" data-tts-label="Warm wet acute heart failure profile"><h3>Warm–wet: decongest</h3><p>Perfusion is adequate but congestion is present. Use IV loop diuretic, monitor response, and consider a vasodilator when blood pressure is high and no contraindication is present.</p></section>

      ${sectionHeader("Immediate assessment", "Four urgent steps")}
      <div class="pathway">
        <article class="pathway-step tts-unit" data-tts-label="Acute assessment airway breathing circulation"><span class="pathway-number">1</span><div><h3>Assess physiology</h3><p>Airway, breathing, circulation, mental state, oxygen saturation, blood pressure, rhythm, urine output, and signs of shock.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Identify time critical causes"><span class="pathway-number">2</span><div><h3>Identify time-critical causes</h3><p>ACS, mechanical complication, acute valve failure, PE, tamponade, aortic syndrome, severe arrhythmia, infection, hypertensive emergency.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Urgent investigations in acute heart failure"><span class="pathway-number">3</span><div><h3>Obtain urgent tests</h3><p>ECG, chest radiograph or bedside lung imaging, troponin, natriuretic peptide, CBC, electrolytes, renal/liver function, glucose, and blood gas when needed.</p></div></article>
        <article class="pathway-step tts-unit" data-tts-label="Urgent echocardiography indications"><span class="pathway-number">4</span><div><h3>Use urgent echocardiography when unstable</h3><p>Shock, hemodynamic instability, suspected mechanical complication, acute valve disease, or uncertain diagnosis.</p></div></article>
      </div>

      ${sectionHeader("Treatment by problem", "Treat the physiological threat")}
      ${table(
        ["Problem", "Management principles"],
        [
          ["Hypoxemia or respiratory distress", "Oxygen for hypoxemia; non-invasive ventilation for selected patients; intubate when respiratory failure persists or airway protection is required."],
          ["Congestion", "IV loop diuretic with close monitoring of urine output, renal function, electrolytes, blood pressure, and symptoms."],
          ["Severe hypertension with pulmonary edema", "Rapidly acting IV vasodilator may be useful when blood pressure permits, alongside diuresis and ventilatory support."],
          ["Hypotension or hypoperfusion", "Treat the cause, assess volume status, avoid unnecessary vasodilators; an inotrope may be required for low output with organ hypoperfusion."],
          ["Cardiogenic shock", "Early shock-team or critical-care involvement; norepinephrine may be required to maintain perfusion; consider mechanical support in selected cases."],
          ["Thromboembolism risk", "Use VTE prophylaxis in hospitalized immobile patients unless contraindicated."]
        ],
        "Acute heart failure treatment by problem"
      )}

      ${sectionHeader("Interactive acute decision lab", "Choose the dominant problem")}
      <section class="card interactive-only tts-unit" data-tts-label="Acute heart failure decision lab">
        <div class="form-grid" data-no-speak>
          <label class="form-field"><span>Perfusion / blood pressure</span><select id="acute-perfusion"><option value="high">Severe hypertension</option><option value="adequate">Adequate perfusion and BP</option><option value="low">Low BP with organ hypoperfusion</option></select></label>
          <label class="form-field"><span>Dominant finding</span><select id="acute-finding"><option value="pulmonary">Pulmonary edema / respiratory distress</option><option value="congestion">Peripheral or systemic congestion</option><option value="dry">Little congestion</option></select></label>
        </div>
        <div class="output-panel" id="acute-output"><h3>Hypertensive pulmonary edema</h3><p>Prioritize ventilatory support, IV loop diuretic, and a rapidly acting IV vasodilator when blood pressure and the clinical context permit. Search for the precipitating cause.</p></div>
      </section>

      <div class="callout danger tts-unit" data-tts-label="Corrections to older acute heart failure teaching"><strong>Corrections to older teaching:</strong> morphine is not routine; oxygen is for hypoxemia rather than automatic use; and inotropes are reserved for hypotension or hypoperfusion, not uncomplicated congestion.</div>
    `;
  }

  function advancedPage() {
    return `
      ${hero({
        eyebrow: "Module 09 · Refractory and advanced HF",
        title: "Reassess everything before calling heart failure refractory",
        intro: "Persistent severe symptoms may reflect incomplete diagnosis, undertreatment, a reversible precipitant, device eligibility, ongoing ischemia, valve disease, pericardial disease, or truly advanced pump failure. Escalation includes mechanical support, transplantation assessment, and palliative integration.",
        chips: ["Recheck diagnosis", "Optimize conventional care", "Refer early", "Palliative care runs alongside active therapy"]
      })}

      ${sectionHeader("Reassessment", "A refractory label is a diagnosis of exclusion")}
      <article class="card tts-unit" data-tts-label="What to reassess before labeling refractory heart failure"><ul class="checklist"><li>Diagnosis and HF phenotype</li><li>Adherence, medication doses, and access barriers</li><li>Residual congestion and diuretic strategy</li><li>Renal function and electrolyte limitations</li><li>Ongoing ischemia or uncontrolled hypertension</li><li>Arrhythmia, infection, anemia, thyroid disease</li><li>Valve or pericardial disease</li><li>Medication-related deterioration and NSAID exposure</li><li>Eligibility for ICD, CRT, revascularization, or valve intervention</li></ul></article>

      ${sectionHeader("Escalation pathways", "Match the next step to the patient's goals and physiology")}
      ${table(
        ["Next step", "Examples"],
        [
          ["Optimize conventional care", "Specialist review, combination diuresis, hemodynamic assessment, device eligibility, revascularization, or valve intervention."],
          ["Advanced therapies", "Durable ventricular assist device, transplantation assessment, temporary mechanical support for selected acute cases."],
          ["Symptom-focused care", "Palliative care, management of dyspnea and fatigue, advance-care planning, support for family and caregivers."]
        ],
        "Advanced heart failure escalation pathways"
      )}

      ${sectionHeader("Devices and support", "Purpose, not just names")}
      <section class="content-grid three">
        ${ttsCard("ICD", `<p>Reduces sudden cardiac death risk in appropriately selected patients after optimized therapy and reassessment of EF. It does not improve pump function or relieve congestion.</p>`, "card concept-card", "ICD")}
        ${ttsCard("CRT", `<p>Improves ventricular synchrony, symptoms, and outcomes in selected reduced-EF patients with prolonged QRS and appropriate rhythm or conduction features.</p>`, "card concept-card teal", "CRT")}
        ${ttsCard("Mechanical support", `<p>Temporary or durable support may bridge to recovery, decision, transplantation, or destination therapy, depending on reversibility and candidacy.</p>`, "card concept-card amber", "MCS")}
        ${ttsCard("Transplantation", `<p>A definitive option for carefully selected patients with end-stage HF despite optimized treatment. Timing of referral matters.</p>`, "card concept-card red", "Tx")}
        ${ttsCard("Palliative care", `<p>Targets symptom burden, communication, quality of life, and family support. It can begin alongside disease-directed and advanced therapy.</p>`, "card concept-card teal", "QoL")}
        ${ttsCard("Goals of care", `<p>Clarify what outcomes matter to the patient, expected trajectory, acceptable burdens, emergency plans, and device decisions.</p>`, "card concept-card", "GoC")}
      </section>

      <div class="callout success tts-unit" data-tts-label="Advanced heart failure referral principle"><strong>Referral principle:</strong> advanced-HF assessment is most useful before irreversible end-organ dysfunction or repeated shock makes options narrower.</div>
    `;
  }

  function revisionPage() {
    const flashcards = [
      ["Does preserved EF exclude heart failure?", "No. HFpEF may have impaired relaxation, stiffness, and raised filling pressure despite EF ≥50%."],
      ["What do diuretics mainly do?", "Relieve congestion and symptoms. They are not a substitute for disease-modifying HFrEF therapy."],
      ["What is the most common cause of right-sided HF?", "Left-sided heart failure. Also consider pulmonary hypertension, PE, RV infarction, and right-sided valve disease."],
      ["When are inotropes appropriate?", "Short-term support for hypotension or organ hypoperfusion from low output, not uncomplicated congestion."],
      ["What does a normal chest radiograph mean?", "It does not exclude chronic compensated HF."],
      ["What does obesity do to BNP or NT-proBNP?", "It may produce unexpectedly lower concentrations, so interpret a low value cautiously."],
      ["Can NYHA class improve?", "Yes. It reflects current symptom limitation and can improve or worsen."],
      ["Can ACC/AHA stage move backward?", "No. Stage reflects disease progression; previous symptomatic structural HF remains Stage C."],
      ["Does the digoxin ECG effect prove toxicity?", "No. Toxicity is clinical and depends on rhythm, renal function, electrolytes, interactions, and concentration." ]
    ];

    return `
      ${hero({
        eyebrow: "Module 10 · Revision lab",
        title: "Compress the chapter into comparisons, traps, and decisions",
        intro: "Use side-by-side distinctions and active recall to prevent common exam errors. Flip each card, then test yourself in the clinical case module.",
        chips: ["HFrEF vs HFpEF", "Left vs right", "Wet vs cold", "Nine active-recall cards"],
        actions: [{ route: "cases", label: "Start clinical cases" }]
      })}

      ${sectionHeader("HFrEF versus HFpEF", "Different dominant mechanics, overlapping syndrome")}
      ${table(
        ["Feature", "HFrEF", "HFpEF"],
        [
          ["Main mechanical problem", "Reduced systolic ejection and often ventricular dilatation.", "Impaired relaxation, stiffness, and raised filling pressure; systolic reserve may also be abnormal."],
          ["Typical structure", "Dilated LV, reduced EF, functional MR may occur.", "LV hypertrophy, LA enlargement, preserved EF; comorbidities are prominent."],
          ["Common causes", "IHD/MI, dilated cardiomyopathy, myocarditis, pressure or volume overload.", "Hypertension, aging, obesity, diabetes, AF, CKD, hypertrophic or infiltrative disease."],
          ["Disease-modifying treatment", "Four foundational drug classes plus selected devices and add-ons.", "SGLT2 inhibitor, diuretics for congestion, intensive comorbidity treatment, selected MRA/ARB/ARNI."]
        ],
        "HFrEF versus HFpEF comparison"
      )}

      ${sectionHeader("Left versus right", "Where congestion appears")}
      <section class="comparison-band">
        <div class="tts-unit" data-tts-label="Left sided heart failure summary"><h3>Left-sided dominant</h3><ul class="mini-list"><li>Pulmonary congestion: dyspnea, orthopnea, crackles, pulmonary edema</li><li>May reduce systemic perfusion</li><li>Functional MR and S3 may occur</li></ul></div>
        <div class="tts-unit" data-tts-label="Right sided heart failure summary"><h3>Right-sided dominant</h3><ul class="mini-list"><li>Systemic venous congestion: raised JVP, edema, hepatomegaly, ascites</li><li>Often secondary to left HF or pulmonary hypertension</li><li>Functional TR and parasternal heave may occur</li></ul></div>
      </section>

      ${sectionHeader("Congestion versus hypoperfusion", "Wet is not the same as cold")}
      <section class="comparison-band">
        <div class="tts-unit" data-tts-label="Congestion revision summary"><h3>Congestion</h3><p>Raised JVP, crackles, edema, hepatomegaly, ascites, weight gain. Treat primarily with decongestion and, when appropriate, vasodilation.</p></div>
        <div class="tts-unit" data-tts-label="Hypoperfusion revision summary"><h3>Hypoperfusion</h3><p>Cool extremities, narrow pulse pressure, oliguria, confusion, weak pulse. Identify shock or low-output state; use inotrope or vasopressor only when clinically justified.</p></div>
      </section>

      ${sectionHeader("Common examination traps", "Statements worth memorizing exactly")}
      <article class="card tts-unit" data-tts-label="Common heart failure examination traps"><ul class="checklist danger"><li>Preserved EF does not mean normal function and does not exclude HF.</li><li>Diuretics relieve congestion but are not the principal disease-modifying treatment for HFrEF.</li><li>Digoxin ECG changes do not equal digoxin toxicity.</li><li>A low BNP or NT-proBNP can be helpful, but obesity may lower concentrations.</li><li>A normal chest radiograph does not exclude chronic compensated HF.</li><li>Do not start a beta-blocker in active cardiogenic shock, but do not stop chronic therapy without a reason.</li><li>Routine oxygen or morphine is not appropriate for every acute HF patient.</li><li>Right-sided HF is usually secondary to left-sided disease, but alternatives matter.</li></ul></article>

      ${sectionHeader("One-page management memory aid", "Think first by clinical situation")}
      ${table(
        ["Clinical situation", "Think first"],
        [
          ["Stable HFrEF", "Four pillars + diuretic for congestion + cause/comorbidity + device assessment."],
          ["HFpEF / HFmrEF", "Confirm diagnosis + SGLT2 inhibitor + control congestion and comorbidities."],
          ["Wet patient", "Decongest and identify the precipitant."],
          ["Cold patient", "Assess shock, perfusion, and volume status urgently."],
          ["Acute pulmonary edema with high BP", "Ventilatory support, IV diuretic, vasodilator if appropriate."],
          ["Acute HF with low SBP and organ hypoperfusion", "Shock pathway, inotrope or vasopressor as indicated, urgent cause-specific treatment."],
          ["Persistent severe symptoms despite optimal care", "Advanced HF referral, device/mechanical support/transplantation or palliative integration."]
        ],
        "Heart failure management memory aid"
      )}

      ${sectionHeader("Active recall", "Click a card to reveal the answer")}
      <section class="flashcard-grid interactive-only" id="flashcard-grid">
        ${flashcards.map(([front, back], index) => `<button class="flashcard" type="button" aria-label="Flip flashcard ${index + 1}"><span class="flashcard-inner"><span class="flashcard-face front"><h3>${front}</h3><span class="flashcard-hint">Click to reveal</span></span><span class="flashcard-face back"><h3>Answer</h3><p>${back}</p></span></span></button>`).join("")}
      </section>
    `;
  }

  const quizQuestions = [
    {
      q: "A patient has exertional dyspnea, edema, a previous LVEF of 32%, and a current LVEF of 47% after treatment. Which phenotype label is most appropriate?",
      options: ["HFpEF", "HFmrEF only", "HFimpEF", "No heart failure because EF improved"],
      answer: 2,
      explanation: "HFimpEF applies when LVEF was previously 40% or lower and later rises above 40%. Disease-modifying therapy is generally continued because relapse can occur."
    },
    {
      q: "Which statement best distinguishes NYHA class from ACC/AHA stage?",
      options: ["Both are fixed once assigned", "NYHA reflects current limitation; stage reflects progression", "Stage is based only on EF", "NYHA is used only in acute HF"],
      answer: 1,
      explanation: "NYHA class can improve or worsen with symptoms. ACC/AHA stage describes disease progression and does not move backward from symptomatic Stage C to Stage B."
    },
    {
      q: "A patient has raised JVP, edema, ascites, warm extremities, and preserved mentation. Which acute profile is most likely?",
      options: ["Warm-dry", "Warm-wet", "Cold-dry", "Cold-wet"],
      answer: 1,
      explanation: "Congestion makes the patient wet; adequate perfusion makes the patient warm. The initial priority is decongestion and treatment of the precipitant."
    },
    {
      q: "Which finding most strongly suggests hypoperfusion rather than congestion?",
      options: ["Raised JVP", "Basal crackles", "Cool extremities with oliguria", "Dependent edema"],
      answer: 2,
      explanation: "Cool limbs, weak pulse, narrow pulse pressure, confusion, and oliguria are classic low-output or hypoperfusion features."
    },
    {
      q: "A patient with obesity has convincing HF symptoms but a relatively low BNP. What is the best interpretation?",
      options: ["HF is impossible", "Obesity can lower BNP, so interpret in context", "BNP is diagnostic only when low", "Proceed directly to transplantation"],
      answer: 1,
      explanation: "Obesity can produce unexpectedly lower natriuretic peptide concentrations. A low value is useful but must be interpreted with the clinical picture, rhythm, kidney function, assay, and echocardiography."
    },
    {
      q: "Which test most directly defines LVEF, chamber size, valve disease, RV function, and pulmonary pressure?",
      options: ["ECG", "Chest radiograph", "Transthoracic echocardiography", "CBC"],
      answer: 2,
      explanation: "Transthoracic echocardiography is central for phenotype and structural assessment. ECG and chest radiography are useful but not sufficient alone."
    },
    {
      q: "Which chronic HFrEF treatment mainly relieves congestion but is not a substitute for disease-modifying therapy?",
      options: ["Loop diuretic", "Evidence-based beta-blocker", "MRA", "SGLT2 inhibitor"],
      answer: 0,
      explanation: "Loop diuretics are essential for symptom relief and euvolemia, but the four foundational classes modify clinical outcomes."
    },
    {
      q: "When should an evidence-based beta-blocker generally NOT be initiated or aggressively increased?",
      options: ["Stable euvolemic HFrEF", "Active cardiogenic shock", "After congestion resolves", "During long-term follow-up"],
      answer: 1,
      explanation: "The immediate negative inotropic effect makes initiation or rapid up-titration inappropriate during active shock or severe fluid overload."
    },
    {
      q: "A patient taking digoxin has sagging ST depression but no symptoms, arrhythmia, renal deterioration, or electrolyte abnormality. What is the best conclusion?",
      options: ["This proves digoxin toxicity", "This may be the digoxin effect without toxicity", "Digoxin must always be stopped", "The ECG excludes any digoxin exposure"],
      answer: 1,
      explanation: "The classic digoxin ECG effect does not itself prove toxicity. Toxicity is a clinical diagnosis supported by rhythm, renal function, electrolytes, interactions, and concentration."
    },
    {
      q: "A patient has severe pulmonary edema, marked hypertension, and hypoxemia. Which approach is most appropriate?",
      options: ["Routine morphine alone", "Ventilatory support, IV diuretic, and vasodilator if appropriate", "Chronic oral digoxin only", "Avoid treatment until BNP returns"],
      answer: 1,
      explanation: "Hypertensive acute pulmonary edema requires rapid respiratory support and decongestion; an IV vasodilator may be useful when blood pressure permits."
    },
    {
      q: "Which statement about oxygen in acute HF is correct?",
      options: ["Give it routinely to every patient", "Use it to treat hypoxemia", "It replaces diuresis", "It is contraindicated in pulmonary edema"],
      answer: 1,
      explanation: "Oxygen treats hypoxemia and is not routinely required when saturation is adequate."
    },
    {
      q: "Persistent severe symptoms remain despite apparently optimized care. What should happen before labeling HF refractory?",
      options: ["Assume non-adherence without review", "Reassess diagnosis, cause, congestion, doses, renal function, rhythm, ischemia, and device eligibility", "Stop all disease-modifying therapy", "Use chronic inotropes routinely"],
      answer: 1,
      explanation: "Refractory HF requires systematic reassessment for diagnostic errors, reversible causes, under-treatment, structural disease, and advanced-therapy eligibility."
    }
  ];

  function casesPage() {
    return `
      ${hero({
        eyebrow: "Module 11 · Clinical cases",
        title: "Apply the chapter under exam conditions",
        intro: "Work through twelve single-best-answer questions. Each answer gives the reasoning immediately, and your best score is saved locally in the browser.",
        chips: ["12 questions", "Immediate explanations", "Saved best score", "Restart anytime"]
      })}
      <section class="card quiz-card interactive-only" id="quiz-root" aria-live="polite"></section>
    `;
  }

  function sourcesPage() {
    return `
      ${hero({
        eyebrow: "Module 12 · Sources and scope",
        title: "Source chapter, guideline basis, and text-to-speech notes",
        intro: "This website reorganizes the uploaded Heart Failure study chapter into connected modules and interactive tools. The clinical content should be used for study, not patient-specific treatment decisions.",
        chips: ["Uploaded 18-page chapter", "ESC 2021 + 2023 update", "AHA/ACC/HFSA 2022", "Static offline website"]
      })}

      ${sectionHeader("Uploaded source", "Open the original chapter")}
      <article class="card reference-card tts-unit" data-tts-label="Uploaded heart failure source chapter"><h3>Heart Failure · Reconstructed Study Chapter</h3><p>The source chapter covers definition, classification, pathophysiology, diagnosis, chronic and acute management, focused pharmacology, advanced therapy, and revision points.</p><a class="source-file-link" href="assets/heart-failure-source.pdf" target="_blank" rel="noopener">Open the source PDF ↗</a></article>

      ${sectionHeader("References named in the chapter", "Primary guideline documents")}
      <section class="content-grid three">
        <article class="card reference-card tts-unit" data-tts-label="2021 ESC heart failure guideline"><h3>2021 ESC Guideline</h3><p>McDonagh TA, Metra M, and colleagues. Diagnosis and treatment of acute and chronic heart failure.</p><a href="https://doi.org/10.1093/eurheartj/ehab368" target="_blank" rel="noopener">Open DOI ↗</a></article>
        <article class="card reference-card tts-unit" data-tts-label="2023 ESC focused update"><h3>2023 ESC Focused Update</h3><p>Focused update of the 2021 ESC guideline for acute and chronic heart failure.</p><a href="https://doi.org/10.1093/eurheartj/ehad195" target="_blank" rel="noopener">Open DOI ↗</a></article>
        <article class="card reference-card tts-unit" data-tts-label="2022 AHA ACC HFSA heart failure guideline"><h3>2022 AHA/ACC/HFSA Guideline</h3><p>Heidenreich PA, Bozkurt B, and colleagues. Guideline for the management of heart failure.</p><a href="https://doi.org/10.1161/CIR.0000000000001063" target="_blank" rel="noopener">Open DOI ↗</a></article>
      </section>

      ${sectionHeader("Text-to-speech", "How the UK female voice works")}
      <section class="content-grid two">
        ${ttsCard("Preferred voice", `<p>The site asks the browser for <strong>Google UK English Female</strong>. Chrome commonly provides this exact voice. Every small learning block receives its own Listen button after the module loads.</p>`, "card concept-card teal", "🔊")}
        ${ttsCard("Fallback behavior", `<p>If that exact voice is unavailable, the site chooses the closest installed British-English voice. Voice availability is controlled by the browser and operating system, so the displayed voice name may differ.</p>`, "card concept-card amber", "UK")}
      </section>

      ${sectionHeader("Educational limits", "Use complete current guidance for clinical care")}
      <article class="card tts-unit" data-tts-label="Educational limitations"><ul class="checklist danger"><li>This is a structured study aid, not a patient-specific diagnostic or prescribing tool.</li><li>Drug eligibility, contraindications, doses, device criteria, and acute management depend on the complete current guideline and local policy.</li><li>The interactive tools simplify clinical reasoning and must not replace examination, imaging, laboratory data, or specialist review.</li><li>Speech synthesis reads visible text; it does not validate medical content or accessibility pronunciation.</li></ul></article>
    `;
  }

  const pageMap = {
    overview: overviewPage,
    foundations: foundationsPage,
    mechanisms: mechanismsPage,
    clinical: clinicalPage,
    diagnosis: diagnosisPage,
    chronic: chronicPage,
    pharmacology: pharmacologyPage,
    acute: acutePage,
    advanced: advancedPage,
    revision: revisionPage,
    cases: casesPage,
    sources: sourcesPage
  };

  // ---------- Text-to-speech ----------
  let selectedVoice = null;
  let activeSpeechButton = null;
  let speechQueue = [];
  let speechIndex = 0;

  function chooseVoice() {
    if (!("speechSynthesis" in window)) {
      voiceStatus.textContent = "TTS unavailable";
      voicePill.classList.add("is-fallback");
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;

    const exact = voices.find(v => v.name.toLowerCase() === "google uk english female");
    const preferredNames = ["google uk english female", "serena", "sonia", "libby", "susan", "kate", "female"];
    const british = voices.filter(v => /^en-GB/i.test(v.lang));
    const named = british.find(v => preferredNames.some(name => v.name.toLowerCase().includes(name)));
    selectedVoice = exact || named || british[0] || voices.find(v => /^en/i.test(v.lang)) || voices[0];

    if (exact) {
      voiceStatus.textContent = "Google UK English Female";
      voicePill.classList.remove("is-fallback");
    } else {
      voiceStatus.textContent = selectedVoice ? `${selectedVoice.name} · en-GB fallback` : "UK voice fallback";
      voicePill.classList.add("is-fallback");
    }
  }

  function splitSpeechText(text, maxLength = 220) {
    const clean = text.replace(/\s+/g, " ").replace(/↗|→/g, ". ").trim();
    if (!clean) return [];
    const sentences = clean.match(/[^.!?;:]+[.!?;:]?|[^.!?;:]+$/g) || [clean];
    const chunks = [];
    let current = "";
    sentences.forEach(sentence => {
      const next = `${current} ${sentence}`.trim();
      if (next.length <= maxLength) {
        current = next;
      } else {
        if (current) chunks.push(current);
        if (sentence.length <= maxLength) {
          current = sentence.trim();
        } else {
          const words = sentence.trim().split(" ");
          current = "";
          words.forEach(word => {
            const candidate = `${current} ${word}`.trim();
            if (candidate.length > maxLength && current) {
              chunks.push(current);
              current = word;
            } else {
              current = candidate;
            }
          });
        }
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  function resetSpeechButton() {
    if (activeSpeechButton) {
      activeSpeechButton.classList.remove("is-speaking");
      activeSpeechButton.innerHTML = "<span aria-hidden=\"true\">🔊</span><span>Listen</span>";
      activeSpeechButton.setAttribute("aria-label", activeSpeechButton.dataset.defaultLabel || "Listen to this section");
    }
    activeSpeechButton = null;
  }

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speechQueue = [];
    speechIndex = 0;
    resetSpeechButton();
  }

  function speakNextChunk() {
    if (!speechQueue.length || speechIndex >= speechQueue.length) {
      resetSpeechButton();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speechQueue[speechIndex]);
    utterance.lang = "en-GB";
    utterance.rate = Number(speechRate.value || 0.95);
    utterance.pitch = 1;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => {
      speechIndex += 1;
      speakNextChunk();
    };
    utterance.onerror = event => {
      if (event.error !== "interrupted" && event.error !== "canceled") showToast("Speech stopped because the browser voice reported an error.");
      resetSpeechButton();
    };
    window.speechSynthesis.speak(utterance);
  }

  function readableText(element) {
    const clone = element.cloneNode(true);
    clone.querySelectorAll("button, input, select, textarea, .tts-toolbar, [data-no-speak], script, style").forEach(node => node.remove());
    const label = element.dataset.ttsLabel || "";
    const body = clone.textContent.replace(/\s+/g, " ").trim();
    return label && !body.toLowerCase().startsWith(label.toLowerCase()) ? `${label}. ${body}` : body;
  }

  function speakElement(element, button) {
    if (!("speechSynthesis" in window)) {
      showToast("Text-to-speech is not available in this browser.");
      return;
    }
    if (button === activeSpeechButton) {
      stopSpeech();
      return;
    }
    stopSpeech();
    chooseVoice();
    const text = readableText(element);
    speechQueue = splitSpeechText(text);
    if (!speechQueue.length) {
      showToast("There is no readable text in this block.");
      return;
    }
    activeSpeechButton = button;
    button.classList.add("is-speaking");
    button.innerHTML = "<span aria-hidden=\"true\">■</span><span>Stop</span>";
    button.setAttribute("aria-label", "Stop reading this section");
    speechIndex = 0;
    speakNextChunk();
  }

  function enhanceTTS() {
    const candidates = contentRoot.querySelectorAll(".tts-unit");
    candidates.forEach((unit, index) => {
      if (unit.querySelector(":scope > .tts-toolbar")) return;
      const title = unit.dataset.ttsLabel || unit.querySelector("h1, h2, h3, h4")?.textContent?.trim() || `learning block ${index + 1}`;
      const toolbar = document.createElement("div");
      toolbar.className = "tts-toolbar";
      if (unit.classList.contains("section-header") || unit.classList.contains("page-hero")) toolbar.classList.add("inline");
      const button = document.createElement("button");
      button.className = "tts-button";
      button.type = "button";
      button.dataset.defaultLabel = `Listen to ${title}`;
      button.setAttribute("aria-label", button.dataset.defaultLabel);
      button.innerHTML = "<span aria-hidden=\"true\">🔊</span><span>Listen</span>";
      button.addEventListener("click", event => {
        event.stopPropagation();
        speakElement(unit, button);
      });
      toolbar.appendChild(button);
      unit.insertBefore(toolbar, unit.firstChild);
    });
  }

  // ---------- Page interactivity ----------
  function phenotypeFor(value, previous) {
    if (previous === "yes" && value > 40) return ["HFimpEF", "Previous LVEF was 40% or lower and is now above 40%. Continue disease-modifying therapy unless a clinical reason dictates otherwise."];
    if (value <= 40) return ["HFrEF", "LVEF 40% or lower; systolic dysfunction is prominent."];
    if (value <= 49) return ["HFmrEF", "LVEF 41–49%; assess the full syndrome and cause."];
    return ["HFpEF", "LVEF 50% or higher; confirm raised filling pressure or structural/functional abnormalities because preserved EF alone does not establish HF."];
  }

  function initOverviewEF() {
    const input = document.getElementById("overview-ef");
    const previous = document.getElementById("overview-previous");
    const button = document.getElementById("overview-ef-button");
    const output = document.getElementById("overview-ef-output");
    if (!button) return;
    const update = () => {
      const value = Math.max(5, Math.min(80, Number(input.value || 0)));
      const [label, text] = phenotypeFor(value, previous.value);
      output.innerHTML = `<strong>${label}</strong><span>${text}</span>`;
      output.closest(".tts-unit")?.setAttribute("data-tts-label", `Ejection fraction classifier result ${label}`);
    };
    button.addEventListener("click", update);
    input.addEventListener("keydown", event => { if (event.key === "Enter") update(); });
  }

  function initFoundationsTools() {
    const range = document.getElementById("ef-range");
    const previous = document.getElementById("ef-previous");
    const valueOutput = document.getElementById("ef-value");
    const marker = document.getElementById("ef-marker");
    const result = document.getElementById("ef-result");
    if (range) {
      const update = () => {
        const value = Number(range.value);
        valueOutput.textContent = `${value}%`;
        marker.style.left = `${((value - 10) / 65) * 100}%`;
        const [label, text] = phenotypeFor(value, previous.value);
        result.innerHTML = `<strong>${label}</strong><span>${text}</span>`;
      };
      range.addEventListener("input", update);
      previous.addEventListener("change", update);
      update();
    }
    const nyhaSelect = document.getElementById("nyha-select");
    const nyhaOutput = document.getElementById("nyha-output");
    if (nyhaSelect) {
      const descriptions = {
        1: "No limitation of ordinary physical activity.",
        2: "Slight limitation; comfortable at rest, but ordinary activity causes symptoms.",
        3: "Marked limitation; comfortable at rest, but less-than-ordinary activity causes symptoms.",
        4: "Symptoms at rest or inability to perform any physical activity without discomfort."
      };
      nyhaSelect.addEventListener("change", () => {
        nyhaOutput.innerHTML = `<h3>NYHA ${["", "I", "II", "III", "IV"][Number(nyhaSelect.value)]}</h3><p>${descriptions[nyhaSelect.value]}</p>`;
      });
    }
  }

  function initMechanismExplorer() {
    const root = document.getElementById("mechanism-buttons");
    const output = document.getElementById("mechanism-output");
    if (!root) return;
    const data = {
      sympathetic: ["Raise heart rate and contractility to preserve cardiac output.", "Increases oxygen demand, shortens filling time, and promotes arrhythmia and remodeling."],
      raas: ["Support blood pressure and circulating volume through vasoconstriction and sodium retention.", "Raises afterload and causes fluid retention, congestion, fibrosis, and electrolyte problems."],
      starling: ["Greater fiber stretch can increase stroke volume temporarily.", "Excess dilatation raises wall stress and promotes functional mitral or tricuspid regurgitation."],
      hypertrophy: ["Normalizes wall stress during pressure overload.", "Produces stiffness, ischemia, fibrosis, and diastolic dysfunction over time."],
      peptides: ["Promote natriuresis, vasodilation, and counter-regulation.", "The response is often too weak to overcome sustained sympathetic and RAAS activation."]
    };
    root.addEventListener("click", event => {
      const button = event.target.closest("[data-mechanism]");
      if (!button) return;
      root.querySelectorAll("button").forEach(item => item.classList.toggle("is-active", item === button));
      const [benefit, cost] = data[button.dataset.mechanism];
      output.innerHTML = `<div><h3>Immediate purpose</h3><p>${benefit}</p></div><div><h3>Why it becomes harmful</h3><p>${cost}</p></div>`;
    });
  }

  function initFramingham() {
    const major = document.getElementById("major-criteria");
    const minor = document.getElementById("minor-criteria");
    const output = document.getElementById("framingham-output");
    if (!major) return;
    const update = () => {
      const majorCount = major.querySelectorAll("input:checked").length;
      const minorCount = minor.querySelectorAll("input:checked").length;
      const supported = majorCount >= 2 || (majorCount >= 1 && minorCount >= 2);
      output.innerHTML = `<h3>${supported ? "Classical rule is supported" : "Not yet supported by the classical rule"}</h3><p>Selected: ${majorCount} major, ${minorCount} minor. ${supported ? "Modern confirmation still requires objective cardiac assessment." : "Minor criteria should count only when not better explained by another condition."}</p>`;
    };
    major.addEventListener("change", update);
    minor.addEventListener("change", update);
  }

  function initBNP() {
    const context = document.getElementById("bnp-context");
    const result = document.getElementById("bnp-result");
    const output = document.getElementById("bnp-output");
    if (!context) return;
    const update = () => {
      const feature = context.value;
      const level = result.value;
      const effects = {
        obesity: ["lower", "Obesity can lower natriuretic peptide concentrations."],
        renal: ["higher", "Renal dysfunction can raise natriuretic peptide concentrations."],
        af: ["higher", "Atrial fibrillation can raise natriuretic peptide concentrations."],
        age: ["higher", "Older age can raise natriuretic peptide concentrations."],
        treated: ["lower", "Successful treatment and decongestion can lower concentrations."],
        early: ["lower", "Very early presentation may precede a full biomarker rise."]
      };
      const [direction, reason] = effects[feature];
      const concordant = level === (direction === "higher" ? "high" : "low");
      output.innerHTML = `<h3>${concordant ? "The result fits this context" : "The result needs extra caution"}</h3><p>${reason} A ${level} result must still be integrated with symptoms, examination, renal function, rhythm, body habitus, assay, and echocardiography.</p>`;
    };
    context.addEventListener("change", update);
    result.addEventListener("change", update);
  }

  function initPillars() {
    const grid = document.getElementById("pillar-grid");
    const output = document.getElementById("pillar-output");
    if (!grid) return;
    const data = {
      arni: ["ARNI, or ACE inhibitor / ARB when ARNI is unsuitable", "Reduces death and HF hospitalization and limits maladaptive RAAS signaling and remodeling.", "Monitor hypotension, renal function, and potassium. Do not combine ARNI with an ACE inhibitor; use an appropriate washout."],
      beta: ["Evidence-based beta-blocker", "Reduces mortality, sudden death, and hospitalization and improves remodeling.", "Start when stable and euvolemic, titrate slowly, and use agents with outcome evidence."],
      mra: ["Mineralocorticoid receptor antagonist", "Reduces mortality and hospitalization by blocking aldosterone-mediated retention, fibrosis, and remodeling.", "Monitor potassium and kidney function because hyperkalemia and renal impairment may limit use."],
      sglt2: ["SGLT2 inhibitor", "Reduces HF hospitalization and cardiovascular events with or without diabetes.", "Watch volume status, genital infection risk, rare ketoacidosis, and sick-day or perioperative withholding guidance."]
    };
    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-pillar]");
      if (!button) return;
      grid.querySelectorAll(".pillar-card").forEach(card => card.classList.toggle("is-active", card.contains(button)));
      const [title, benefit, caution] = data[button.dataset.pillar];
      output.dataset.ttsLabel = `${title} pillar details`;
      output.innerHTML = `<h3>${title}</h3><div class="comparison-band"><div><h3>Main benefit</h3><p>${benefit}</p></div><div><h3>Key cautions</h3><p>${caution}</p></div></div>`;
      enhanceTTS();
    });
  }

  function initMedicationSafety() {
    const drug = document.getElementById("med-drug");
    const situation = document.getElementById("med-situation");
    const output = document.getElementById("med-output");
    if (!drug) return;
    const update = () => {
      const d = drug.value;
      const s = situation.value;
      let title = "Review the indication and monitoring";
      let text = "Use the drug only for a clear indication and monitor clinical response, blood pressure, renal function, electrolytes, and adverse effects as appropriate.";
      if (d === "beta" && s === "shock") { title = "Do not initiate or up-titrate now"; text = "Active shock is a major reason not to start or aggressively increase a beta-blocker. Reassess after perfusion and congestion stabilize."; }
      else if (d === "beta" && s === "stable") { title = "Appropriate setting for cautious initiation"; text = "A stable, euvolemic patient is the correct context for low-dose initiation and gradual titration of an outcome-proven beta-blocker."; }
      else if ((d === "arni" || d === "mra") && s === "hyperk") { title = "Potassium is the key concern"; text = "ARNI/RAAS therapy and especially MRA require careful potassium and kidney assessment. Significant hyperkalemia may prevent initiation or require adjustment."; }
      else if ((d === "arni" || d === "mra") && s === "renal") { title = "Reassess kidney function and potassium"; text = "Renal deterioration changes the safety margin. Review trend, volume status, potassium, blood pressure, and reversible causes before continuing or changing therapy."; }
      else if (d === "sglt2" && s === "fasting") { title = "Temporarily withhold according to guidance"; text = "Major fasting, surgery, or severe acute illness increases ketoacidosis risk; follow local sick-day or perioperative withholding guidance."; }
      else if (d === "digoxin" && s === "renal") { title = "High toxicity risk"; text = "Digoxin clearance falls with renal dysfunction. Review dose, concentration, rhythm, electrolytes, body mass, and interacting drugs."; }
      else if (d === "loop" && s === "congestion") { title = "Strong symptom indication"; text = "Loop diuretic is appropriate for significant congestion, with monitoring of urine output, weight, blood pressure, renal function, sodium, potassium, and magnesium."; }
      else if (d === "loop" && s === "shock") { title = "Decongest cautiously while protecting perfusion"; text = "In shock or severe hypoperfusion, assess volume status and organ perfusion carefully. Diuresis may still be needed when wet, but the strategy must be individualized."; }
      output.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
    };
    drug.addEventListener("change", update);
    situation.addEventListener("change", update);
  }

  function initAcuteProfiles() {
    const grid = document.getElementById("profile-grid");
    const output = document.getElementById("profile-output");
    if (!grid) return;
    const data = {
      "warm-wet": ["Warm–wet: decongest", "Perfusion is adequate but congestion is present. Use IV loop diuretic, monitor response, and consider a vasodilator when blood pressure is high and no contraindication is present."],
      "cold-wet": ["Cold–wet: high-risk low output with congestion", "Evaluate urgently for shock and the precipitant. Decongest cautiously while supporting perfusion; an inotrope or vasopressor may be needed when organ hypoperfusion is present."],
      "cold-dry": ["Cold–dry: assess volume status precisely", "If true underfilling is present, a cautious fluid challenge may be considered. Otherwise, treat as a low-output state and avoid reflex fluid loading."],
      "warm-dry": ["Warm–dry: compensated profile", "Perfusion is adequate and congestion is absent. Optimize chronic disease-modifying therapy, cause, comorbidities, and follow-up."]
    };
    grid.addEventListener("click", event => {
      const button = event.target.closest("[data-profile]");
      if (!button) return;
      grid.querySelectorAll(".profile-card").forEach(card => card.classList.toggle("is-active", card === button));
      const [title, text] = data[button.dataset.profile];
      output.dataset.ttsLabel = title;
      output.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
      enhanceTTS();
    });
  }

  function initAcuteDecision() {
    const perfusion = document.getElementById("acute-perfusion");
    const finding = document.getElementById("acute-finding");
    const output = document.getElementById("acute-output");
    if (!perfusion) return;
    const update = () => {
      let title = "Assess the whole patient";
      let text = "Classify congestion and perfusion, identify the precipitant, and treat the dominant physiological problem.";
      if (perfusion.value === "high" && finding.value === "pulmonary") { title = "Hypertensive pulmonary edema"; text = "Prioritize ventilatory support, IV loop diuretic, and a rapidly acting IV vasodilator when blood pressure and context permit. Search for the precipitant."; }
      else if (perfusion.value === "adequate" && finding.value === "congestion") { title = "Warm–wet congestion"; text = "Use IV loop diuretic with close monitoring. Consider vasodilation when blood pressure is elevated, and identify the trigger."; }
      else if (perfusion.value === "low" && finding.value === "congestion") { title = "Cold–wet high-risk profile"; text = "Treat as possible shock or severe low output: urgent critical-care assessment, cause-specific treatment, cautious decongestion, and inotrope or vasopressor when organ hypoperfusion requires support."; }
      else if (perfusion.value === "low" && finding.value === "dry") { title = "Cold–dry low output"; text = "Determine whether the patient is truly underfilled. Use a cautious fluid challenge only when appropriate; otherwise consider low-output support and urgent cause assessment."; }
      else if (perfusion.value === "adequate" && finding.value === "dry") { title = "Warm–dry compensated profile"; text = "There is no dominant congestion or hypoperfusion. Optimize chronic therapy and investigate the reason for presentation."; }
      else if (perfusion.value === "high" && finding.value === "congestion") { title = "Hypertensive congestive decompensation"; text = "Decongest, control severe blood pressure elevation safely, and search for ischemia, non-adherence, renal deterioration, or another trigger."; }
      output.innerHTML = `<h3>${title}</h3><p>${text}</p>`;
    };
    perfusion.addEventListener("change", update);
    finding.addEventListener("change", update);
  }

  function initTabs() {
    contentRoot.querySelectorAll("[data-tab-group]").forEach(group => {
      const tabs = [...group.querySelectorAll('[role="tab"]')];
      const panels = [...group.querySelectorAll('[role="tabpanel"]')];
      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
          tabs.forEach((item, i) => {
            const selected = i === index;
            item.setAttribute("aria-selected", String(selected));
            item.tabIndex = selected ? 0 : -1;
            panels[i].hidden = !selected;
          });
          enhanceTTS();
        });
        tab.addEventListener("keydown", event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          let next = index;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = tabs.length - 1;
          tabs[next].click();
          tabs[next].focus();
        });
      });
    });
  }

  function initFlashcards() {
    const grid = document.getElementById("flashcard-grid");
    if (!grid) return;
    grid.addEventListener("click", event => {
      const card = event.target.closest(".flashcard");
      if (!card) return;
      card.classList.toggle("is-flipped");
    });
  }

  function initQuiz() {
    const root = document.getElementById("quiz-root");
    if (!root) return;
    let index = 0;
    let score = 0;
    let answered = false;
    const best = Number(localStorage.getItem("hf-studio-best-score") || 0);

    const renderQuestion = () => {
      const item = quizQuestions[index];
      answered = false;
      root.innerHTML = `
        <div class="quiz-progress"><span>Question ${index + 1} of ${quizQuestions.length}</span><span>Score ${score} · Best ${best}</span></div>
        <h2 class="quiz-question">${item.q}</h2>
        <div class="quiz-options">${item.options.map((option, i) => `<button class="quiz-option" data-option="${i}" type="button"><span class="letter">${String.fromCharCode(65 + i)}</span><span>${option}</span></button>`).join("")}</div>
        <div id="quiz-feedback"></div>`;
    };

    const renderResult = () => {
      const percentage = Math.round((score / quizQuestions.length) * 100);
      const previousBest = Number(localStorage.getItem("hf-studio-best-score") || 0);
      if (score > previousBest) localStorage.setItem("hf-studio-best-score", String(score));
      root.innerHTML = `
        <div class="score-ring" style="--score-angle:${percentage * 3.6}deg"><span>${percentage}%</span></div>
        <h2 style="text-align:center">${score} / ${quizQuestions.length} correct</h2>
        <p style="text-align:center;color:var(--ink-soft)">${percentage >= 85 ? "Excellent integration of the chapter." : percentage >= 65 ? "Good foundation—review the explanations you missed." : "Revisit the core modules, especially classification, diagnosis, and acute profiles."}</p>
        <div style="display:flex;justify-content:center;gap:.7rem;flex-wrap:wrap"><button class="button" id="restart-quiz" type="button">Restart quiz</button><button class="button secondary" data-route="revision" type="button">Open revision lab</button></div>`;
      document.getElementById("restart-quiz").addEventListener("click", () => { index = 0; score = 0; renderQuestion(); });
    };

    root.addEventListener("click", event => {
      const option = event.target.closest("[data-option]");
      if (!option || answered) return;
      answered = true;
      const selected = Number(option.dataset.option);
      const item = quizQuestions[index];
      if (selected === item.answer) score += 1;
      root.querySelectorAll(".quiz-option").forEach((button, i) => {
        button.disabled = true;
        if (i === item.answer) button.classList.add("is-correct");
        if (i === selected && i !== item.answer) button.classList.add("is-wrong");
      });
      const feedback = document.getElementById("quiz-feedback");
      feedback.innerHTML = `<div class="quiz-explanation tts-unit" data-tts-label="Question explanation"><strong>${selected === item.answer ? "Correct." : "Not quite."}</strong> ${item.explanation}<div style="margin-top:.8rem"><button class="button small" id="next-question" type="button">${index === quizQuestions.length - 1 ? "See score" : "Next question"}</button></div></div>`;
      enhanceTTS();
      document.getElementById("next-question").addEventListener("click", () => {
        index += 1;
        if (index >= quizQuestions.length) renderResult(); else renderQuestion();
      });
    });

    renderQuestion();
  }

  function initPage(route) {
    initTabs();
    enhanceTTS();
    if (route === "overview") initOverviewEF();
    if (route === "foundations") initFoundationsTools();
    if (route === "mechanisms") initMechanismExplorer();
    if (route === "clinical") initFramingham();
    if (route === "diagnosis") initBNP();
    if (route === "chronic") initPillars();
    if (route === "pharmacology") initMedicationSafety();
    if (route === "acute") { initAcuteProfiles(); initAcuteDecision(); }
    if (route === "revision") initFlashcards();
    if (route === "cases") initQuiz();
  }

  // ---------- Routing, search, progress ----------
  function getVisited() {
    try { return new Set(JSON.parse(localStorage.getItem("hf-studio-visited") || "[]")); }
    catch { return new Set(); }
  }

  function saveVisited(visited) {
    localStorage.setItem("hf-studio-visited", JSON.stringify([...visited]));
  }

  function updateProgress(route) {
    const visited = getVisited();
    visited.add(route);
    saveVisited(visited);
    progressLabel.textContent = `${visited.size} / ${routeIds.length}`;
    progressBar.style.width = `${(visited.size / routeIds.length) * 100}%`;
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    scrim.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
  }

  function renderRoute(route) {
    const safeRoute = routeIds.includes(route) ? route : "overview";
    stopSpeech();
    const meta = routeMeta.find(item => item.id === safeRoute);
    currentLabel.textContent = meta.title;
    document.title = `${meta.title} | HF Studio`;
    nav.querySelectorAll("[data-route]").forEach(button => button.classList.toggle("is-active", button.dataset.route === safeRoute));
    contentRoot.innerHTML = `<div class="fade-in">${pageMap[safeRoute]()}</div>`;
    updateProgress(safeRoute);
    initPage(safeRoute);
    closeSidebar();
    window.scrollTo({ top: 0, behavior: "auto" });
    contentRoot.focus?.();
  }

  function currentRouteFromHash() {
    return window.location.hash.replace(/^#/, "") || "overview";
  }

  function navigate(route) {
    if (!routeIds.includes(route)) route = "overview";
    if (currentRouteFromHash() === route) renderRoute(route);
    else window.location.hash = route;
  }

  const searchConcepts = [
    ["Ejection fraction phenotype", "foundations", "HFrEF ≤40%, HFmrEF 41–49%, HFpEF ≥50%, HFimpEF after recovery"],
    ["NYHA functional class", "foundations", "Current symptom limitation from Class I to IV"],
    ["ACC/AHA stages", "foundations", "Stage A risk, B pre-HF, C symptomatic, D advanced"],
    ["Neurohormonal compensation", "mechanisms", "Sympathetic, RAAS, vasopressin, retention, remodeling"],
    ["High-output heart failure", "mechanisms", "Anemia, thyrotoxicosis, beriberi, AV fistula"],
    ["Right-sided heart failure", "clinical", "Raised JVP, edema, ascites, hepatomegaly"],
    ["Framingham criteria", "clinical", "Two major or one major plus two minor"],
    ["Natriuretic peptide interpretation", "diagnosis", "BNP and NT-proBNP context, obesity and renal dysfunction"],
    ["Echocardiography", "diagnosis", "EF, chambers, valves, RV, pulmonary pressure, pericardium"],
    ["Four foundational HFrEF therapies", "chronic", "ARNI/ACEi/ARB, beta-blocker, MRA, SGLT2 inhibitor"],
    ["Digoxin toxicity", "pharmacology", "ECG effect is not toxicity; assess rhythm, renal function, electrolytes"],
    ["Diuretic resistance", "pharmacology", "Adherence, renal function, NSAIDs, gut edema, sequential nephron blockade"],
    ["Warm-wet profile", "acute", "Adequate perfusion with congestion; decongest"],
    ["Cold-wet profile", "acute", "Hypoperfusion with congestion; high-risk shock assessment"],
    ["Hypertensive pulmonary edema", "acute", "Ventilatory support, IV diuretic, vasodilator when appropriate"],
    ["Advanced heart failure", "advanced", "LVAD, transplant, palliative integration"],
    ["Examination traps", "revision", "Preserved EF, diuretics, BNP, CXR, beta-blockers, oxygen"],
    ["Clinical cases", "cases", "Twelve questions with explanations"]
  ];

  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchResults.hidden = true;
      searchResults.innerHTML = "";
      return;
    }
    const routeMatches = routeMeta.filter(item => `${item.title} ${item.summary} ${item.keywords}`.toLowerCase().includes(q)).map(item => ({ title: item.title, route: item.id, summary: item.summary }));
    const conceptMatches = searchConcepts.filter(item => item.join(" ").toLowerCase().includes(q)).map(item => ({ title: item[0], route: item[1], summary: item[2] }));
    const merged = [...routeMatches, ...conceptMatches].filter((item, index, list) => list.findIndex(other => other.title === item.title && other.route === item.route) === index).slice(0, 10);
    searchResults.innerHTML = merged.length ? merged.map((item, index) => `<button class="search-result" role="option" aria-selected="${index === 0}" data-route="${item.route}" type="button"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.summary)}</small></button>`).join("") : `<div class="search-empty">No chapter match found.</div>`;
    searchResults.hidden = false;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => { toast.hidden = true; }, 3000);
  }

  document.addEventListener("click", event => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) {
      event.preventDefault();
      navigate(routeButton.dataset.route);
      searchResults.hidden = true;
      searchInput.value = "";
    }
  });

  window.addEventListener("hashchange", () => renderRoute(currentRouteFromHash()));
  nav.addEventListener("click", event => {
    const button = event.target.closest("[data-route]");
    if (button) navigate(button.dataset.route);
  });

  menuButton.addEventListener("click", () => {
    const open = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", open);
    scrim.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
  });
  closeButton.addEventListener("click", closeSidebar);
  scrim.addEventListener("click", closeSidebar);

  searchInput.addEventListener("input", () => performSearch(searchInput.value));
  searchInput.addEventListener("keydown", event => {
    const items = [...searchResults.querySelectorAll(".search-result")];
    if (event.key === "Escape") { searchResults.hidden = true; searchInput.blur(); return; }
    if (!items.length) return;
    const current = Math.max(0, items.findIndex(item => item.getAttribute("aria-selected") === "true"));
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = event.key === "ArrowDown" ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
      items.forEach((item, i) => item.setAttribute("aria-selected", String(i === next)));
      items[next].scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const selected = items.find(item => item.getAttribute("aria-selected") === "true") || items[0];
      navigate(selected.dataset.route);
      searchResults.hidden = true;
      searchInput.value = "";
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  document.getElementById("print-button").addEventListener("click", () => window.print());
  document.getElementById("stop-speech").addEventListener("click", stopSpeech);
  speechRate.addEventListener("change", () => {
    localStorage.setItem("hf-studio-speech-rate", speechRate.value);
    if (activeSpeechButton) showToast(`Speech speed set to ${speechRate.options[speechRate.selectedIndex].text}. Restart the current block to apply.`);
  });

  document.getElementById("reset-progress").addEventListener("click", () => {
    localStorage.removeItem("hf-studio-visited");
    const visited = new Set([currentRouteFromHash()]);
    saveVisited(visited);
    progressLabel.textContent = `1 / ${routeIds.length}`;
    progressBar.style.width = `${100 / routeIds.length}%`;
    showToast("Progress reset.");
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener?.("voiceschanged", chooseVoice);
    chooseVoice();
    setTimeout(chooseVoice, 400);
    setTimeout(chooseVoice, 1200);
  } else {
    voiceStatus.textContent = "TTS unavailable";
    voicePill.classList.add("is-fallback");
  }

  const savedRate = localStorage.getItem("hf-studio-speech-rate");
  if (savedRate && [...speechRate.options].some(option => option.value === savedRate)) speechRate.value = savedRate;

  const initialRoute = currentRouteFromHash();
  if (!routeIds.includes(initialRoute)) window.location.hash = "overview";
  else renderRoute(initialRoute);
})();
