/* Heart Failure Lab content bank. */
(() => {
  "use strict";

  const section = (title, note = "") => `<div class="section-heading"><div><h2>${title}</h2>${note ? `<p>${note}</p>` : ""}</div></div>`;
  const card = (title, body, icon = "•") => `<article class="mini-card speech-unit"><span class="icon-badge">${icon}</span><h3>${title}</h3>${body}</article>`;
  const callout = (title, body, type = "info") => `<aside class="callout ${type} speech-unit"><h3>${title}</h3><p>${body}</p></aside>`;
  const table = (headers, rows) => `<div class="table-wrap speech-unit"><table><thead><tr>${headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const bullets = items => `<ul class="clean-list">${items.map(x=>`<li>${x}</li>`).join("")}</ul>`;
  const linkRow = items => `<div class="choice-row">${items.map(x=>`<button class="secondary-button" type="button" data-route="${x[0]}"><strong>${x[1]} →</strong></button>`).join("")}</div>`;

  const navGroups = [
    {title:"Foundations",items:[
      {id:"overview",label:"Overview & study map"},
      {id:"definition",label:"Definition & core model"},
      {id:"classification",label:"Phenotypes & EF"},
      {id:"stages-nyha",label:"Stages & NYHA class"},
      {id:"pathophysiology",label:"Pathophysiology"},
      {id:"etiology",label:"Etiology"},
      {id:"high-output",label:"High-output HF"}
    ]},
    {title:"Clinical reasoning",items:[
      {id:"clinical-picture",label:"Clinical presentation"},
      {id:"left-right",label:"Left vs right failure"},
      {id:"congestion-perfusion",label:"Congestion vs perfusion"},
      {id:"precipitants",label:"Decompensation triggers"},
      {id:"examination",label:"Focused examination"}
    ]},
    {title:"Diagnosis",items:[
      {id:"diagnostic-pathway",label:"Diagnostic pathway"},
      {id:"investigations",label:"Core investigations"},
      {id:"echo-biomarkers",label:"Echo & natriuretic peptides"},
      {id:"differential",label:"Differential diagnosis"}
    ]},
    {title:"Chronic management",items:[
      {id:"self-care",label:"Self-care & prevention"},
      {id:"four-pillars",label:"HFrEF four pillars"},
      {id:"hfpef-hfmref",label:"HFpEF & HFmrEF"},
      {id:"pharmacology",label:"Focused pharmacology"},
      {id:"devices-advanced",label:"Devices & advanced HF"}
    ]},
    {title:"Acute heart failure",items:[
      {id:"acute-overview",label:"Acute HF overview"},
      {id:"bedside-profiles",label:"Warm/cold, wet/dry"},
      {id:"acute-management",label:"Acute management"},
      {id:"shock",label:"Cardiogenic shock"}
    ]},
    {title:"Interactive revision",items:[
      {id:"phenotype-lab",label:"EF phenotype lab"},
      {id:"profile-lab",label:"Hemodynamic profile lab"},
      {id:"therapy-lab",label:"Therapy reasoning lab"},
      {id:"cases",label:"Clinical cases"},
      {id:"flashcards",label:"Flashcards"},
      {id:"quiz",label:"Scored quiz"},
      {id:"sources",label:"Sources & scope"}
    ]}
  ];

  const compensationSteps = [
    {title:"Effective output falls",body:"Cardiac injury, pressure or volume overload, impaired filling, rhythm disturbance, or right-sided disease lowers effective forward flow or raises filling pressure.",pearl:"The syndrome can occur with reduced, preserved, or improved ejection fraction."},
    {title:"Sympathetic activation",body:"Heart rate, contractility, and vasoconstriction rise to preserve blood pressure and perfusion of the brain and heart.",pearl:"Helpful for minutes to hours; harmful when persistent because oxygen demand, afterload, and arrhythmia risk rise."},
    {title:"RAAS and vasopressin activation",body:"Renin–angiotensin–aldosterone signaling and vasopressin retain sodium and water and support arterial pressure.",pearl:"The price is congestion, edema, fibrosis, potassium disturbance, and worsening ventricular loading."},
    {title:"Frank–Starling recruitment",body:"Greater end-diastolic fiber stretch can temporarily increase stroke volume.",pearl:"Beyond the useful range, dilatation raises wall stress and worsens functional mitral or tricuspid regurgitation."},
    {title:"Remodeling",body:"Hypertrophy, dilatation, fibrosis, altered geometry, cellular energy failure, and neurohormonal signaling change the ventricle over time.",pearl:"Disease-modifying therapy targets this biology rather than merely removing fluid."},
    {title:"Congestion and organ interaction",body:"High venous pressure and low perfusion affect kidneys, liver, lungs, gut, skeletal muscle, and cognition.",pearl:"A creatinine rise during decongestion must be interpreted with the whole clinical response, not in isolation."}
  ];

  const investigationData = [
    {title:"ECG",use:"Rhythm, conduction, ischemia or infarction, hypertrophy, QRS duration, and clues to etiology.",limit:"Frequently abnormal but rarely proves HF by itself; a completely normal ECG makes major systolic HF less likely."},
    {title:"Chest radiograph",use:"Cardiomegaly, pulmonary vascular redistribution, interstitial or alveolar edema, pleural effusion, and alternative lung disease.",limit:"A normal film does not exclude chronic compensated HF or early acute disease."},
    {title:"Transthoracic echocardiography",use:"LVEF, chamber size, wall motion, valves, RV function, pulmonary pressure estimates, filling indices, and pericardium.",limit:"Loading conditions and image quality matter; no single diastolic variable is sufficient."},
    {title:"BNP or NT-proBNP",use:"Supports or argues against HF in dyspnea, assists risk assessment, and adds evidence of raised filling stress.",limit:"Age, atrial fibrillation, renal dysfunction, obesity, timing, and treatment strongly affect interpretation."},
    {title:"Laboratory profile",use:"CBC, electrolytes, renal and liver function, glucose or HbA1c, lipids, TSH, iron studies, and selected tests for etiology.",limit:"Abnormalities may be cause, consequence, comorbidity, or treatment effect."},
    {title:"Troponin",use:"Detects myocardial injury and supports evaluation for acute coronary syndrome.",limit:"May rise in acute HF without plaque rupture or type 1 myocardial infarction."},
    {title:"Cardiac MRI",use:"Tissue characterization, scar, myocarditis, infiltrative disease, iron, and complex cardiomyopathy phenotyping.",limit:"Availability, devices, tolerance, and renal considerations can limit use."},
    {title:"Coronary assessment",use:"Defines ischemic cause and identifies revascularization targets when appropriate.",limit:"Choice of CT, stress imaging, or invasive angiography depends on stability and pre-test probability."},
    {title:"Invasive hemodynamics",use:"Measures filling pressures, cardiac output, pulmonary vascular resistance, and response when diagnosis or shock physiology is uncertain.",limit:"Invasive; most routine HF diagnoses do not require it."}
  ];

  const profiles = [
    {id:"warm-dry",title:"Warm–dry",perfusion:"Adequate",congestion:"Absent",priority:"Compensated or near-compensated profile. Optimize chronic therapy, cause, adherence, and follow-up.",clues:"Warm extremities, preserved mentation and urine output, no clear JVP rise, edema, or pulmonary congestion."},
    {id:"warm-wet",title:"Warm–wet",perfusion:"Adequate",congestion:"Present",priority:"Decongest, usually with IV loop diuretic in acute care; consider vasodilation when blood pressure is high and identify the precipitant.",clues:"Dyspnea, raised JVP, edema or crackles with adequate blood pressure and perfusion."},
    {id:"cold-dry",title:"Cold–dry",perfusion:"Reduced",congestion:"Absent or minimal",priority:"Reassess volume carefully. A cautious fluid challenge is only for true underfilling; otherwise investigate low output and consider specialist support.",clues:"Cool extremities, oliguria or confusion without convincing congestion."},
    {id:"cold-wet",title:"Cold–wet",perfusion:"Reduced",congestion:"Present",priority:"High-risk profile. Treat shock or its cause, support perfusion, and decongest cautiously with close monitoring and early specialist involvement.",clues:"Congestion plus cool skin, narrow pulse pressure, oliguria, altered mentation, or hypotension."}
  ];

  const pillarData = [
    {id:"arni",title:"ARNI or ACE inhibitor/ARB",benefit:"Reduces death and HF hospitalization and limits maladaptive RAAS signaling and remodeling.",start:"Use ARNI when suitable; ACE inhibitor or ARB when ARNI cannot be used.",monitor:"Blood pressure, kidney function, potassium, angioedema history. Never combine ARNI with an ACE inhibitor; observe the required washout.",trap:"Do not withhold solely because the patient is not yet at a target dose of another pillar."},
    {id:"beta",title:"Evidence-based beta-blocker",benefit:"Reduces mortality, sudden death, hospitalization, and promotes reverse remodeling.",start:"Begin at low dose when clinically stable and not in active shock or severe uncontrolled congestion.",monitor:"Heart rate, blood pressure, conduction disease, bronchospasm risk, and worsening congestion after initiation.",trap:"Use outcome-proven agents such as carvedilol, bisoprolol, or metoprolol succinate rather than assuming a class effect."},
    {id:"mra",title:"Mineralocorticoid receptor antagonist",benefit:"Reduces mortality and HF hospitalization while opposing aldosterone-mediated sodium retention and fibrosis.",start:"Add early when renal function and potassium permit.",monitor:"Potassium and kidney function soon after initiation and after dose changes.",trap:"Spironolactone may cause gynecomastia; eplerenone is more selective."},
    {id:"sglt2",title:"SGLT2 inhibitor",benefit:"Reduces HF events across EF ranges and provides cardiorenal benefit independent of glucose lowering.",start:"Usually simple once-daily initiation without titration in suitable patients.",monitor:"Volume status, renal trajectory, genital infection risk, and sick-day or perioperative withholding guidance.",trap:"Rare ketoacidosis can occur even with normal or mildly elevated glucose, particularly during fasting or severe illness."}
  ];

  const modules = {
    overview:{kicker:"Start here",title:"Heart Failure: the connected study lab",lead:"A physiology-first, guideline-aware pathway from syndrome recognition to chronic and acute management.",html:`
      <section class="hero speech-unit">
        <div class="hero-copy">
          <p class="eyebrow">Cardiology · Chapter 2</p>
          <h2>Understand the syndrome, then treat the phenotype and the patient.</h2>
          <p>Heart failure is not synonymous with a low ejection fraction. It is a clinical syndrome in which a cardiac abnormality produces symptoms or signs through raised filling pressures, inadequate output, or both. This lab connects mechanisms, bedside patterns, investigations, and treatment decisions.</p>
          <div class="choice-row"><button class="primary-button" data-route="definition" type="button">Begin foundations</button><button class="secondary-button" data-route="phenotype-lab" type="button"><strong>Open EF lab</strong></button></div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <svg class="hero-heart" viewBox="0 0 360 300">
            <defs><linearGradient id="hfGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c84b5f"/><stop offset="1" stop-color="#6f2545"/></linearGradient></defs>
            <g class="beat"><path d="M180 263C70 199 41 118 79 64c31-44 84-27 101 11 17-38 70-55 101-11 38 54 9 135-101 199Z" fill="url(#hfGrad)" opacity=".96"/><path d="M53 155h68l17-48 29 100 26-72 20 43h95" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>
          </svg>
        </div>
      </section>
      <section class="section-block">${section("What this website adds","The source chapter has been reorganized into an interconnected learning system rather than a sequence of static pages.")}
        <div class="card-grid">
          ${card("32 connected modules","<p>Move between definitions, mechanisms, bedside reasoning, diagnosis, therapy, acute care, and revision without losing the clinical thread.</p>","32")}
          ${card("Three reasoning laboratories","<p>Classify EF phenotype, identify warm/cold and wet/dry profiles, and build a rational therapy plan.</p>","Lab")}
          ${card("Active recall","<p>Progressive clinical cases, sectioned flip cards, a scored quiz, and a second study-hub deck with spaced review markers.</p>","Q")}
          ${card("TTS that pauses and continues","<p>Every small section has a Listen button. Tapping it again pauses; tapping once more resumes from the same speech position.</p>","TTS")}
          ${card("Offline and private","<p>No server is required. Progress, bookmarks, theme, notes, and quiz state remain in this browser only.</p>","OFF")}
          ${card("Accessible by design","<p>Keyboard navigation, visible focus, responsive layout, reduced-motion support, semantic controls, and print-friendly modules.</p>","a11y")}
        </div>
      </section>
      <section class="section-block">${section("Recommended route")}
        <div class="flow-row speech-unit"><div class="flow-node"><strong>1</strong><span>Define and classify</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>2</strong><span>Explain mechanism</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>3</strong><span>Recognize congestion and low output</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>4</strong><span>Confirm phenotype and cause</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>5</strong><span>Treat chronic or acute problem</span></div></div>
      </section>
      ${callout("Safety boundary","This is an educational revision tool, not a prescribing or emergency-care system. Acute pulmonary edema, syncope, severe hypoxemia, hypotension, shock, or new chest pain needs immediate clinical assessment.","danger")}
    `},

    definition:{kicker:"Foundations",title:"Definition and core model",lead:"Heart failure is a syndrome defined by clinical features plus objective cardiac evidence—not by EF alone.",html:`
      <section class="section-block">${section("A practical definition")}
        <div class="prose-card speech-unit"><p><strong>Heart failure</strong> is a clinical syndrome caused by a structural or functional cardiac abnormality that leads to elevated intracardiac filling pressures, inadequate cardiac output, or both, at rest or during stress. The diagnosis requires compatible symptoms or signs plus objective evidence of cardiac dysfunction or congestion.</p></div>
        ${callout("Do not diagnose from EF alone","A reduced EF supports systolic dysfunction but does not replace the clinical syndrome. A preserved EF does not exclude HF because filling pressure, relaxation, reserve, right-heart function, valves, rhythm, and pericardial constraint can be abnormal.","warning")}
      </section>
      <section class="section-block">${section("The three-question model")}
        <div class="card-grid">
          ${card("1. Is there a compatible syndrome?","<p>Dyspnea, orthopnea, edema, fatigue, reduced exercise tolerance, raised JVP, crackles, S3, or evidence of hypoperfusion.</p>","1")}
          ${card("2. Is the heart responsible?","<p>Objective evidence from echocardiography, natriuretic peptides, imaging, or hemodynamics should show a structural or functional abnormality or cardiogenic congestion.</p>","2")}
          ${card("3. What phenotype and cause?","<p>Reduced versus preserved systolic function, left versus right, acute versus chronic, low versus high output, and the responsible disease process.</p>","3")}
        </div>
      </section>
      <section class="section-block">${section("What HF is not")}
        ${table(["Finding","Why it is insufficient alone"],[
          ["Peripheral edema","May arise from venous insufficiency, renal disease, cirrhosis, drugs, or malnutrition."],
          ["Dyspnea","Also occurs in lung disease, anemia, obesity, deconditioning, pulmonary embolism, and anxiety."],
          ["Cardiomegaly","May reflect cardiomyopathy, athletic remodeling, or pericardial effusion."],
          ["Low EF","Can be asymptomatic pre-HF rather than clinical HF."],
          ["High BNP/NT-proBNP","Supports cardiac stress but is influenced by age, rhythm, kidneys, pulmonary pressure, and other conditions."]
        ])}
      </section>
      ${linkRow([["classification","Classify by phenotype"],["diagnostic-pathway","Build the diagnosis"]])}
    `},

    classification:{kicker:"Foundations",title:"Phenotypes and ejection fraction",lead:"Use EF as one axis of classification, then add time course, side, output, congestion, and perfusion.",html:`
      <section class="section-block">${section("Traditional guideline and examination categories")}
        ${table(["Phenotype","Traditional LVEF range","Interpretation"],[
          ["HFrEF","≤40%","Reduced EF; systolic ejection impairment is prominent."],
          ["HFmrEF","41–49%","Mildly reduced EF; often shares biology and treatment response with HFrEF."],
          ["HFpEF","≥50%","Preserved EF; raised filling pressure or structural/functional evidence is essential."],
          ["HFimpEF","Previously ≤40%, later >40%","Improved EF. Continue disease-modifying therapy because relapse may occur."]
        ])}
        ${callout("2026 terminology update","The 2026 Second Universal Definition moves away from rigid EF cutoffs and emphasizes clinically actionable reduced, preserved, and improved EF groups, recognizing variation by sex, age, ethnicity, method, and measurement uncertainty. Traditional cutoffs remain important for current trials, guidelines, examinations, and treatment evidence, so this lab shows both frameworks.","info")}
      </section>
      <section class="section-block">${section("Add the other axes")}
        ${table(["Axis","Categories","Why it matters"],[
          ["Time course","Acute, chronic, acute-on-chronic","Determines urgency and stabilization."],
          ["Dominant side","Left, right, biventricular","Predicts pulmonary versus systemic venous congestion."],
          ["Output","Low output, high output","Clarifies the hemodynamic mechanism."],
          ["Clinical visibility","At risk, pre-HF, symptomatic, advanced","Separates structural disease from the symptomatic syndrome."],
          ["Bedside profile","Warm–dry, warm–wet, cold–dry, cold–wet","Guides acute priorities."],
          ["Trajectory","Improvement, remission, recovery, deterioration","A higher EF does not automatically mean cure."]
        ])}
      </section>
      <section class="section-block">${section("EF formula and limitation")}
        <div class="formula-card speech-unit"><span>Ejection fraction</span><strong>(EDV − ESV) ÷ EDV × 100</strong><p>EF is the proportion of end-diastolic ventricular volume ejected per beat. It does not directly equal stroke volume, cardiac output, contractile reserve, or filling pressure.</p></div>
      </section>
      ${linkRow([["phenotype-lab","Try the EF phenotype lab"],["stages-nyha","Stage the patient"]])}
    `},

    "stages-nyha":{kicker:"Foundations",title:"ACC/AHA stages and NYHA functional class",lead:"Stage describes disease progression; NYHA class describes current limitation.",html:`
      <section class="section-block">${section("ACC/AHA stages")}
        ${table(["Stage","Meaning","Typical focus"],[
          ["A — At risk","Risk factors without symptoms, structural heart disease, or biomarker evidence of myocardial injury.","Prevent HF: blood pressure, diabetes, obesity, atherosclerosis, cardiotoxic exposure."],
          ["B — Pre-HF","No symptoms, but structural disease, abnormal filling pressure, or elevated biomarkers are present.","Prevent progression and treat the underlying cardiac abnormality."],
          ["C — Symptomatic HF","Current or previous symptoms attributable to structural heart disease.","Guideline-directed therapy, self-care, devices when indicated, and prevention of hospitalization."],
          ["D — Advanced HF","Severe symptoms or recurrent decompensation despite attempts to optimize therapy.","HF specialist, advanced therapy, and palliative/supportive integration."]
        ])}
      </section>
      <section class="section-block">${section("NYHA functional class")}
        ${table(["Class","Functional limitation"],[
          ["I","No limitation of ordinary physical activity."],
          ["II","Slight limitation; comfortable at rest, but ordinary activity causes symptoms."],
          ["III","Marked limitation; less-than-ordinary activity causes symptoms, but the patient is comfortable at rest."],
          ["IV","Symptoms at rest or inability to perform physical activity without discomfort."]
        ])}
        ${callout("Do not interchange them","A person can improve from NYHA III to II while remaining Stage C. The stage does not move backward simply because symptoms improve.","warning")}
      </section>
      <section class="section-block">${section("Exam reasoning")}
        <div class="card-grid">
          ${card("Structural disease, no symptoms","<p>Think <strong>Stage B</strong>, even when EF is reduced.</p>","B")}
          ${card("Previous symptoms, now asymptomatic","<p>Still <strong>Stage C</strong>; the syndrome has occurred before.</p>","C")}
          ${card("Current symptoms at rest","<p>NYHA IV, but Stage D only when advanced features persist despite optimized care.</p>","IV")}
        </div>
      </section>
    `},

    pathophysiology:{kicker:"Foundations",title:"Pathophysiology: helpful first, harmful later",lead:"Compensation supports circulation in the short term but drives congestion, remodeling, and organ dysfunction when persistent.",html:`
      <section class="section-block">${section("Walk through the cascade","Select each step to connect trigger, adaptation, and long-term cost.")}
        <div class="interactive-split"><div class="sequence-list" id="compensation-list"></div><div class="output-panel speech-unit" id="compensation-output"></div></div>
      </section>
      <section class="section-block">${section("Pressure versus volume loading")}
        ${table(["Load","Initial adaptation","Long-term consequence"],[
          ["Pressure overload","Concentric hypertrophy helps normalize wall stress.","Stiffness, ischemia, fibrosis, diastolic dysfunction, and eventual systolic failure."],
          ["Volume overload","Dilatation and eccentric remodeling accommodate larger volume.","Higher wall stress, chamber enlargement, functional regurgitation, and reduced mechanical efficiency."],
          ["Persistent tachycardia","Maintains minute output initially.","Shorter filling time, oxygen demand, calcium-handling disturbance, and tachycardia-mediated cardiomyopathy."],
          ["High venous pressure","Preserves filling in some settings.","Renal and hepatic congestion, gut edema, diuretic resistance, ascites, and impaired organ function."]
        ])}
      </section>
      <section class="section-block">${section("Systolic and diastolic failure are not opposites")}
        <div class="card-grid">
          ${card("HFrEF","<p>Reduced ejection is prominent, but filling pressure, relaxation, valve function, and RV function also matter.</p>","↓EF")}
          ${card("HFpEF","<p>Relaxation, stiffness, ventricular–arterial coupling, chronotropic reserve, pulmonary vascular function, and systemic comorbidity interact.</p>","↔EF")}
          ${card("Right HF","<p>RV pressure or volume overload reduces LV filling and causes systemic venous congestion; clear lungs do not exclude severe disease.</p>","RV")}
        </div>
      </section>
    `},

    etiology:{kicker:"Foundations",title:"Etiology: find the driver",lead:"Etiology changes treatment, prognosis, family screening, and reversibility.",html:`
      <section class="section-block">${section("Common causes of HFrEF")}
        ${table(["Mechanism","Representative causes"],[
          ["Myocardial loss or injury","Ischemic heart disease or MI, myocarditis, cardiotoxic therapy, genetic or idiopathic dilated cardiomyopathy, infiltrative disease."],
          ["Pressure overload","Long-standing hypertension, aortic stenosis, coarctation."],
          ["Volume overload","Mitral or aortic regurgitation, VSD, PDA, other major shunts."],
          ["Rhythm-mediated","Atrial fibrillation with rapid response, incessant SVT, frequent ventricular ectopy, severe bradycardia or conduction disease."],
          ["Peripartum or stress-related","Peripartum cardiomyopathy, stress cardiomyopathy, inflammatory or endocrine triggers."],
          ["Toxic or metabolic","Alcohol, stimulants, selected chemotherapy, severe endocrine or nutritional disease."]
        ])}
      </section>
      <section class="section-block">${section("Common causes and substrates of HFpEF")}
        <div class="card-grid">
          ${card("Hypertensive remodeling","<p>Long-standing pressure load causes LV hypertrophy, impaired relaxation, and left-atrial enlargement.</p>","BP")}
          ${card("Cardiometabolic phenotype","<p>Older age, visceral adiposity, diabetes, chronic kidney disease, inflammation, and sedentary physiology interact.</p>","CKM")}
          ${card("Rhythm and atrial disease","<p>Atrial fibrillation removes atrial contribution to filling and can worsen rate, pressure, and functional capacity.</p>","AF")}
          ${card("Specific cardiac disease","<p>Aortic stenosis, hypertrophic or restrictive cardiomyopathy, amyloidosis, pericardial constriction, and ischemic scar.</p>","Dx")}
        </div>
      </section>
      <section class="section-block">${section("Right ventricular failure mechanisms")}
        ${bullets(["Pulmonary hypertension from left-heart, lung, thromboembolic, or pulmonary vascular disease.","Acute pulmonary embolism or right ventricular infarction.","Right-sided valve disease, congenital disease, or postoperative RV dysfunction.","Severe left-sided HF causing secondary pulmonary hypertension and RV failure—the most common pathway."])}
      </section>
      ${callout("Etiology-first habit","Whenever HF worsens, ask whether the primary disease has changed: ischemia, valve failure, rhythm, infection, pulmonary embolism, hypertension, renal deterioration, toxin, endocrine disease, or medication effect.","info")}
    `},

    "high-output":{kicker:"Foundations",title:"High-output heart failure",lead:"Cardiac output can be elevated yet still be inadequate for abnormal demand or low systemic resistance.",html:`
      <section class="section-block">${section("Core mechanism")}
        <div class="prose-card speech-unit"><p>In high-output HF, systemic vascular resistance is low or metabolic demand is unusually high. The circulation responds with increased heart rate, stroke volume, plasma volume, and venous return. Sustained workload eventually produces chamber dilatation, elevated filling pressure, and congestion.</p></div>
      </section>
      <section class="section-block">${section("Important causes")}
        ${table(["Cause","Mechanism"],[
          ["Severe anemia","Reduced oxygen-carrying capacity requires higher flow to deliver oxygen."],
          ["Thyrotoxicosis","Raises metabolic demand, heart rate, and contractility while lowering vascular resistance."],
          ["Wet beriberi","Thiamine deficiency causes vasodilation and impaired myocardial energy metabolism."],
          ["Large AV fistula","Creates a low-resistance shunt, markedly increasing venous return and workload."],
          ["Advanced liver disease","Vasodilation and expanded plasma volume drive a hyperdynamic state."],
          ["Severe obesity","Expanded blood volume, higher metabolic demand, sleep-disordered breathing, and cardiometabolic dysfunction contribute."],
          ["Paget disease or rare vascular states","Extensive vascular beds or shunts can reduce systemic resistance."]
        ])}
      </section>
      <section class="section-block">${section("Clinical clue")}
        ${callout("Warm does not always mean well","High-output states may present with warm extremities, bounding pulses, and wide pulse pressure despite congestion. Treat the cause; simply applying a standard low-output model misses the physiology.","warning")}
      </section>
    `},

    "clinical-picture":{kicker:"Clinical reasoning",title:"Clinical presentation",lead:"Recognize the pattern produced by congestion, hypoperfusion, and neurohormonal activation.",html:`
      <section class="section-block">${section("Symptoms by mechanism")}
        ${table(["Mechanism","Symptoms","Signs"],[
          ["Pulmonary congestion","Exertional dyspnea, orthopnea, paroxysmal nocturnal dyspnea, cough, reduced exercise tolerance.","Crackles, hypoxemia, pleural effusion, pulmonary edema."],
          ["Systemic venous congestion","Leg swelling, abdominal fullness, early satiety, weight gain, nausea.","Raised JVP, hepatojugular reflux, edema, hepatomegaly, ascites."],
          ["Low output or hypoperfusion","Fatigue, dizziness, confusion, reduced urine output, weakness.","Cool clammy skin, weak pulse, narrow pulse pressure, oliguria, altered mentation."],
          ["Neurohormonal activation","Palpitations, sweating, anxiety, thirst.","Tachycardia, vasoconstriction, pallor, diaphoresis."],
          ["Chronic systemic effects","Muscle wasting, poor appetite, sleep disturbance, cognitive decline.","Cachexia, frailty, renal or hepatic dysfunction."]
        ])}
      </section>
      <section class="section-block">${section("High-yield symptom meanings")}
        <div class="card-grid">
          ${card("Orthopnea","<p>Breathlessness when supine from increased venous return, elevated pulmonary venous pressure, and reduced lung volume.</p>","↘")}
          ${card("PND","<p>Sudden nocturnal dyspnea that wakes the patient after sleep; more specific than simple exertional dyspnea.</p>","Night")}
          ${card("Bendopnea","<p>Dyspnea while bending forward can reflect limited reserve and high filling pressure, but is not diagnostic alone.</p>","B")}
          ${card("Rapid weight gain","<p>Suggests fluid retention when it accompanies worsening symptoms; compare with a reliable baseline and clinical examination.</p>","kg")}
        </div>
      </section>
      ${callout("Pattern recognition, not one sign","The strongest bedside impression comes from combining symptoms, JVP, edema, crackles, heart sounds, blood pressure, pulse pressure, perfusion, rhythm, and the likely cause.","info")}
    `},

    "left-right":{kicker:"Clinical reasoning",title:"Left-sided versus right-sided failure",lead:"The dominant side predicts where pressure backs up, but biventricular interaction is common.",html:`
      <section class="section-block">${section("Compare the dominant patterns")}
        ${table(["Feature","Left-sided dominant","Right-sided dominant"],[
          ["Main congestion bed","Pulmonary veins and lungs","Systemic veins and abdominal organs"],
          ["Typical symptoms","Dyspnea, orthopnea, PND, cough","Edema, abdominal fullness, early satiety, discomfort"],
          ["Key signs","Crackles, pulmonary edema, S3, displaced apex","Raised JVP, hepatojugular reflux, edema, hepatomegaly, ascites"],
          ["Functional regurgitation","Mitral regurgitation may occur","Tricuspid regurgitation may occur; louder with inspiration"],
          ["Common causes","IHD, hypertension, valve disease, cardiomyopathy","Most often left HF; also pulmonary hypertension, PE, RV infarction, right valve disease"]
        ])}
      </section>
      <section class="section-block">${section("Why right HF can reduce systemic output")}
        <div class="prose-card speech-unit"><p>When the RV fails, forward flow through the lungs falls, LV preload decreases, interventricular septal shift can impair LV filling, and systemic venous pressure rises. The patient may have profound low output and renal congestion even when the lungs are relatively clear.</p></div>
      </section>
      ${callout("Kussmaul sign","A paradoxical rise or failure of the JVP to fall with inspiration suggests impaired right-sided filling, as in constriction, restrictive physiology, RV infarction, or severe RV failure. It is not a universal sign of right HF.","warning")}
    `},

    "congestion-perfusion":{kicker:"Clinical reasoning",title:"Congestion versus hypoperfusion",lead:"Separate filling-pressure overload from inadequate tissue flow; the treatments are not interchangeable.",html:`
      <section class="section-block">${section("Two bedside questions")}
        <div class="card-grid">
          ${card("Is the patient wet?","<p>Look for raised JVP, orthopnea, crackles, edema, ascites, hepatomegaly, pleural effusion, and recent fluid weight gain.</p>","Wet")}
          ${card("Is the patient cold?","<p>Look for cool skin, weak pulse, narrow pulse pressure, oliguria, altered mentation, rising lactate, and worsening organ function.</p>","Cold")}
        </div>
      </section>
      <section class="section-block">${section("Why this matters")}
        ${table(["Problem","Primary objective","Common mistake"],[
          ["Congestion with adequate perfusion","Remove excess sodium and water; vasodilate when appropriate and blood pressure allows.","Using inotropes for uncomplicated edema."],
          ["Hypoperfusion without congestion","Define true underfilling versus intrinsic low output and support the cause.","Giving repeated fluid without reassessment."],
          ["Congestion plus hypoperfusion","Treat as high risk: support perfusion while decongesting cautiously and addressing shock.","Focusing on creatinine alone while organ perfusion and congestion worsen."],
          ["No congestion or hypoperfusion","Optimize chronic therapy and prevention.","Over-diuresis or unnecessary acute interventions."]
        ])}
      </section>
      ${linkRow([["bedside-profiles","Study the four profiles"],["profile-lab","Classify an example"]])}
    `},

    precipitants:{kicker:"Clinical reasoning",title:"Precipitating factors for decompensation",lead:"A worsening patient needs treatment of the trigger as well as treatment of congestion.",html:`
      <section class="section-block">${section("Search systematically")}
        ${table(["Category","Examples","Clue"],[
          ["Ischemic or structural","ACS, acute valve regurgitation, mechanical MI complication, aortic syndrome.","Chest pain, new murmur, shock, regional wall-motion change."],
          ["Rhythm","AF, SVT, VT, severe bradycardia, heart block.","Palpitations, pulse irregularity, ECG change."],
          ["Pressure or volume stress","Uncontrolled hypertension, excessive sodium or fluid, renal deterioration.","High BP, weight gain, medication or diet change."],
          ["Infection or inflammation","Pneumonia, sepsis, infective endocarditis, viral illness.","Fever, cough, leukocytosis, inflammatory signs."],
          ["Medication related","Nonadherence, NSAIDs, corticosteroids, selected calcium-channel blockers in HFrEF, cardiotoxic therapy.","Recent prescription change or missed medicines."],
          ["Systemic stress","Anemia, thyroid disease, pregnancy, PE, COPD exacerbation, uncontrolled diabetes.","Cause-specific symptoms and laboratory findings."]
        ])}
      </section>
      <section class="section-block">${section("A memorable checklist")}
        <div class="prose-card speech-unit"><p><strong>CHAMPIT</strong> is a useful prompt in acute HF: <strong>C</strong>oronary syndrome, <strong>H</strong>ypertensive emergency, <strong>A</strong>rrhythmia, acute <strong>M</strong>echanical cause, <strong>P</strong>ulmonary embolism, <strong>I</strong>nfection, and <strong>T</strong>amponade. Add adherence, renal deterioration, drugs, anemia, and thyroid disease.</p></div>
      </section>
    `},

    examination:{kicker:"Clinical reasoning",title:"Focused heart-failure examination",lead:"Examine for severity, congestion, perfusion, cause, and complications—not merely for edema.",html:`
      <section class="section-block">${section("Rapid sequence")}
        <ol class="step-list speech-unit">
          <li><strong>First impression:</strong> distress, posture, speech, cyanosis, diaphoresis, mental state, respiratory rate.</li>
          <li><strong>Vitals and perfusion:</strong> oxygen saturation, blood pressure, pulse rhythm and volume, temperature gradient, capillary refill, urine output.</li>
          <li><strong>Neck veins:</strong> JVP height and waveform, hepatojugular reflux, Kussmaul response when relevant.</li>
          <li><strong>Precordium:</strong> displaced apex, RV heave, S3 or S4, murmurs, prosthetic sounds, device scars.</li>
          <li><strong>Lungs:</strong> crackles, reduced breath sounds or effusion, wheeze, respiratory fatigue.</li>
          <li><strong>Systemic congestion:</strong> edema distribution, hepatomegaly, tenderness, ascites, sacral edema.</li>
          <li><strong>Etiology and comorbidity:</strong> ischemia, valve disease, thyroid signs, anemia, infection, lung disease, peripheral vascular disease.</li>
        </ol>
      </section>
      <section class="section-block">${section("Heart sounds")}
        ${table(["Finding","Meaning","Caution"],[
          ["S3","Rapid early filling into a dilated or volume-loaded ventricle; supports elevated filling pressure in the right context.","Can be physiological in younger people and pregnancy."],
          ["S4","Atrial contraction into a stiff ventricle; suggests reduced compliance.","Absent in atrial fibrillation because organized atrial contraction is lost."],
          ["Pulsus alternans","Alternating strong and weak pulse amplitude with a regular rhythm.","Suggests severe LV systolic dysfunction but is not common."],
          ["Functional MR or TR","Ventricular or annular remodeling causes regurgitation.","Murmur intensity may fall in low-output states."]
        ])}
      </section>
      ${callout("JVP is central","JVP often integrates right-atrial pressure, congestion, and waveform information better than ankle edema. Measure it with the patient reclined and use the internal jugular venous pulsation rather than the carotid pulse.","info")}
    `},

    "diagnostic-pathway":{kicker:"Diagnosis",title:"A practical diagnostic pathway",lead:"Confirm the syndrome, define urgency, then determine phenotype, cause, severity, and comorbidity.",html:`
      <section class="section-block">${section("Stepwise sequence")}
        <div class="flow-row speech-unit"><div class="flow-node"><strong>1</strong><span>Compatible symptoms or signs</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>2</strong><span>Urgency and alternative diagnoses</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>3</strong><span>ECG + natriuretic peptide</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>4</strong><span>Echocardiography</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>5</strong><span>Cause, severity, comorbidity</span></div></div>
      </section>
      <section class="section-block">${section("Clinical questions at each step")}
        ${table(["Step","Question","Action"],[
          ["Urgency","Is there shock, respiratory failure, ACS, dangerous arrhythmia, or acute mechanical disease?","Stabilize and investigate simultaneously."],
          ["Probability","Does history and examination fit HF better than pulmonary or systemic alternatives?","Use ECG, imaging, and natriuretic peptides to refine probability."],
          ["Objective evidence","Is there ventricular, valve, rhythm, pericardial, or hemodynamic abnormality?","Perform echocardiography; use advanced imaging or invasive testing selectively."],
          ["Phenotype","Reduced, preserved, improved EF; left, right, high output; acute or chronic?","Choose phenotype-specific management and monitoring."],
          ["Etiology","Ischemic, hypertensive, valvular, myocardial, rhythm, infiltrative, congenital, toxic?","Treat cause and consider family or specialist evaluation."],
          ["Severity","NYHA class, congestion, perfusion, renal and hepatic impact, repeated admissions?","Plan follow-up, devices, or advanced-HF referral."]
        ])}
      </section>
      ${callout("Low natriuretic peptide","A low level argues against HF in many settings, but obesity, very early presentation, and some flash pulmonary edema cases can produce unexpectedly low values. Never interpret it without context.","warning")}
    `},

    investigations:{kicker:"Diagnosis",title:"Core investigations",lead:"Each test answers a different question; none replaces clinical reasoning.",html:`
      <section class="section-block">${section("Choose a test","Select an investigation to see its contribution and limitation.")}
        <div class="interactive-split"><div class="sequence-list" id="investigation-list"></div><div class="output-panel speech-unit" id="investigation-output"></div></div>
      </section>
      <section class="section-block">${section("Baseline laboratory set")}
        <div class="card-grid">
          ${card("CBC","<p>Anemia may worsen symptoms; leukocytosis may suggest infection. Hemoconcentration can accompany effective decongestion.</p>","CBC")}
          ${card("Renal function and electrolytes","<p>Guide diuresis and RAAS/MRA therapy. Interpret change against volume status, perfusion, and treatment response.</p>","K+")}
          ${card("Liver profile","<p>Congestion and low output can cause cholestatic or hepatocellular abnormalities.</p>","LFT")}
          ${card("TSH and metabolic profile","<p>Find reversible triggers and major comorbidity: thyroid disease, diabetes, and dyslipidemia.</p>","TSH")}
          ${card("Iron studies","<p>Ferritin plus transferrin saturation identify iron deficiency relevant to symptoms and selected IV iron strategies.</p>","Fe")}
          ${card("Urinalysis and protein assessment","<p>Help define kidney disease, diabetic nephropathy, and alternative edema mechanisms.</p>","Renal")}
        </div>
      </section>
    `},

    "echo-biomarkers":{kicker:"Diagnosis",title:"Echocardiography and natriuretic peptides",lead:"Echo defines structure and function; BNP or NT-proBNP reflects wall stress but must be contextualized.",html:`
      <section class="section-block">${section("What echocardiography should answer")}
        ${table(["Domain","Examples","Clinical meaning"],[
          ["LV systolic function","EF, volumes, global and regional motion","HFrEF phenotype, ischemic pattern, remodeling."],
          ["Diastolic function","Mitral inflow, tissue Doppler, LA volume, TR velocity, filling estimates","Integrated evidence of impaired relaxation and raised filling pressure."],
          ["Right heart","RV size and function, TAPSE, S-prime, fractional area change","Prognosis and RV-dominant disease."],
          ["Valves","Stenosis or regurgitation mechanism and severity","May be cause, consequence, or treatment target."],
          ["Pulmonary pressure","Estimated from TR velocity and other signs","Raises concern for pulmonary hypertension and RV load."],
          ["Pericardium and IVC","Effusion, constrictive clues, venous pressure estimate","Alternative or contributing pathology."]
        ])}
      </section>
      <section class="section-block">${section("BNP and NT-proBNP context explorer")}
        <div class="tool-panel speech-unit" id="bnp-lab">
          <p>Select factors present in a hypothetical patient, then interpret direction—not a diagnostic cutoff.</p>
          <div class="check-grid">
            <label><input type="checkbox" value="age"> Older age</label><label><input type="checkbox" value="renal"> Renal dysfunction</label><label><input type="checkbox" value="af"> Atrial fibrillation</label><label><input type="checkbox" value="ph"> Pulmonary hypertension</label><label><input type="checkbox" value="obesity"> Obesity</label><label><input type="checkbox" value="early"> Very early presentation</label><label><input type="checkbox" value="treated"> Successful decongestion</label>
          </div><div class="tool-result" id="bnp-result">Select factors to see how they can shift the value.</div>
        </div>
      </section>
      ${callout("Integrated diagnosis","In HF with EF above 40%, evidence of increased filling pressure becomes especially important. Combine symptoms, examination, natriuretic peptide, structural findings, diastolic indices, and functional or invasive testing when uncertainty remains.","info")}
    `},

    differential:{kicker:"Diagnosis",title:"Differential diagnosis",lead:"Test the heart-failure hypothesis against pulmonary, renal, hepatic, vascular, and systemic alternatives.",html:`
      <section class="section-block">${section("Presenting problem to alternatives")}
        ${table(["Presentation","Important alternatives","Discriminating direction"],[
          ["Dyspnea or orthopnea","COPD, asthma, pneumonia, PE, obesity, anemia, deconditioning, neuromuscular disease, anxiety.","Lung examination and imaging, spirometry, D-dimer/CTPA when indicated, CBC, exercise pattern."],
          ["Peripheral edema or ascites","Cirrhosis, nephrotic syndrome, CKD, venous insufficiency, drugs, malnutrition.","JVP, albumin, urine protein, liver profile, venous pattern, medication review."],
          ["Raised JVP","Tamponade, constriction, pulmonary hypertension, massive PE, severe TR.","Waveform, pulsus paradoxus, echo, respiratory response, RV findings."],
          ["Cardiomegaly","Pericardial effusion, cardiomyopathy, athletic remodeling.","Echocardiography distinguishes chamber enlargement from fluid."],
          ["Fatigue or low output","Anemia, endocrine disease, infection, medication effect, autonomic disorder.","CBC, TSH, clinical context, perfusion and cardiac objective evidence."]
        ])}
      </section>
      <section class="section-block">${section("HFpEF mimics deserve special attention")}
        <div class="card-grid">
          ${card("Infiltrative cardiomyopathy","<p>Amyloidosis and other infiltrative disease require targeted imaging and laboratory pathways.</p>","Amy")}
          ${card("Hypertrophic cardiomyopathy","<p>Dynamic obstruction and phenotype-specific therapy change management.</p>","HCM")}
          ${card("Valve or pericardial disease","<p>Preserved EF does not make the problem primary HFpEF if a dominant structural cause explains the syndrome.</p>","Valve")}
          ${card("Noncardiac edema","<p>Kidney, liver, venous, and medication causes can coexist with or mimic HFpEF.</p>","Mimic")}
        </div>
      </section>
    `},

    "self-care":{kicker:"Chronic management",title:"Self-care, prevention, and non-pharmacological treatment",lead:"Good HF care combines disease-modifying therapy with daily monitoring, rehabilitation, vaccination, and comorbidity control.",html:`
      <section class="section-block">${section("Core domains")}
        ${table(["Domain","Practical approach"],[
          ["Education and monitoring","Recognize worsening dyspnea, edema, rapid weight gain, dizziness, reduced urine output, and medication problems; use an agreed action plan."],
          ["Physical activity","Individualized exercise or cardiac rehabilitation when stable; avoid routine prolonged bed rest."],
          ["Sodium and fluid","Avoid excessive sodium. Fluid restriction is selective, commonly for severe congestion or hyponatremia rather than every stable patient."],
          ["Nutrition and body composition","Address obesity, cachexia, iron deficiency, alcohol excess, and malnutrition."],
          ["Vaccination","Use influenza, pneumococcal, COVID-19, and other vaccines according to current local recommendations."],
          ["Medication safety","Avoid NSAIDs when possible; review drugs that worsen retention, blood pressure, rhythm, conduction, or contractility."],
          ["Sleep and comorbidity","Treat hypertension, diabetes, kidney disease, AF, ischemia, sleep apnea, lung disease, and valve disease."],
          ["Psychosocial care","Assess depression, cognition, affordability, caregiver burden, adherence barriers, and goals of care."]
        ])}
      </section>
      <section class="section-block">${section("Daily weight: useful, not absolute")}
        <div class="prose-card speech-unit"><p>Daily weight can detect fluid accumulation when measured consistently, but symptoms, JVP, edema, urine output, diuretic response, and blood pressure matter too. A fixed universal number should not replace the patient-specific action plan.</p></div>
      </section>
      ${callout("Prevention starts before symptoms","Stage A and B care—blood-pressure control, diabetes and kidney protection, ischemic prevention, avoidance of cardiotoxins, and treatment of structural disease—can delay or prevent symptomatic HF.","success")}
    `},

    "four-pillars":{kicker:"Chronic management",title:"The four foundational therapies for HFrEF",lead:"Modern HFrEF care introduces complementary drug classes early rather than climbing a slow single-drug ladder.",html:`
      <section class="section-block">${section("Why four pillars")}
        <div class="prose-card speech-unit"><p>ARNI or ACE inhibitor/ARB, an evidence-based beta-blocker, an MRA, and an SGLT2 inhibitor act through different pathways. Current practical guidance favors early initiation at low tolerated doses and progression toward maximally tolerated therapy, often within the first few months, while monitoring blood pressure, kidney function, potassium, heart rate, volume status, and adherence.</p></div>
      </section>
      <section class="section-block">${section("Explore each pillar")}
        <div class="interactive-split"><div class="sequence-list" id="pillar-list"></div><div class="output-panel speech-unit" id="pillar-output"></div></div>
      </section>
      <section class="section-block">${section("What diuretics do—and do not do")}
        ${callout("Symptom relief versus disease modification","Loop diuretics are essential for congestion and euvolemia. They are not a substitute for the four disease-modifying pillars, and the lowest effective maintenance dose is usually sought after decongestion.","warning")}
      </section>
      <section class="section-block">${section("Selected add-on therapies")}
        ${table(["Therapy","When considered"],[
          ["Hydralazine plus nitrate","When RAAS-modifying therapy cannot be used, or as an evidence-based add-on in selected populations with persistent symptoms."],
          ["Ivabradine","Sinus rhythm with persistent elevated heart rate despite maximally tolerated beta-blocker when criteria are met."],
          ["Digoxin","Selected persistent symptoms or AF rate control; reduces hospitalization more than mortality."],
          ["IV iron","Symptomatic HF with documented iron deficiency when guideline criteria are met."],
          ["Anticoagulation","AF, VTE, mechanical valve, intracardiac thrombus, or another established indication—not HF alone."],
          ["Revascularization or valve intervention","When ischemia or structural valve disease is a major driver."]
        ])}
      </section>
    `},

    "hfpef-hfmref":{kicker:"Chronic management",title:"HFmrEF and HFpEF",lead:"Confirm the diagnosis, decongest, treat comorbidities, and use evidence-based phenotype-directed therapy.",html:`
      <section class="section-block">${section("The management framework")}
        <div class="card-grid">
          ${card("Confirm true HF","<p>Preserved EF alone is not enough. Establish symptoms or signs plus elevated filling stress or structural/functional evidence and exclude mimics.</p>","1")}
          ${card("Remove congestion","<p>Use diuretics for fluid overload while avoiding unnecessary preload depletion.</p>","2")}
          ${card("Treat comorbid drivers","<p>Hypertension, obesity, diabetes, CKD, AF, ischemia, sleep apnea, valve disease, and iron deficiency often determine symptoms and outcome.</p>","3")}
          ${card("Add disease-modifying therapy","<p>SGLT2 inhibitors have the broadest established event-reduction evidence across mildly reduced and preserved EF; selected RAAS/MRA strategies depend on phenotype and current guidance.</p>","4")}
        </div>
      </section>
      <section class="section-block">${section("2026 HFpEF update: a multisystem phenotype")}
        <div class="prose-card speech-unit"><p>The 2026 ACC expert pathway emphasizes HFpEF as a heterogeneous cardiovascular–kidney–metabolic syndrome, often driven by visceral adiposity, inflammatory and metabolic dysfunction, and distinct phenotypes. It highlights SGLT2 inhibitors, emerging evidence for nonsteroidal MRA therapy, and incretin-based strategies in appropriate cardiometabolic phenotypes, alongside comprehensive management of obesity, diabetes, CKD, hypertension, AF, and coronary disease.</p></div>
        ${callout("Rapidly evolving area","The 2026 pathway was published after the supplied PDF. This website flags the direction of the update but deliberately avoids acting as a prescribing algorithm for newly incorporated therapies. Use the current full guideline, regulatory labeling, and specialist judgment.","warning")}
      </section>
      <section class="section-block">${section("HFmrEF")}
        <div class="prose-card speech-unit"><p>HFmrEF often behaves as a transition zone. SGLT2 inhibitors are strongly supported, and therapies effective in HFrEF may be considered particularly toward the lower EF range, with prior reduced EF, or with recurrent hospitalization, depending on the individual profile.</p></div>
      </section>
      ${callout("HFimpEF","When EF improves after HFrEF treatment, continue disease-modifying therapy unless a specialist identifies a compelling reason otherwise. Improvement may be remission rather than cure.","success")}
    `},

    pharmacology:{kicker:"Chronic management",title:"Focused pharmacology",lead:"Know role, mechanism, monitoring, and high-yield hazards rather than memorizing drug names alone.",html:`
      <section class="section-block">${section("Diuretics")}
        ${table(["Class","Examples","Role","Major adverse effects"],[
          ["Loop","Furosemide, bumetanide, torsemide","Most effective for significant congestion.","Hypovolemia, kidney dysfunction, hypo-K, hypo-Na, hypo-Mg, metabolic alkalosis, ototoxicity at high exposure."],
          ["Thiazide or thiazide-like","Hydrochlorothiazide, metolazone, chlorthalidone","Sequential nephron blockade in resistant edema.","Hyponatremia, hypokalemia, hyperuricemia, hyperglycemia."],
          ["MRA","Spironolactone, eplerenone","Weak diuresis but major neurohormonal benefit in HFrEF.","Hyperkalemia, kidney dysfunction; gynecomastia with spironolactone."]
        ])}
        ${callout("Diuretic resistance","Check adherence, dose delivery, renal perfusion, venous and gut congestion, NSAIDs, sodium intake, and the diagnosis. Options include IV loop therapy, higher or more frequent dosing, and carefully monitored sequential blockade.","warning")}
      </section>
      <section class="section-block">${section("Digoxin")}
        ${table(["Area","High-yield point"],[
          ["Mechanism","Inhibits Na+/K+-ATPase, indirectly increases intracellular calcium, raises vagal tone, and slows AV nodal conduction."],
          ["Selective role","Persistent symptomatic HFrEF despite optimized therapy or selected AF rate control; not a foundational mortality-reducing drug."],
          ["Expected ECG effect","PR prolongation, shortened QT, sagging ST depression, and T-wave changes may occur without toxicity."],
          ["Toxicity risk","Renal dysfunction, older age, low body mass, hypokalemia, hypomagnesemia, hypercalcemia, hypothyroidism, and interactions."],
          ["Toxicity manifestations","Nausea, anorexia, confusion, visual disturbance, AV block, and many atrial or ventricular arrhythmias."],
          ["Severe toxicity","Stop drug, correct electrolytes, treat arrhythmia, and use digoxin-specific antibody fragments when indicated."]
        ])}
        ${callout("Classic trap","The digoxin ECG effect does not prove digoxin toxicity. Toxicity is a clinical diagnosis supported by symptoms, rhythm, renal function, electrolytes, interactions, and concentration.","danger")}
      </section>
      <section class="section-block">${section("Beta-blocker practical rule")}
        <div class="prose-card speech-unit"><p>Although beta-blockers are immediately negative inotropic, evidence-based agents improve survival and reverse remodeling when started in stable patients at low dose and titrated gradually. Do not newly start or aggressively increase during active shock or severe uncontrolled fluid overload. Chronic therapy is often continued during admission unless hypotension, shock, severe bradycardia, or another clear contraindication exists.</p></div>
      </section>
    `},

    "devices-advanced":{kicker:"Chronic management",title:"Devices, advanced therapy, and supportive care",lead:"Device and advanced-HF decisions require optimized therapy, correct phenotype, timing, and patient goals.",html:`
      <section class="section-block">${section("Major options")}
        ${table(["Option","Purpose","Key selection principle"],[
          ["ICD","Prevention of sudden cardiac death.","Persistent risk after optimized therapy and EF reassessment, with appropriate expected survival and functional status."],
          ["CRT","Improves synchrony, symptoms, remodeling, and outcomes.","Reduced EF with prolonged QRS and suitable conduction and rhythm features."],
          ["Mechanical circulatory support","Bridge to recovery, decision, transplantation, or destination therapy.","Advanced HF with careful assessment of RV, organs, infection, adherence, and goals."],
          ["Heart transplantation","Definitive option for selected end-stage HF.","Severe disease despite optimal care and acceptable candidacy."],
          ["Palliative and supportive care","Symptom control, communication, advance care planning, and quality of life.","Integrated throughout serious HF—not only at the final days."]
        ])}
      </section>
      <section class="section-block">${section("Refer before the window closes")}
        <div class="card-grid">
          ${card("Repeated admissions","<p>Escalating congestion or repeated emergency visits despite optimized therapy.</p>","Admit")}
          ${card("Intolerance to GDMT","<p>Hypotension, renal dysfunction, or hyperkalemia preventing effective treatment.</p>","GDMT")}
          ${card("Low-output trajectory","<p>Worsening perfusion, inotrope need, rising lactate, or end-organ dysfunction.</p>","Cold")}
          ${card("High symptom burden","<p>Persistent NYHA III–IV symptoms, frailty, cachexia, or major caregiver burden.</p>","III–IV")}
        </div>
      </section>
      ${callout("Advanced does not mean abandoned","Disease-directed therapy, rehabilitation, symptom control, palliative care, caregiver support, and shared decisions can occur together.","success")}
    `},

    "acute-overview":{kicker:"Acute heart failure",title:"Acute heart failure overview",lead:"A rapid onset or worsening of HF symptoms and signs requires urgent evaluation, stabilization, and cause treatment.",html:`
      <section class="section-block">${section("Common presentations")}
        ${table(["Presentation","Typical pattern"],[
          ["Acute pulmonary edema","Severe respiratory distress, orthopnea, diffuse crackles, hypoxemia, often high blood pressure."],
          ["Acute decompensated chronic HF","Progressive congestion, edema, weight gain, renal dysfunction, or poor response to oral diuretic."],
          ["Cardiogenic shock","Hypotension or need for support plus tissue hypoperfusion due to cardiac dysfunction."],
          ["Isolated RV failure","Raised JVP, systemic congestion, low output, sometimes clear lungs depending on cause."],
          ["Hypertensive acute HF","Marked blood-pressure elevation with rapid pulmonary congestion and fluid redistribution."],
          ["Acute mechanical or valve disease","Sudden severe MR or AR, VSD, papillary muscle rupture, or other structural catastrophe."]
        ])}
      </section>
      <section class="section-block">${section("Immediate assessment")}
        <ol class="step-list speech-unit">
          <li>Airway, breathing, circulation, mental state, oxygen saturation, blood pressure, rhythm, urine output, and shock signs.</li>
          <li>Identify time-critical causes: ACS, acute valve or mechanical complication, PE, tamponade, aortic syndrome, severe arrhythmia, infection, hypertensive emergency.</li>
          <li>Obtain ECG, chest or bedside lung imaging, troponin, natriuretic peptide, CBC, electrolytes, kidney and liver function, glucose, and blood gas when indicated.</li>
          <li>Use urgent echocardiography for shock, hemodynamic instability, suspected mechanical disease, acute valve failure, RV failure, or uncertain diagnosis.</li>
        </ol>
      </section>
      ${callout("Treat while investigating","In respiratory failure or shock, stabilization and diagnosis proceed together. Do not delay life-saving support while waiting for a complete etiologic workup.","danger")}
    `},

    "bedside-profiles":{kicker:"Acute heart failure",title:"Warm/cold and wet/dry bedside profiles",lead:"A simple 2×2 framework organizes perfusion, congestion, urgency, and first priorities.",html:`
      <section class="section-block">${section("The four profiles")}
        <div class="profile-grid">${profiles.map(p=>`<article class="profile-card speech-unit"><span class="profile-code">${p.title}</span><h3>${p.perfusion} perfusion · ${p.congestion} congestion</h3><p>${p.clues}</p><strong>Priority</strong><p>${p.priority}</p></article>`).join("")}</div>
      </section>
      <section class="section-block">${section("The framework is a starting point")}
        ${callout("Reassess repeatedly","Profiles change after oxygenation, vasodilation, diuresis, rhythm treatment, reperfusion, fluids, inotropes, or mechanical support. Reclassify rather than anchoring to the initial label.","warning")}
      </section>
      ${linkRow([["profile-lab","Open the profile lab"],["acute-management","Apply treatment principles"]])}
    `},

    "acute-management":{kicker:"Acute heart failure",title:"Acute management by problem",lead:"Treat hypoxemia, congestion, pressure, perfusion, and the precipitating cause with continuous reassessment.",html:`
      <section class="section-block">${section("Problem-based treatment")}
        ${table(["Problem","Management principles"],[
          ["Hypoxemia or respiratory distress","Oxygen for hypoxemia; non-invasive ventilation for selected patients; intubation when respiratory failure persists or airway protection is needed."],
          ["Congestion","IV loop diuretic with monitoring of urine output, symptoms, BP, kidney function, and electrolytes."],
          ["Severe hypertension with pulmonary edema","Rapidly acting IV vasodilator may be useful when BP permits, alongside ventilatory support and decongestion."],
          ["Hypotension or hypoperfusion","Treat cause, assess volume, avoid unnecessary vasodilators; inotrope may be required for low output with organ hypoperfusion."],
          ["Cardiogenic shock","Early critical-care and shock-team involvement; norepinephrine is commonly used to maintain perfusion, with selective inotrope and mechanical support consideration."],
          ["Thromboembolism risk","Provide VTE prophylaxis in immobilized hospitalized patients unless contraindicated."],
          ["Precipitating cause","Reperfuse ACS, correct rhythm, treat infection, repair mechanical disease, address PE or tamponade, and review adherence and drugs."]
        ])}
      </section>
      <section class="section-block">${section("Corrections to older teaching")}
        <div class="card-grid">
          ${card("Oxygen","<p>Use for hypoxemia, not automatically for every acute HF patient.</p>","O₂")}
          ${card("Morphine","<p>Not routine therapy because benefit is uncertain and safety concerns exist.</p>","M")}
          ${card("Inotropes","<p>Reserve for low output with hypotension or organ hypoperfusion—not uncomplicated congestion.</p>","I")}
          ${card("Fluids","<p>Give only when true underfilling is likely and reassess immediately; many hypotensive HF patients are still congested.</p>","IV")}
        </div>
      </section>
      <section class="section-block">${section("Acute scenario builder")}
        <div class="tool-panel" id="acute-tool">
          <div class="form-grid"><label>Blood pressure<select id="acute-bp"><option value="normal">Adequate</option><option value="high">Severely elevated</option><option value="low">Low / shock concern</option></select></label><label>Oxygenation<select id="acute-o2"><option value="ok">No hypoxemia</option><option value="low">Hypoxemia / respiratory distress</option></select></label><label>Congestion<select id="acute-wet"><option value="yes">Present</option><option value="no">Absent/minimal</option></select></label><label>Perfusion<select id="acute-cold"><option value="no">Adequate</option><option value="yes">Reduced</option></select></label></div>
          <button class="primary-button" id="acute-build" type="button">Build priorities</button><div class="tool-result speech-unit" id="acute-result">Choose a profile and build priorities.</div>
        </div>
      </section>
    `},

    shock:{kicker:"Acute heart failure",title:"Cardiogenic shock",lead:"Shock is tissue hypoperfusion caused by cardiac dysfunction; blood pressure alone is not the full definition.",html:`
      <section class="section-block">${section("Recognize the syndrome")}
        <div class="card-grid">
          ${card("Clinical hypoperfusion","<p>Cool mottled skin, confusion, oliguria, weak pulse, narrow pulse pressure, rising lactate, hepatic or renal injury.</p>","Cold")}
          ${card("Hemodynamic concern","<p>Hypotension is common, but a patient can be in evolving shock before a profoundly low cuff pressure appears.</p>","BP")}
          ${card("Cardiac cause","<p>MI, mechanical complication, severe LV or RV failure, myocarditis, valve catastrophe, arrhythmia, or stress cardiomyopathy.</p>","Cause")}
        </div>
      </section>
      <section class="section-block">${section("Immediate priorities")}
        <ol class="step-list speech-unit">
          <li>Activate senior critical-care, cardiology, and shock expertise early.</li>
          <li>Support airway and oxygenation; obtain arterial and central access as clinically required.</li>
          <li>Identify reversible cause urgently with ECG, bedside echo, labs, and coronary or structural evaluation.</li>
          <li>Restore perfusion pressure—norepinephrine is commonly preferred when vasopressor support is needed.</li>
          <li>Add inotropic support selectively when cardiac output remains inadequate, balancing arrhythmia and ischemia risk.</li>
          <li>Assess congestion and RV/LV filling; avoid reflexive fluid loading.</li>
          <li>Escalate to temporary mechanical circulatory support in selected patients before irreversible organ failure.</li>
        </ol>
      </section>
      ${callout("Phenotype matters","LV shock, RV shock, mechanical complications, and vasodilatory overlap require different loading and support strategies. A single drug sequence does not fit every shock state.","danger")}
    `},

    "phenotype-lab":{kicker:"Interactive revision",title:"EF phenotype laboratory",lead:"Enter current and previous EF to classify the traditional phenotype and see the modern interpretation.",html:`
      <section class="section-block">${section("Classify a patient")}
        <div class="tool-panel" id="phenotype-tool">
          <div class="form-grid"><label>Current LVEF (%)<input id="current-ef" type="number" min="1" max="90" step="1" value="35"></label><label>Previous documented LVEF (%)<input id="previous-ef" type="number" min="1" max="90" step="1" placeholder="Optional"></label><label>Compatible HF symptoms/signs?<select id="hf-syndrome"><option value="yes">Yes</option><option value="no">No</option></select></label><label>Objective cardiac evidence?<select id="hf-evidence"><option value="yes">Yes</option><option value="no">No / not yet</option></select></label></div>
          <button class="primary-button" id="classify-ef" type="button">Classify phenotype</button><div class="tool-result speech-unit" id="ef-result">Enter values and classify.</div>
        </div>
      </section>
      ${callout("Measurement uncertainty","EF varies with technique, loading conditions, image quality, reader, and time. A borderline number should not override the clinical phenotype or longitudinal trajectory.","warning")}
    `},

    "profile-lab":{kicker:"Interactive revision",title:"Hemodynamic profile laboratory",lead:"Use bedside clues to identify warm/cold and wet/dry physiology, then choose the first priority.",html:`
      <section class="section-block">${section("Build the profile")}
        <div class="tool-panel" id="profile-tool">
          <div class="check-grid"><label><input type="checkbox" value="jvp"> Raised JVP</label><label><input type="checkbox" value="edema"> Peripheral edema</label><label><input type="checkbox" value="crackles"> Crackles / pulmonary edema</label><label><input type="checkbox" value="orthopnea"> Orthopnea</label><label><input type="checkbox" value="cool"> Cool extremities</label><label><input type="checkbox" value="oliguria"> Oliguria</label><label><input type="checkbox" value="confusion"> Confusion</label><label><input type="checkbox" value="narrow"> Narrow pulse pressure</label></div>
          <button class="primary-button" id="classify-profile" type="button">Identify profile</button><div class="tool-result speech-unit" id="profile-result">Select findings and classify.</div>
        </div>
      </section>
      ${callout("Educational simplification","Real assessment includes blood pressure, lactate, renal and hepatic trajectory, ultrasound, response to treatment, and cause. The 2×2 profile is a communication framework, not a complete shock model.","info")}
    `},

    "therapy-lab":{kicker:"Interactive revision",title:"Therapy reasoning laboratory",lead:"Choose a scenario to separate symptom relief, disease modification, contraindication, and escalation.",html:`
      <section class="section-block">${section("Select a clinical scenario")}
        <div class="tool-panel" id="therapy-tool">
          <div class="form-grid"><label>Scenario<select id="therapy-scenario"><option value="stable-hfref">Stable symptomatic HFrEF</option><option value="wet">Congested but perfused</option><option value="hfpef">HFpEF with obesity, hypertension, diabetes</option><option value="shock">Cold and hypotensive</option><option value="improved">EF improved from 30% to 52%</option><option value="af">HF with atrial fibrillation</option></select></label><label>Main constraint<select id="therapy-constraint"><option value="none">No major constraint</option><option value="lowbp">Low blood pressure</option><option value="highk">Hyperkalemia</option><option value="renal">Significant renal dysfunction</option><option value="brady">Bradycardia / conduction disease</option><option value="congestion">Severe active congestion</option></select></label></div>
          <button class="primary-button" id="build-therapy" type="button">Build reasoning plan</button><div class="tool-result speech-unit" id="therapy-result">Choose a scenario and constraint.</div>
        </div>
      </section>
      ${callout("Not a prescription calculator","This tool teaches categories and sequencing logic. It intentionally does not provide patient-specific doses, contraindication thresholds, or medication orders.","danger")}
    `},

    cases:{kicker:"Interactive revision",title:"Progressive clinical cases",lead:"Reveal the reasoning only after you commit to a diagnosis, profile, investigation, and management priority.",html:`<section class="section-block"><div id="case-lab"></div></section>`},
    flashcards:{kicker:"Interactive revision",title:"Sectioned flashcards",lead:"Flip each card by click, Enter, or Space; filter by topic or reveal the entire deck.",html:`<section class="section-block"><div id="flashcard-lab"></div></section>`},
    quiz:{kicker:"Interactive revision",title:"Scored heart-failure quiz",lead:"Thirty questions with immediate explanations and persistent local score state.",html:`<section class="section-block"><div id="quiz-lab"></div></section>`},

    sources:{kicker:"Sources & scope",title:"Sources, updates, and educational scope",lead:"The site is grounded in the supplied chapter and contemporary professional guidance, with explicit limits.",html:`
      <section class="section-block">${section("Supplied source")}
        <div class="source-list speech-unit">
          <div class="source-item"><span class="source-number">PDF</span><div><strong>Heart Failure — Reconstructed Study Chapter</strong><p>The supplied 18-page chapter provides the core definitions, traditional EF categories, staging, pathophysiology, clinical assessment, investigations, four-pillar HFrEF treatment, acute profiles, pharmacology, and revision tables.</p><p><a href="heart-failure-source.pdf" target="_blank" rel="noopener">Open the embedded source PDF</a></p></div></div>
        </div>
      </section>
      <section class="section-block">${section("Professional references used for cross-checking and updates")}
        <div class="source-list speech-unit">
          <div class="source-item"><span class="source-number">1</span><div><strong>2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure</strong><p>Four foundational HFrEF classes, HF stages, EF-era terminology, comorbidity, devices, and advanced-HF care.</p><p><a href="https://professional.heart.org/en/science-news/2022-guideline-for-the-management-of-heart-failure" target="_blank" rel="noopener">Official AHA guideline hub</a></p></div></div>
          <div class="source-item"><span class="source-number">2</span><div><strong>2021 ESC Heart Failure Guideline and 2023 Focused Update</strong><p>Diagnosis, acute and chronic management, and updated evidence for HFmrEF, HFpEF, comorbidities, and acute HF.</p><p><a href="https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/focused-update-on-heart-failure/" target="_blank" rel="noopener">Official ESC focused update</a></p></div></div>
          <div class="source-item"><span class="source-number">3</span><div><strong>2024 ACC Expert Consensus Decision Pathway for HFrEF</strong><p>Practical early and rapid initiation of core GDMT, optimization, adherence, referral, and care coordination.</p><p><a href="https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2024/03/06/19/22/2024-acc-expert-consensus-hfref" target="_blank" rel="noopener">Official ACC key points</a></p></div></div>
          <div class="source-item"><span class="source-number">4</span><div><strong>2024 ACC Hospitalized Heart Failure Focused Update</strong><p>Clinical assessment, management, and trajectory of hospitalized HF.</p><p><a href="https://www.jacc.org/doi/10.1016/j.jacc.2024.06.002" target="_blank" rel="noopener">JACC document</a></p></div></div>
          <div class="source-item"><span class="source-number">5</span><div><strong>2026 Second Universal Definition of Heart Failure</strong><p>Updated definition, cause classification, trajectories, and simplified reduced/preserved/improved EF framework.</p><p><a href="https://www.jacc.org/doi/10.1016/j.jacc.2026.05.036" target="_blank" rel="noopener">JACC consensus document</a></p></div></div>
          <div class="source-item"><span class="source-number">6</span><div><strong>2026 ACC Expert Consensus Decision Pathway for HFpEF</strong><p>Updated phenotype-directed, cardiovascular–kidney–metabolic framing and contemporary treatment evidence.</p><p><a href="https://www.acc.org/latest-in-cardiology/journal-scans/2026/07/22/17/25/updated-acc-ecdp-addresses-management-of-hfpef" target="_blank" rel="noopener">Official ACC summary</a></p></div></div>
        </div>
      </section>
      <section class="section-block">${section("What is included")}
        <div class="card-grid">
          ${card("32 modules","<p>Interconnected clinical content with previous/next navigation and cross-links.</p>","32")}
          ${card("Three interactive labs","<p>EF phenotype, hemodynamic profile, and therapy reasoning.</p>","Lab")}
          ${card("12 cases","<p>Progressive reveal with model reasoning and pearls.</p>","12")}
          ${card("60 flashcards","<p>Topic filters, keyboard flip, reveal all, and reset.</p>","60")}
          ${card("30 MCQs","<p>Immediate explanation and local score persistence.</p>","30")}
          ${card("Study hub","<p>Second deck, known/again tracking, local notes, focus mode, font size, and timer.</p>","Hub")}
        </div>
      </section>
      ${callout("Educational scope","Guidelines change, especially in HFpEF and cardiometabolic care. Current local protocols, full guideline documents, regulatory labeling, device criteria, and patient-specific specialist judgment always take precedence.","danger")}
    `}
  };

  const cases = [
    {title:"Breathless with a preserved EF",tag:"HFpEF",stem:"A 72-year-old woman with obesity, hypertension, diabetes, and atrial fibrillation has exertional dyspnea and ankle edema. LVEF is 58%, left atrium is enlarged, E/e′ is elevated, and NT-proBNP is raised.",question:"Does the preserved EF exclude HF, and what is the management framework?",answer:"No. Symptoms plus objective evidence of raised filling pressure support HFpEF. Decongest if fluid overloaded, optimize blood pressure, AF, diabetes, kidney disease, obesity and sleep apnea, and use contemporary phenotype-directed disease-modifying therapy such as an SGLT2 inhibitor when appropriate.",pearls:["Preserved EF is not normal physiology.","Exclude valve, infiltrative, hypertrophic, pericardial, renal and hepatic mimics.","Obesity can lower natriuretic peptide values, so this elevated result is particularly supportive."]},
    {title:"The four-pillar opportunity",tag:"HFrEF",stem:"A stable 61-year-old man has ischemic cardiomyopathy, LVEF 30%, NYHA II symptoms, mild edema, BP 118/72, normal potassium, and acceptable renal function. He takes only an ACE inhibitor and loop diuretic.",question:"How should therapy be conceptualized?",answer:"Relieve residual congestion and introduce the four foundational HFrEF classes early: ARNI or ACEi/ARB, evidence-based beta-blocker, MRA, and SGLT2 inhibitor, with monitoring and titration toward maximally tolerated therapy. Assess ischemic, rhythm, device, adherence and rehabilitation needs.",pearls:["Do not wait to maximize one drug before adding every other pillar.","Diuretic improves symptoms but is not a substitute for disease-modifying therapy.","Reassess EF after optimized therapy before final ICD or CRT decisions."]},
    {title:"Improved EF is not cure",tag:"HFimpEF",stem:"A patient with previous nonischemic HFrEF and LVEF 28% now feels well and has LVEF 52% after two years of therapy. She asks to stop all HF medicines.",question:"What is the preferred interpretation?",answer:"This is HF with improved EF. The improvement may represent remission rather than cure; disease-modifying therapy is generally continued because withdrawal can lead to relapse. Reassess cause, tolerance, pregnancy plans, BP, renal function, and shared goals rather than stopping routinely.",pearls:["Document the previous EF.","Trajectory matters more than one current number.","Continue surveillance for arrhythmia and recurrent dysfunction."]},
    {title:"Warm and wet",tag:"Acute HF",stem:"A 76-year-old with chronic HF presents with orthopnea, raised JVP, edema, crackles, BP 155/90, warm extremities, and normal mentation.",question:"Classify the profile and state the first priorities.",answer:"Warm–wet: congestion with preserved perfusion. Give IV loop diuretic, monitor response and renal/electrolyte status, consider vasodilation because BP is high, and identify the precipitant.",pearls:["Inotropes are not indicated for uncomplicated congestion.","Oxygen is for hypoxemia, not routine use.","Reassess profile after treatment."]},
    {title:"Cold and wet",tag:"Shock",stem:"A 68-year-old after a large MI has BP 78/50, cool mottled skin, confusion, oliguria, raised JVP, pulmonary edema, and rising lactate.",question:"What is the profile and why is it high risk?",answer:"Cold–wet cardiogenic shock: both hypoperfusion and congestion are present. Activate shock and critical-care pathways, support oxygenation and perfusion, urgently define coronary and mechanical causes with bedside echo and angiographic/structural assessment, use vasopressor and selective inotrope support, and consider mechanical circulatory support.",pearls:["Do not give repeated blind fluid boluses.","Norepinephrine is commonly preferred to maintain perfusion pressure.","Mechanical complications after MI must be sought urgently."]},
    {title:"Cold but apparently dry",tag:"Acute HF",stem:"A patient with advanced HFrEF is dizzy, cool, oliguric, and has a narrow pulse pressure. JVP is not visibly elevated and lungs are clear after heavy outpatient diuresis.",question:"What must be decided before giving fluid?",answer:"This is a cold–dry pattern, but the key question is true underfilling versus severe low output with occult or redistributed congestion. Reassess JVP, bedside ultrasound, orthostasis, kidney function, lactate, medication exposure, and hemodynamics. Give only a cautious fluid challenge when underfilling is plausible and reassess immediately.",pearls:["Clear lungs do not prove adequate or low filling pressure.","Over-diuresis, RV failure, and low-output LV failure can look similar.","A profile is a starting hypothesis."]},
    {title:"The normal chest film",tag:"Diagnosis",stem:"A patient has months of exertional dyspnea, orthopnea, raised JVP, and an S3. Chest radiography is reported normal.",question:"Does the radiograph exclude HF?",answer:"No. Chronic compensated HF can have a normal chest radiograph. Continue objective evaluation with ECG, natriuretic peptide, echocardiography, and cause-specific tests.",pearls:["Radiography is useful but insensitive for some chronic states.","JVP and orthopnea raise pre-test probability.","A normal test must be interpreted in the clinical context."]},
    {title:"Low BNP in obesity",tag:"Biomarkers",stem:"A patient with severe obesity has exertional dyspnea, edema, LV hypertrophy, left-atrial enlargement, and borderline-low BNP.",question:"How should the BNP be interpreted?",answer:"Obesity can suppress natriuretic peptide concentration, so a low or borderline value does not completely exclude HFpEF. Integrate echo, clinical congestion, exercise or invasive filling-pressure assessment, and alternative diagnoses.",pearls:["Low values are often most useful for ruling out HF, but context modifies that value.","AF and renal dysfunction usually raise levels.","Do not diagnose HFpEF from echo diastolic labels alone."]},
    {title:"Digoxin effect or toxicity?",tag:"Pharmacology",stem:"A patient taking digoxin has sagging ST depression and a shortened QT on ECG but feels well, has stable renal function, normal electrolytes, and no arrhythmia.",question:"Does the ECG prove toxicity?",answer:"No. These may be expected digoxin effects. Toxicity is a clinical diagnosis involving symptoms, rhythm, renal function, electrolytes, interactions, and concentration. Continue clinical assessment rather than treating the ECG appearance alone.",pearls:["Hypokalemia increases toxicity risk.","Toxicity can produce many arrhythmias or AV block.","Severe life-threatening toxicity may require antibody fragments."]},
    {title:"Beta-blocker during decompensation",tag:"Pharmacology",stem:"A patient on chronic carvedilol is admitted with edema and dyspnea but BP is stable, extremities are warm, and there is no shock or severe bradycardia.",question:"Should the beta-blocker automatically be stopped?",answer:"No. Chronic evidence-based beta-blocker therapy is often continued during admission unless hypotension, shock, severe bradycardia, or another clear contraindication exists. Treat congestion and reassess. Avoid aggressive up-titration during active decompensation.",pearls:["Starting and continuing are different decisions.","Abrupt withdrawal may be harmful.","Stability and perfusion guide the choice."]},
    {title:"Right HF with clear lungs",tag:"Right HF",stem:"A patient with pulmonary hypertension has massive JVP elevation, edema, hepatomegaly, ascites, cool extremities, and clear lungs.",question:"Why can this still be severe HF?",answer:"Severe RV failure causes systemic venous congestion and reduced pulmonary forward flow, which lowers LV preload and systemic output. The lungs can remain clear because the primary pressure backup is systemic rather than pulmonary.",pearls:["Assess RV size/function and cause of pulmonary hypertension.","Avoid indiscriminate preload reduction in preload-sensitive RV failure.","Right HF often coexists with renal and hepatic congestion."]},
    {title:"Pulmonary edema with severe hypertension",tag:"Acute HF",stem:"A patient develops sudden severe dyspnea, diffuse crackles, frothy sputum, oxygen saturation 82%, and BP 220/120. Peripheral edema is modest.",question:"What physiology and treatment priorities fit?",answer:"Hypertensive acute pulmonary edema often reflects rapid fluid redistribution and markedly increased afterload. Support oxygenation and ventilation, use rapidly acting IV vasodilation when appropriate, give IV loop diuretic, and search for ACS, acute valve disease, and other triggers.",pearls:["Total body fluid excess may be less dramatic than the pulmonary presentation.","Morphine is not routine therapy.","BP reduction must be controlled and monitored."]}
  ];

  const flashcards = [
    ["Foundations","What defines clinical HF?","Compatible symptoms or signs caused by a cardiac abnormality plus objective evidence of dysfunction, congestion, elevated filling pressure, or inadequate output."],
    ["Foundations","Does a normal EF exclude HF?","No. HFpEF can produce high filling pressure and poor reserve despite preserved EF."],
    ["Foundations","Traditional HFrEF cutoff?","LVEF 40% or lower."],
    ["Foundations","Traditional HFmrEF range?","LVEF 41–49%."],
    ["Foundations","Traditional HFpEF cutoff?","LVEF 50% or higher, with clinical and objective evidence of HF."],
    ["Foundations","What is HFimpEF?","Previous LVEF 40% or lower with a later value above 40%; therapy is generally continued."],
    ["Foundations","Stage A?","At risk for HF without symptoms, structural disease, or biomarker evidence of myocardial injury."],
    ["Foundations","Stage B?","Pre-HF: structural disease, abnormal filling pressure, or biomarker evidence without symptoms."],
    ["Foundations","Stage C?","Current or previous symptomatic HF due to structural heart disease."],
    ["Foundations","How does NYHA differ from stage?","NYHA describes current functional limitation and can change; stage describes progression and does not move backward."],
    ["Mechanisms","Immediate benefit of sympathetic activation?","Supports heart rate, contractility, blood pressure, and perfusion."],
    ["Mechanisms","Long-term cost of sympathetic activation?","Higher oxygen demand, afterload, arrhythmia risk, and adverse remodeling."],
    ["Mechanisms","Long-term cost of RAAS activation?","Sodium and water retention, congestion, fibrosis, potassium disturbance, and remodeling."],
    ["Mechanisms","Pressure-overload remodeling?","Initially concentric hypertrophy; later stiffness, ischemia, fibrosis, and failure."],
    ["Mechanisms","Volume-overload remodeling?","Dilatation and eccentric remodeling with rising wall stress and functional regurgitation."],
    ["Mechanisms","What is high-output HF?","Output is high but still inadequate for abnormal demand or low systemic resistance, causing chronic volume/workload stress."],
    ["Clinical","Classic left-sided congestion symptoms?","Dyspnea, orthopnea, PND, cough, and exercise intolerance."],
    ["Clinical","Classic right-sided congestion signs?","Raised JVP, edema, hepatojugular reflux, hepatomegaly, and ascites."],
    ["Clinical","Signs of hypoperfusion?","Cool skin, weak pulse, narrow pulse pressure, oliguria, confusion, and rising lactate."],
    ["Clinical","What does wet mean?","Congestion from elevated filling pressure."],
    ["Clinical","What does cold mean?","Reduced tissue perfusion or low output."],
    ["Clinical","Most common cause of right HF?","Left-sided HF, though pulmonary hypertension, PE, RV infarction, and right valve disease are important alternatives."],
    ["Clinical","What is an S3?","An early-diastolic sound from rapid filling into a volume-loaded or dilated ventricle; supports HF in context."],
    ["Clinical","Can S4 occur in AF?","No organized atrial contraction means a true S4 is absent."],
    ["Clinical","What is pulsus alternans?","Alternating strong and weak pulse amplitude with a regular rhythm, suggesting severe LV dysfunction."],
    ["Diagnosis","First-line structural test?","Transthoracic echocardiography."],
    ["Diagnosis","Can a normal chest X-ray exclude chronic HF?","No."],
    ["Diagnosis","Factors that raise natriuretic peptide?","Older age, renal dysfunction, AF, pulmonary hypertension, ACS, and severe valve disease."],
    ["Diagnosis","Factor that can lower BNP/NT-proBNP?","Obesity; early presentation and successful decongestion can also lower values."],
    ["Diagnosis","Why obtain troponin in acute HF?","To detect myocardial injury and assess ACS, while recognizing HF itself can elevate troponin."],
    ["Diagnosis","Role of cardiac MRI?","Tissue characterization, myocarditis, scar, infiltrative disease, and cardiomyopathy phenotyping."],
    ["Diagnosis","When is invasive hemodynamics useful?","When diagnosis or shock physiology is uncertain, or advanced decisions require direct pressure and output measurement."],
    ["Diagnosis","HFpEF diagnosis requires what beyond EF?","Symptoms/signs plus objective evidence of raised filling pressure or structural/functional abnormality and exclusion of mimics."],
    ["HFrEF therapy","Four foundational HFrEF classes?","ARNI or ACEi/ARB, evidence-based beta-blocker, MRA, and SGLT2 inhibitor."],
    ["HFrEF therapy","Main role of loop diuretic?","Relieve congestion and maintain euvolemia; it does not replace disease-modifying therapy."],
    ["HFrEF therapy","Why early four-pillar initiation?","Benefits are complementary; delaying one class delays potential protection."],
    ["HFrEF therapy","Outcome-proven beta-blockers?","Carvedilol, bisoprolol, and metoprolol succinate."],
    ["HFrEF therapy","Key ARNI safety rule?","Do not combine with an ACE inhibitor; use the required washout and monitor BP, kidneys, and potassium."],
    ["HFrEF therapy","Key MRA monitoring?","Potassium and renal function soon after starting and after dose changes."],
    ["HFrEF therapy","Key SGLT2 sick-day issue?","Temporarily withhold during major fasting or acute severe illness according to current guidance because of ketoacidosis risk."],
    ["HFpEF","Broadest established drug class across HFpEF?","SGLT2 inhibitors, when suitable."],
    ["HFpEF","Core HFpEF comorbidities?","Hypertension, obesity, diabetes, CKD, AF, ischemia, sleep apnea, valve disease, and iron deficiency."],
    ["HFpEF","Why are mimics important?","Infiltrative, hypertrophic, valve, pericardial, renal, and hepatic disease need different treatment."],
    ["Pharmacology","Does digoxin effect prove toxicity?","No."],
    ["Pharmacology","Electrolyte that increases digoxin toxicity risk?","Hypokalemia; hypomagnesemia and hypercalcemia also increase risk."],
    ["Pharmacology","Can chronic beta-blocker continue in a warm congested admission?","Often yes, unless shock, hypotension, severe bradycardia, or another contraindication exists."],
    ["Acute HF","Warm–wet priority?","Decongestion and precipitant treatment; vasodilator if BP is high and appropriate."],
    ["Acute HF","Cold–wet significance?","High-risk congestion plus hypoperfusion; support perfusion and treat shock while decongesting cautiously."],
    ["Acute HF","Is routine oxygen indicated?","No; use for hypoxemia."],
    ["Acute HF","Is morphine routine?","No."],
    ["Acute HF","When are inotropes appropriate?","Low output with hypotension or organ hypoperfusion, not uncomplicated congestion."],
    ["Acute HF","Common vasopressor in cardiogenic shock?","Norepinephrine is commonly preferred when pressure support is needed."],
    ["Acute HF","What does CHAMPIT prompt?","Coronary syndrome, hypertensive emergency, arrhythmia, mechanical cause, pulmonary embolism, infection, and tamponade."],
    ["Devices","Purpose of ICD?","Prevent sudden cardiac death in selected patients after optimized therapy and reassessment."],
    ["Devices","Purpose of CRT?","Correct electrical dyssynchrony in selected reduced-EF patients with appropriate QRS/conduction features."],
    ["Advanced HF","When to refer?","Before repeated shock or irreversible end-organ dysfunction removes options."],
    ["Advanced HF","Does palliative care replace active care?","No; it can be integrated alongside disease-directed and advanced therapy."],
    ["Exam traps","Does edema prove HF?","No; consider venous, renal, hepatic, drug, and nutritional causes."],
    ["Exam traps","Does improved EF mean treatment can stop?","No; improvement may be remission and relapse can occur."],
    ["Exam traps","Does a creatinine rise always mean stop decongestion?","No; interpret it with perfusion, congestion, urine output, electrolytes, and overall response."]
  ].map(([tag,q,a])=>({tag,q,a}));

  const quiz = [
    {q:"Which statement best defines heart failure?",choices:["Any LVEF below 50%","Edema caused by cardiac disease","A clinical syndrome with compatible symptoms/signs plus objective cardiac evidence","Cardiomegaly on chest radiograph"],answer:2,explanation:"HF is a clinical syndrome. EF, edema, or cardiomegaly alone is insufficient."},
    {q:"A patient had LVEF 30% and now has LVEF 48% after therapy. Which traditional phenotype applies?",choices:["HFpEF","HFimpEF","High-output HF","Stage A"],answer:1,explanation:"Previous EF ≤40% with later EF >40% is HF with improved EF; therapy is generally continued."},
    {q:"Which describes NYHA class III?",choices:["No activity limitation","Symptoms with ordinary activity only","Symptoms with less-than-ordinary activity but comfortable at rest","Symptoms only during maximal exercise"],answer:2,explanation:"NYHA III is marked limitation with symptoms during less-than-ordinary activity."},
    {q:"A patient with reduced EF but no prior or current HF symptoms is usually which stage?",choices:["Stage A","Stage B","Stage C","Stage D"],answer:1,explanation:"Structural disease without symptoms is pre-HF, Stage B."},
    {q:"Which long-term effect of RAAS activation worsens HF?",choices:["Natriuresis","Reduced fibrosis","Sodium and water retention","Lower afterload"],answer:2,explanation:"Persistent RAAS activation promotes retention, congestion, fibrosis, and remodeling."},
    {q:"Which is a classic cause of high-output HF?",choices:["Severe anemia","Small restrictive VSD","Sinus bradycardia","Mild mitral valve prolapse"],answer:0,explanation:"Severe anemia increases flow demand; thyrotoxicosis, AV fistula, beriberi, and liver disease are other causes."},
    {q:"Which finding most strongly suggests systemic venous congestion?",choices:["Raised JVP","Dry cough","Low BNP","Hyperresonant chest"],answer:0,explanation:"Raised JVP is a central bedside marker of right-sided filling pressure and systemic congestion."},
    {q:"Which finding suggests hypoperfusion?",choices:["Warm hands and wide pulse pressure","Cool skin and oliguria","Isolated ankle edema","Loud S1"],answer:1,explanation:"Cool skin and oliguria are classic low-output findings."},
    {q:"A warm–wet patient has:",choices:["Adequate perfusion and congestion","Low perfusion without congestion","Low perfusion with congestion","No congestion and adequate perfusion"],answer:0,explanation:"Warm means perfused; wet means congested."},
    {q:"The most common cause of right-sided HF is:",choices:["Isolated tricuspid stenosis","Left-sided HF","Thiamine deficiency","Dextrocardia"],answer:1,explanation:"Left-sided HF is the most common pathway to RV failure."},
    {q:"Which test is central for defining EF, valves, RV function, and chamber size?",choices:["ECG","Chest X-ray","Echocardiography","D-dimer"],answer:2,explanation:"Transthoracic echo is the central structural and functional test."},
    {q:"Which factor may lower BNP or NT-proBNP unexpectedly?",choices:["Atrial fibrillation","Renal dysfunction","Older age","Obesity"],answer:3,explanation:"Obesity may suppress natriuretic peptide concentration."},
    {q:"A normal chest radiograph:",choices:["Excludes chronic HF","Excludes HFpEF only","Does not exclude chronic compensated HF","Proves a noncardiac cause"],answer:2,explanation:"Chronic compensated HF may have a normal film."},
    {q:"Which is NOT one of the four foundational HFrEF classes?",choices:["SGLT2 inhibitor","MRA","Evidence-based beta-blocker","Routine chronic IV inotrope"],answer:3,explanation:"Chronic routine inotropes increase arrhythmia and mortality risk and are not foundational therapy."},
    {q:"Main role of loop diuretics in chronic HF?",choices:["Reverse all remodeling","Relieve congestion","Prevent every arrhythmia","Replace ARNI therapy"],answer:1,explanation:"Loop diuretics relieve congestion and symptoms but are not a substitute for disease-modifying therapy."},
    {q:"Which beta-blocker has established HFrEF outcome evidence?",choices:["Propranolol","Atenolol","Metoprolol succinate","Esmolol infusion"],answer:2,explanation:"Carvedilol, bisoprolol, and metoprolol succinate are outcome-proven agents."},
    {q:"Which monitoring is most important after starting an MRA?",choices:["Amylase and lipase","Potassium and renal function","INR only","TSH only"],answer:1,explanation:"Hyperkalemia and renal dysfunction are major hazards."},
    {q:"Which statement about HFimpEF is correct?",choices:["All therapy should stop when EF normalizes","It always represents permanent cure","Disease-modifying therapy is generally continued","It is the same as Stage A"],answer:2,explanation:"Relapse can occur after apparent recovery, so therapy generally continues."},
    {q:"Which is the broadest established disease-modifying class across HFmrEF and HFpEF?",choices:["SGLT2 inhibitors","Chronic nitrates","Digoxin","Class I antiarrhythmics"],answer:0,explanation:"SGLT2 inhibitors reduce HF events across the mildly reduced and preserved EF spectrum."},
    {q:"Sagging ST depression in a stable patient on digoxin:",choices:["Always proves toxicity","May be a therapeutic digoxin ECG effect","Requires immediate thrombolysis","Proves hyperkalemia"],answer:1,explanation:"The digoxin effect can occur without toxicity; toxicity is a clinical diagnosis."},
    {q:"Which electrolyte disturbance increases digoxin toxicity?",choices:["Hypermagnesemia","Hypokalemia","Hypernatremia","Hypophosphatemia"],answer:1,explanation:"Hypokalemia increases sensitivity to digoxin."},
    {q:"A warm–wet acute HF patient with BP 170/95 generally needs first:",choices:["Routine inotrope","Decongestion and possible vasodilation","Repeated fluid boluses","Immediate long-term LVAD"],answer:1,explanation:"Congestion with adequate perfusion is treated with IV diuretic and, when appropriate, vasodilation."},
    {q:"Oxygen in acute HF should be:",choices:["Given routinely to everyone","Used for hypoxemia or respiratory failure","Avoided even in saturation 80%","Used instead of diuretics"],answer:1,explanation:"Oxygen treats hypoxemia; routine use in normoxemia is not indicated."},
    {q:"Inotropes are most appropriate for:",choices:["Uncomplicated ankle edema","Low output with organ hypoperfusion","Stable NYHA I HF","Any BNP elevation"],answer:1,explanation:"Inotropes are reserved for low output and hypoperfusion because they carry arrhythmia and ischemia risk."},
    {q:"Which vasopressor is commonly preferred when pressure support is required in cardiogenic shock?",choices:["Norepinephrine","Phenylephrine in every case","Oral midodrine","No vasopressor ever"],answer:0,explanation:"Norepinephrine is commonly used to maintain perfusion pressure, with phenotype-specific additions."},
    {q:"Which is a time-critical precipitant of acute HF?",choices:["Stable varicose veins","Acute mechanical complication after MI","Long-standing mild myopia","Seasonal rhinitis"],answer:1,explanation:"Mechanical complications can cause abrupt pulmonary edema and shock and require urgent diagnosis and intervention."},
    {q:"CRT primarily treats:",choices:["Iron deficiency","Electrical dyssynchrony","Hyperthyroidism","Venous insufficiency"],answer:1,explanation:"CRT improves coordinated ventricular activation in selected patients with reduced EF and appropriate QRS features."},
    {q:"Which statement about palliative care in HF is correct?",choices:["It begins only after all treatment stops","It can accompany active disease-directed care","It is contraindicated before transplant","It means no symptom treatment"],answer:1,explanation:"Palliative and supportive care can be integrated throughout serious HF."},
    {q:"Which description fits cold–dry physiology?",choices:["Adequate perfusion with congestion","Low perfusion with little obvious congestion","Adequate perfusion without congestion","Pulmonary edema with warm extremities"],answer:1,explanation:"Cold–dry means hypoperfusion without clear congestion; true volume status must be reassessed."},
    {q:"The 2026 Second Universal Definition emphasizes:",choices:["EF alone as the sole definition","Simplified reduced, preserved, and improved EF groups plus trajectory and cause","Eliminating objective evidence","That HFpEF is never cardiometabolic"],answer:1,explanation:"The 2026 consensus de-emphasizes rigid cutoffs and highlights cause, trajectory, and clinically actionable EF groups."}
  ];

  window.HFContent = {navGroups,modules,compensationSteps,investigationData,profiles,pillarData,cases,flashcards,quiz};
})();
