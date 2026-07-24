/* Heart Failure Lab application controller. */
(() => {
  "use strict";

  const content = window.HFContent;
  if (!content) throw new Error("HFContent failed to load.");

  const KEYS = {
    visited:"hf-lab-visited-v4",bookmarks:"hf-lab-bookmarks-v4",rate:"hf-lab-rate-v4",quiz:"hf-lab-quiz-v4"
  };
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const storage={get(key){try{return localStorage.getItem(key)}catch{return null}},set(key,value){try{localStorage.setItem(key,value)}catch{}}};
  const readJSON=(key,fallback)=>{try{return JSON.parse(storage.get(key))??fallback}catch{return fallback}};
  const writeJSON=(key,value)=>storage.set(key,JSON.stringify(value));
  const escapeHTML=value=>String(value).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]);
  const stripHTML=html=>{const node=document.createElement("div");node.innerHTML=html;return(node.textContent||"").replace(/\s+/g," ").trim()};
  const allItems=content.navGroups.flatMap(group=>group.items);
  const initialQuiz={index:0,score:0,answered:false,finished:false,selected:null};
  const state={
    route:"overview",visited:new Set(readJSON(KEYS.visited,["overview"])),bookmarks:readJSON(KEYS.bookmarks,[]),
    caseIndex:0,flashFilter:"All",compIndex:0,investigationIndex:0,pillarIndex:0,
    quiz:Object.assign({},initialQuiz,readJSON(KEYS.quiz,initialQuiz))
  };

  const els={
    nav:$("#course-nav"),app:$("#app-content"),currentLabel:$("#current-section-label"),sidebar:$("#sidebar"),
    scrim:$("#sidebar-scrim"),menu:$("#menu-button"),closeSidebar:$("#sidebar-close"),progressLabel:$("#progress-label"),
    progressBar:$("#progress-bar"),resetProgress:$("#reset-progress"),clearBookmarks:$("#clear-bookmarks"),search:$("#site-search"),
    searchResults:$("#search-results"),voiceStatus:$("#voice-status"),speechRate:$("#speech-rate"),print:$("#print-button"),
    bookmarksButton:$("#bookmarks-button"),bookmarkDialog:$("#bookmark-dialog"),bookmarkList:$("#bookmark-list"),
    closeBookmarks:$("#close-bookmarks"),toast:$("#toast")
  };

  function buildNav(){
    els.nav.innerHTML=content.navGroups.map(group=>`<div class="nav-group"><div class="nav-group-title">${group.title}</div>${group.items.map(item=>`<button class="nav-link" type="button" data-route="${item.id}"><span class="nav-index">${String(allItems.indexOf(item)+1).padStart(2,"0")}</span><span>${item.label}</span><span class="nav-mark" aria-hidden="true"></span></button>`).join("")}</div>`).join("");
  }
  function routeFromHash(){const id=location.hash.replace(/^#/,"");return content.modules[id]?id:"overview"}
  function navigate(route,replace=false){
    if(!content.modules[route])route="overview";
    if(replace){history.replaceState(null,"",`#${route}`);render(route)}
    else if(location.hash!==`#${route}`)location.hash=route;else render(route);
  }
  function moduleNav(route){
    const i=allItems.findIndex(item=>item.id===route),prev=allItems[i-1],next=allItems[i+1];
    return `<nav class="module-nav" aria-label="Module navigation">${prev?`<button class="secondary-button" data-route="${prev.id}" type="button"><small>Previous</small><strong>← ${prev.label}</strong></button>`:"<span></span>"}${next?`<button class="secondary-button" data-route="${next.id}" type="button"><small>Next</small><strong>${next.label} →</strong></button>`:"<span></span>"}</nav>`;
  }
  function render(route){
    if("speechSynthesis" in window) speechSynthesis.cancel();
    state.route=route;state.visited.add(route);writeJSON(KEYS.visited,[...state.visited]);
    const m=content.modules[route];
    els.app.innerHTML=`<article class="module" data-module="${route}"><header class="module-header"><div><p class="eyebrow">${m.kicker}</p><h1>${m.title}</h1><p class="module-lead">${m.lead}</p></div><div class="module-tools"><button class="icon-button bookmark-module ${state.bookmarks.includes(route)?"active":""}" type="button" aria-label="Bookmark this module" title="Bookmark">★</button></div></header>${m.html}${moduleNav(route)}</article>`;
    els.currentLabel.textContent=m.title;document.title=`${m.title} | Heart Failure Lab`;
    updateNav();addSpeechButtons();initRoute(route);closeSidebar();
    requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:"instant"});$("#main-content").focus({preventScroll:true})});
  }
  function updateNav(){
    $$(".nav-link",els.nav).forEach(button=>{
      button.classList.toggle("active",button.dataset.route===state.route);
      button.classList.toggle("visited",state.visited.has(button.dataset.route));
      button.setAttribute("aria-current",button.dataset.route===state.route?"page":"false");
    });
    const count=[...state.visited].filter(id=>content.modules[id]).length,total=allItems.length;
    els.progressLabel.textContent=`${count} / ${total}`;els.progressBar.style.width=`${Math.min(100,count/total*100)}%`;
  }
  function openSidebar(){els.sidebar.classList.add("open");els.scrim.hidden=false;els.menu.setAttribute("aria-expanded","true")}
  function closeSidebar(){els.sidebar.classList.remove("open");els.scrim.hidden=true;els.menu.setAttribute("aria-expanded","false")}
  function showToast(text){els.toast.textContent=text;els.toast.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>els.toast.hidden=true,2100)}

  function toggleBookmark(route){
    const exists=state.bookmarks.includes(route);
    state.bookmarks=exists?state.bookmarks.filter(x=>x!==route):[...state.bookmarks,route];
    writeJSON(KEYS.bookmarks,state.bookmarks);$(".bookmark-module")?.classList.toggle("active",!exists);renderBookmarkList();showToast(exists?"Bookmark removed":"Module bookmarked");
  }
  function renderBookmarkList(){
    const valid=state.bookmarks.filter(id=>content.modules[id]);
    els.bookmarkList.innerHTML=valid.length?valid.map(id=>`<div class="bookmark-item"><button type="button" data-bookmark-route="${id}"><strong>${content.modules[id].title}</strong><small>${content.modules[id].kicker}</small></button><button class="icon-button" type="button" data-remove-bookmark="${id}" aria-label="Remove ${escapeHTML(content.modules[id].title)}">×</button></div>`).join(""):`<div class="bookmark-empty">No bookmarks yet. Use ★ on any module.</div>`;
  }
  function searchSite(query){
    const term=query.trim().toLowerCase();if(term.length<2){els.searchResults.hidden=true;return}
    const hits=allItems.map(item=>{const m=content.modules[item.id],text=`${m.title} ${m.lead} ${stripHTML(m.html)}`.toLowerCase(),index=text.indexOf(term);return index<0?null:{item,m,text,index}}).filter(Boolean).slice(0,12);
    els.searchResults.innerHTML=hits.length?hits.map(hit=>{const start=Math.max(0,hit.index-65),snippet=hit.text.slice(start,hit.index+term.length+105);return `<button class="search-hit" type="button" data-search-route="${hit.item.id}"><strong>${hit.m.title}</strong><small>…${escapeHTML(snippet)}…</small></button>`}).join(""):`<div class="search-hit"><strong>No matching module</strong><small>Try HFrEF, HFpEF, BNP, JVP, edema, shock, SGLT2, digoxin, or CRT.</small></div>`;
    els.searchResults.hidden=false;
  }

  function loadVoices(){
    if(!("speechSynthesis" in window)){els.voiceStatus.textContent="Voice unavailable";return}
    const voices=speechSynthesis.getVoices();
    const voice=voices.find(v=>/Google UK English Female/i.test(v.name))||voices.find(v=>/^en-GB/i.test(v.lang)&&/female|sonia|libby|serena|kate|martha/i.test(v.name))||voices.find(v=>/^en-GB/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang))||voices[0];
    els.voiceStatus.textContent=voice?voice.name.replace(/Microsoft | Online \(Natural\)/g,"").slice(0,24):"Browser voice";
  }
  function addSpeechButtons(root=els.app){
    const floating=".hero,.stat-grid,.flow-row,.table-wrap,.source-list,.checklist,.profile-grid";
    $$(".speech-unit",root).forEach(unit=>{
      if($(":scope > .listen-button",unit))return;
      const button=document.createElement("button");button.type="button";button.className="listen-button";button.textContent="▶ Listen";button.setAttribute("aria-label","Listen to this section");
      if(unit.matches(floating)){unit.style.position="relative";button.classList.add("floating");unit.append(button)}else unit.prepend(button);
    });
  }

  function renderSelector(items,index,listId,outputId,type){
    const list=$(listId),output=$(outputId);if(!list||!output)return;
    const item=items[index];
    if(type==="comp") output.innerHTML=`<p class="eyebrow">Step ${index+1} of ${items.length}</p><h2>${item.title}</h2><p>${item.body}</p><div class="callout success"><h3>Clinical pearl</h3><p>${item.pearl}</p></div>`;
    if(type==="invest") output.innerHTML=`<p class="eyebrow">Investigation ${index+1} of ${items.length}</p><h2>${item.title}</h2><div class="compare-grid"><div class="compare-card blue"><h3>What it contributes</h3><p>${item.use}</p></div><div class="compare-card red"><h3>Limitation</h3><p>${item.limit}</p></div></div>`;
    if(type==="pillar") output.innerHTML=`<p class="eyebrow">Foundation ${index+1} of ${items.length}</p><h2>${item.title}</h2><div class="compare-grid"><div class="compare-card blue"><h3>Main benefit</h3><p>${item.benefit}</p><h3>Starting concept</h3><p>${item.start}</p></div><div class="compare-card red"><h3>Monitor</h3><p>${item.monitor}</p><h3>Exam trap</h3><p>${item.trap}</p></div></div>`;
    $$(`[data-${type}-index]`,list).forEach(button=>button.classList.toggle("active",Number(button.dataset[`${type}Index`])===index));addSpeechButtons(output);
  }
  function initCompensation(){
    const list=$("#compensation-list");if(!list)return;
    list.innerHTML=content.compensationSteps.map((item,i)=>`<button type="button" data-comp-index="${i}" class="${i===state.compIndex?"active":""}"><span>${i+1}</span><strong>${item.title}</strong></button>`).join("");
    list.addEventListener("click",e=>{const b=e.target.closest("[data-comp-index]");if(!b)return;state.compIndex=Number(b.dataset.compIndex);renderSelector(content.compensationSteps,state.compIndex,"#compensation-list","#compensation-output","comp")});
    renderSelector(content.compensationSteps,state.compIndex,"#compensation-list","#compensation-output","comp");
  }
  function initInvestigations(){
    const list=$("#investigation-list");if(!list)return;
    list.innerHTML=content.investigationData.map((item,i)=>`<button type="button" data-invest-index="${i}" class="${i===state.investigationIndex?"active":""}"><span>${i+1}</span><strong>${item.title}</strong></button>`).join("");
    list.addEventListener("click",e=>{const b=e.target.closest("[data-invest-index]");if(!b)return;state.investigationIndex=Number(b.dataset.investIndex);renderSelector(content.investigationData,state.investigationIndex,"#investigation-list","#investigation-output","invest")});
    renderSelector(content.investigationData,state.investigationIndex,"#investigation-list","#investigation-output","invest");
  }
  function initPillars(){
    const list=$("#pillar-list");if(!list)return;
    list.innerHTML=content.pillarData.map((item,i)=>`<button type="button" data-pillar-index="${i}" class="${i===state.pillarIndex?"active":""}"><span>${i+1}</span><strong>${item.title}</strong></button>`).join("");
    list.addEventListener("click",e=>{const b=e.target.closest("[data-pillar-index]");if(!b)return;state.pillarIndex=Number(b.dataset.pillarIndex);renderSelector(content.pillarData,state.pillarIndex,"#pillar-list","#pillar-output","pillar")});
    renderSelector(content.pillarData,state.pillarIndex,"#pillar-list","#pillar-output","pillar");
  }

  function initBNP(){
    const root=$("#bnp-lab"),result=$("#bnp-result");if(!root||!result)return;
    const draw=()=>{
      const selected=$$('input[type="checkbox"]:checked',root).map(x=>x.value),up=[],down=[];
      if(selected.includes("age"))up.push("older age");if(selected.includes("renal"))up.push("renal dysfunction");if(selected.includes("af"))up.push("atrial fibrillation");if(selected.includes("ph"))up.push("pulmonary hypertension");
      if(selected.includes("obesity"))down.push("obesity");if(selected.includes("early"))down.push("very early presentation");if(selected.includes("treated"))down.push("successful decongestion");
      if(!selected.length){result.innerHTML="Select factors to see how they can shift the value.";return}
      result.innerHTML=`<h3>Contextual interpretation</h3>${up.length?`<p><strong>May raise the value:</strong> ${up.join(", ")}.</p>`:""}${down.length?`<p><strong>May make the value lower than expected:</strong> ${down.join(", ")}.</p>`:""}<p>The result still needs the assay, setting, rhythm, renal function, body habitus, timing, imaging, and local cutoffs. This explorer does not calculate a diagnostic threshold.</p>`;addSpeechButtons(result);
    };
    root.addEventListener("change",draw);draw();
  }

  function initAcuteTool(){
    const button=$("#acute-build"),result=$("#acute-result");if(!button||!result)return;
    button.addEventListener("click",()=>{
      const bp=$("#acute-bp").value,o2=$("#acute-o2").value,wet=$("#acute-wet").value==="yes",cold=$("#acute-cold").value==="yes";
      const profile=cold?(wet?"cold–wet":"cold–dry"):(wet?"warm–wet":"warm–dry"),items=[];
      if(o2==="low")items.push("Treat hypoxemia and respiratory distress: oxygen, selected non-invasive ventilation, or intubation when needed.");
      if(wet)items.push("Treat congestion with IV loop diuretic and monitor urine output, symptoms, BP, kidney function, and electrolytes.");
      if(bp==="high")items.push("Because severe hypertension is present, consider rapidly acting IV vasodilation when appropriate while evaluating the trigger.");
      if(bp==="low"||cold)items.push("Prioritize perfusion and shock assessment; define the cause, avoid unnecessary vasodilation, and consider vasopressor/inotrope or mechanical support through a specialist pathway.");
      if(!wet&&!cold)items.push("No clear acute congestion or hypoperfusion: verify the diagnosis and optimize chronic therapy and cause.");
      items.push("Search urgently for ACS, arrhythmia, mechanical or valve disease, PE, tamponade, infection, hypertensive emergency, adherence problems, and renal deterioration.");
      result.innerHTML=`<p class="eyebrow">Built profile</p><h2>${profile}</h2><ol class="step-list">${items.map(x=>`<li>${x}</li>`).join("")}</ol><p class="small muted">Educational priorities only; real treatment depends on exact vitals, gas exchange, organs, ECG, echo, and cause.</p>`;addSpeechButtons(result);
    });
  }

  function initPhenotype(){
    const button=$("#classify-ef"),result=$("#ef-result");if(!button||!result)return;
    button.addEventListener("click",()=>{
      const current=Number($("#current-ef").value),prevRaw=$("#previous-ef").value,previous=prevRaw===""?null:Number(prevRaw),syndrome=$("#hf-syndrome").value==="yes",evidence=$("#hf-evidence").value==="yes";
      if(!Number.isFinite(current)||current<1||current>90){result.innerHTML="Enter a plausible current EF from 1 to 90%.";return}
      let phenotype=current<=40?"HFrEF":current<=49?"HFmrEF":"HFpEF";
      if(previous!==null&&Number.isFinite(previous)&&previous<=40&&current>40)phenotype="HFimpEF";
      const diagnosis=syndrome&&evidence?"The clinical HF syndrome is supported.":!syndrome?"This may be structural dysfunction or pre-HF rather than clinical HF because compatible symptoms/signs are absent.":"HF remains possible, but objective cardiac evidence is not yet established.";
      const modern=phenotype==="HFimpEF"?"The modern trajectory label is improved EF; this does not imply cure.":current<50?"Traditional evidence places the patient in a reduced or mildly reduced EF range; the 2026 universal framework uses clinical judgment rather than a rigid single cutoff.":"Traditional classification is preserved EF; confirm raised filling stress and exclude mimics.";
      result.innerHTML=`<p class="eyebrow">Traditional phenotype</p><div class="big-result">${phenotype}</div><h2>Current LVEF ${current}%${previous!==null?` · previous ${previous}%`:""}</h2><p>${diagnosis}</p><div class="callout info"><h3>Modern interpretation</h3><p>${modern}</p></div>`;addSpeechButtons(result);
    });button.click();
  }

  function initProfileLab(){
    const root=$("#profile-tool"),button=$("#classify-profile"),result=$("#profile-result");if(!root||!button||!result)return;
    button.addEventListener("click",()=>{
      const selected=new Set($$('input[type="checkbox"]:checked',root).map(x=>x.value));
      const wet=["jvp","edema","crackles","orthopnea"].some(x=>selected.has(x));
      const cold=["cool","oliguria","confusion","narrow"].some(x=>selected.has(x));
      const id=cold?(wet?"cold-wet":"cold-dry"):(wet?"warm-wet":"warm-dry"),p=content.profiles.find(x=>x.id===id);
      result.innerHTML=`<p class="eyebrow">Likely bedside profile</p><div class="big-result">${p.title}</div><h2>${p.perfusion} perfusion · ${p.congestion} congestion</h2><p>${p.priority}</p><div class="callout warning"><h3>Recheck</h3><p>Confirm blood pressure, oxygenation, JVP, urine output, lactate, organs, ultrasound, and response to treatment.</p></div>`;addSpeechButtons(result);
    });
  }

  function initTherapyLab(){
    const button=$("#build-therapy"),result=$("#therapy-result");if(!button||!result)return;
    const scenarios={
      "stable-hfref":{title:"Stable symptomatic HFrEF",steps:["Confirm euvolemia and cause.","Build all four foundational classes early at tolerated doses.","Use loop diuretic only for congestion.","Reassess EF, rhythm, iron, ischemia, adherence, rehabilitation, ICD/CRT eligibility, and referral triggers."]},
      wet:{title:"Congested but perfused",steps:["Decongest first and identify the precipitant.","Continue or optimize chronic disease-modifying therapy as hemodynamics and organs permit.","Do not use an inotrope for uncomplicated congestion."]},
      hfpef:{title:"Cardiometabolic HFpEF",steps:["Confirm true HFpEF and exclude mimics.","Treat congestion and optimize hypertension, obesity, diabetes, CKD, AF, ischemia, and sleep apnea.","Use current phenotype-directed disease-modifying therapy, with SGLT2 inhibition foundational when suitable."]},
      shock:{title:"Cold and hypotensive",steps:["This is an emergency perfusion problem, not a routine chronic-titration visit.","Define the cause with urgent ECG and bedside echo, support pressure and output, and activate shock expertise.","Avoid starting or escalating beta-blocker during active shock."]},
      improved:{title:"HF with improved EF",steps:["Interpret the trajectory as remission or improvement, not automatic cure.","Continue disease-modifying therapy in general.","Reassess etiology, arrhythmia, family risk, device history, tolerance, and follow-up."]},
      af:{title:"HF with atrial fibrillation",steps:["Determine whether AF is cause, consequence, or both.","Control rate or pursue rhythm strategy according to phenotype and symptoms.","Assess anticoagulation using the relevant stroke-risk framework; HF alone is not an anticoagulation indication without a recognized reason."]}
    };
    button.addEventListener("click",()=>{
      const s=scenarios[$("#therapy-scenario").value],constraint=$("#therapy-constraint").value,extra={none:"No major constraint selected: pursue the full evidence-based plan with routine monitoring.",lowbp:"Low BP: verify congestion and perfusion, reduce nonessential BP-lowering drugs, and sequence therapies carefully rather than abandoning all GDMT.",highk:"Hyperkalemia: review supplements, diet, kidney function, interacting drugs, RAAS/MRA exposure, and specialist strategies.",renal:"Renal dysfunction: distinguish congestion, low perfusion, intrinsic kidney disease, and expected hemodynamic change; monitor closely and individualize therapy.",brady:"Bradycardia or conduction disease: reassess beta-blocker dose, digoxin, other nodal blockers, rhythm cause, and pacing need.",congestion:"Severe active congestion: decongest and stabilize before aggressive beta-blocker initiation or escalation."}[constraint];
      result.innerHTML=`<p class="eyebrow">Reasoning plan</p><h2>${s.title}</h2><ol class="step-list">${s.steps.map(x=>`<li>${x}</li>`).join("")}</ol><div class="callout warning"><h3>Constraint</h3><p>${extra}</p></div>`;addSpeechButtons(result);
    });button.click();
  }

  function renderCases(){
    const root=$("#case-lab");if(!root)return;const item=content.cases[state.caseIndex];
    root.innerHTML=`<div class="case-shell"><div><p class="eyebrow">Choose a case</p><div class="case-list" id="case-list">${content.cases.map((x,i)=>`<button type="button" class="${i===state.caseIndex?"active":""}" data-case-index="${i}"><strong>${i+1}. ${x.title}</strong><small>${x.tag}</small></button>`).join("")}</div></div><div class="case-card speech-unit"><p class="eyebrow">Case ${state.caseIndex+1} of ${content.cases.length} · ${item.tag}</p><h2>${item.title}</h2><p>${item.stem}</p><div class="case-prompt"><strong>Your task</strong><p>${item.question}</p></div><button class="primary-button" id="reveal-case" type="button">Reveal reasoning</button><div class="answer-box" id="case-answer"><strong>Reasoned answer</strong><p>${item.answer}</p><h3>Key pearls</h3><ul class="clean-list">${item.pearls.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="choice-row" style="margin-top:17px"><button class="secondary-button" id="previous-case" type="button" ${state.caseIndex===0?"disabled":""}><strong>← Previous case</strong></button><button class="secondary-button" id="next-case" type="button" ${state.caseIndex===content.cases.length-1?"disabled":""}><strong>Next case →</strong></button></div></div></div>`;
    $("#case-list",root).addEventListener("click",e=>{const b=e.target.closest("[data-case-index]");if(!b)return;state.caseIndex=Number(b.dataset.caseIndex);renderCases()});
    $("#reveal-case",root).addEventListener("click",e=>{$("#case-answer",root).classList.add("revealed");e.currentTarget.hidden=true});
    $("#previous-case",root).addEventListener("click",()=>{if(state.caseIndex>0){state.caseIndex--;renderCases()}});
    $("#next-case",root).addEventListener("click",()=>{if(state.caseIndex<content.cases.length-1){state.caseIndex++;renderCases()}});addSpeechButtons(root);
  }

  function renderFlashcards(){
    const root=$("#flashcard-lab");if(!root)return;const tags=["All",...new Set(content.flashcards.map(x=>x.tag))],cards=content.flashcards.filter(x=>state.flashFilter==="All"||x.tag===state.flashFilter);
    root.innerHTML=`<div class="flash-toolbar"><div><strong>${cards.length} cards</strong><p class="small muted" style="margin:2px 0 0">Click or press Enter/Space to flip each card.</p></div><div class="choice-row"><button class="secondary-button" id="reveal-flashcards" type="button">Reveal all</button><button class="secondary-button" id="reset-flashcards" type="button">Reset</button></div></div><div class="flash-filters" id="flash-filters">${tags.map(tag=>`<button class="chip-button ${tag===state.flashFilter?"selected":""}" type="button" data-flash-filter="${escapeHTML(tag)}">${tag}</button>`).join("")}</div><div class="flash-grid" id="flash-grid">${cards.map((x,i)=>`<button class="flashcard" type="button" data-flash-index="${i}" aria-pressed="false" aria-label="Flashcard: ${escapeHTML(x.q)}"><span class="flash-inner"><span class="flash-face flash-front"><span class="flash-tag">${x.tag}</span><strong>${x.q}</strong><span class="flash-hint">Click or press Enter to reveal</span></span><span class="flash-face flash-back"><span class="flash-tag">Answer</span><strong>${x.a}</strong><span class="flash-hint">Click to return</span></span></span></button>`).join("")}</div>`;
    $("#flash-filters",root).addEventListener("click",e=>{const b=e.target.closest("[data-flash-filter]");if(!b)return;state.flashFilter=b.dataset.flashFilter;renderFlashcards()});
    $("#flash-grid",root).addEventListener("click",e=>{const card=e.target.closest(".flashcard");if(!card)return;card.classList.toggle("flipped");card.setAttribute("aria-pressed",card.classList.contains("flipped")?"true":"false")});
    $("#reveal-flashcards",root).addEventListener("click",()=>{$$(".flashcard",root).forEach(card=>{card.classList.add("flipped");card.setAttribute("aria-pressed","true")})});
    $("#reset-flashcards",root).addEventListener("click",()=>{$$(".flashcard",root).forEach(card=>{card.classList.remove("flipped");card.setAttribute("aria-pressed","false")})});
  }

  function renderQuiz(){
    const root=$("#quiz-lab");if(!root)return;const total=content.quiz.length,qState=state.quiz;
    if(!Number.isInteger(qState.index)||qState.index<0||qState.index>=total)state.quiz={...initialQuiz};
    if(qState.finished){
      const pct=Math.round(qState.score/total*100),message=pct>=85?"Excellent heart-failure reasoning.":pct>=70?"Strong result. Review the weaker phenotype and acute-care areas.":pct>=50?"Good foundation. Revisit mechanisms, profiles, and treatment roles.":"Rebuild the core syndrome and warm/cold, wet/dry framework, then try again.";
      root.innerHTML=`<div class="score-panel"><p class="eyebrow">Quiz complete</p><div class="score-number">${qState.score} / ${total}</div><h2>${message}</h2><p class="muted">Your score is stored locally in this browser until you restart.</p><button class="primary-button" id="restart-quiz" type="button">Restart quiz</button></div>`;
      $("#restart-quiz",root).addEventListener("click",()=>{state.quiz={...initialQuiz};writeJSON(KEYS.quiz,state.quiz);renderQuiz()});return;
    }
    const question=content.quiz[qState.index];
    root.innerHTML=`<div class="quiz-shell"><div class="quiz-progress"><strong>Question ${qState.index+1} of ${total}</strong><span>Score ${qState.score}</span></div><div class="quiz-track"><span style="width:${qState.index/total*100}%"></span></div><div class="quiz-card"><h2>${question.q}</h2><div class="quiz-choices">${question.choices.map((choice,i)=>`<button class="choice-button ${qState.answered?(i===question.answer?"correct":i===qState.selected?"wrong":""):""}" type="button" data-quiz-choice="${i}" ${qState.answered?"disabled":""}>${String.fromCharCode(65+i)}. ${choice}</button>`).join("")}</div>${qState.answered?`<div class="quiz-explanation"><strong>${qState.selected===question.answer?"Correct":"Not quite"}</strong><p>${question.explanation}</p></div><button class="primary-button" id="next-question" type="button" style="margin-top:14px">${qState.index===total-1?"See final score":"Next question"}</button>`:""}</div></div>`;
    $$('[data-quiz-choice]',root).forEach(button=>button.addEventListener("click",()=>{if(qState.answered)return;qState.selected=Number(button.dataset.quizChoice);qState.answered=true;if(qState.selected===question.answer)qState.score++;writeJSON(KEYS.quiz,qState);renderQuiz()}));
    $("#next-question",root)?.addEventListener("click",()=>{if(qState.index===total-1)qState.finished=true;else{qState.index++;qState.answered=false;qState.selected=null}writeJSON(KEYS.quiz,qState);renderQuiz()});
  }

  function initRoute(route){
    const map={pathophysiology:initCompensation,investigations:initInvestigations,"four-pillars":initPillars,"echo-biomarkers":initBNP,"acute-management":initAcuteTool,"phenotype-lab":initPhenotype,"profile-lab":initProfileLab,"therapy-lab":initTherapyLab,cases:renderCases,flashcards:renderFlashcards,quiz:renderQuiz};
    if(map[route])map[route]();
  }

  document.addEventListener("click",event=>{
    const route=event.target.closest("[data-route]");if(route){event.preventDefault();navigate(route.dataset.route);return}
    if(event.target.closest(".bookmark-module")){toggleBookmark(state.route);return}
    const hit=event.target.closest("[data-search-route]");if(hit){els.search.value="";els.searchResults.hidden=true;navigate(hit.dataset.searchRoute);return}
    const saved=event.target.closest("[data-bookmark-route]");if(saved){els.bookmarkDialog.close();navigate(saved.dataset.bookmarkRoute);return}
    const remove=event.target.closest("[data-remove-bookmark]");if(remove){toggleBookmark(remove.dataset.removeBookmark);return}
    if(!event.target.closest(".search-box")&&!event.target.closest(".search-results"))els.searchResults.hidden=true;
  });
  els.menu.addEventListener("click",openSidebar);els.closeSidebar.addEventListener("click",closeSidebar);els.scrim.addEventListener("click",closeSidebar);
  els.resetProgress.addEventListener("click",()=>{state.visited=new Set([state.route]);writeJSON(KEYS.visited,[state.route]);updateNav();showToast("Progress reset")});
  els.clearBookmarks.addEventListener("click",()=>{state.bookmarks=[];writeJSON(KEYS.bookmarks,[]);renderBookmarkList();$(".bookmark-module")?.classList.remove("active");showToast("Bookmarks cleared")});
  els.bookmarksButton.addEventListener("click",()=>{renderBookmarkList();els.bookmarkDialog.showModal()});els.closeBookmarks.addEventListener("click",()=>els.bookmarkDialog.close());
  els.search.addEventListener("input",event=>searchSite(event.target.value));els.print.addEventListener("click",()=>window.print());
  els.speechRate.value=storage.get(KEYS.rate)||"0.92";els.speechRate.addEventListener("change",()=>storage.set(KEYS.rate,els.speechRate.value));
  window.addEventListener("hashchange",()=>render(routeFromHash()));window.addEventListener("beforeunload",()=>{"speechSynthesis" in window&&speechSynthesis.cancel()});
  document.addEventListener("keydown",event=>{if(event.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){event.preventDefault();els.search.focus()}if(event.key==="Escape"){els.searchResults.hidden=true;closeSidebar();if(els.bookmarkDialog.open)els.bookmarkDialog.close()}});

  buildNav();renderBookmarkList();loadVoices();if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoices;navigate(routeFromHash(),true);
})();
