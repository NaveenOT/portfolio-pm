import {resumeText} from './resume.js';
import {profile,projects,experience,themes} from './content.js';
const app=document.querySelector('#app'),dialog=document.querySelector('#themes');
const commands={autofill:'Toggle suggestions: autofill on / autofill off',help:'All commands and keyboard shortcuts',projects:'Explore selected work',experience:'Roles and contributions',about:'A little about me',resume:'Background and resume',contact:'Start a conversation',theme:'Change your surroundings',ls:'Browse portfolio sections',whoami:'Meet the person behind the prompt',pwd:'Show your current location',history:'Commands from this session',clear:'Clear the terminal screen',home:'Back to the terminal welcome',exit:'Leave the terminal and return to the landing page'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let autofill=true;try{autofill=localStorage.getItem('portfolio-autofill')!=='off'}catch{}
let history=[],historyIndex=0,selected=0,savedTheme='green',previousFocus;
try{savedTheme=localStorage.getItem('portfolio-theme')||'green'}catch{}
if(!themes.some(t=>t.id===savedTheme))savedTheme='green';
document.body.dataset.theme=savedTheme;
const path=()=>location.hash.slice(1).replace(/^\//,'');
const go=p=>{if(!p){location.hash='/';return}if(document.querySelector('#command'))run(p);else location.hash='/terminal'};
const bar=()=>'<div class="bar"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span class="bar-title">naveen@portfolio: ~</span><span>⌘</span></div>';
function render(){const p=path();
document.body.classList.toggle('landing-mode',!p);
if(!p){document.title=`${profile.name} — Product manager portfolio`;app.innerHTML=`<div class="landing-page"><header class="landing-header"><span class="brand">n<span>_</span></span><span>PRODUCT MANAGER / PORTFOLIO</span></header><div class="landing"><section><div class="eyebrow">Curiosity → clarity → better products</div><h1>Hi, I’m ${esc(profile.name)}.<br>Let’s build<br><em>what matters.</em></h1><p class="intro">At the intersection of people, problems, and possibility. Explore my work, one command at a time.</p><button class="enter" data-go="home">Enter terminal &nbsp; ↵</button><p class="small">Keyboard first. Curiosity welcome.</p></section><button class="terminal-preview window" data-go="home" aria-label="Open full-screen terminal"><span class="preview-title"><span>● ● ●</span><span>naveen@portfolio: ~</span><span>↗</span></span><span class="preview-body"><span class="muted">portfolio shell v0.2</span><span class="preview-greeting">Hi, welcome to my portfolio.</span><span class="muted">A few commands. A world of possibilities.</span><span class="preview-commands">/projects &nbsp; /experience<br>/about &nbsp;&nbsp;&nbsp; /contact</span><span class="muted">Type /help to find your way.</span><span class="preview-prompt"><span class="accent">visitor@portfolio ~ $</span> <span class="cursor"></span></span></span><span class="window-note">Click to enter the full-screen terminal &nbsp; ↗</span></button></div><footer class="landing-footer"><span>Understand the problem. Make the tradeoff. Keep learning.</span><span>PORTFOLIO v0.2</span></footer></div>`;bind();document.querySelector('.enter').focus();return}

startSession(p);}
function outputFor(p){
let body='',title=p;const project=p.startsWith('projects/')?projects.find(x=>x.id===p.split('/')[1]):null;
if(project){title=project.title;body=`<article class="article"><span class="muted">PROJECT CASE STUDY</span><p class="eyebrow">${esc(project.type)}</p><h2>${esc(project.title)}</h2><p>${esc(project.description)}</p><span class="badge">ILLUSTRATIVE CASE STUDY · PLACEHOLDER</span>${project.sections.filter(s=>s[1]).map(([h,t])=>`<section><h3>${esc(h)}</h3><p>${esc(t)}</p></section>`).join('')}${project.image?`<figure><img src="${esc(project.image)}" alt="${esc(project.caption||'Project illustration')}"><figcaption>${esc(project.caption||'')}</figcaption></figure>`:''}</article>`}
else if(p==='projects'){body=`<div class="eyebrow">Selected work / 03 explorations</div><h2>Good products start with good questions.</h2><p class="lede">A look at the problems, decisions, and lessons behind the work.<br>These are illustrative projects, ready for the real stories.</p><div class="project-list">${projects.map((x,i)=>`<button class="project" data-go="projects/${x.id}" data-index="${i}"><span class="num">0${i+1} / ${esc(x.type)}</span><strong>${esc(x.title)}</strong><p>${esc(x.description)}</p><span class="badge">Outcome pending · Placeholder</span><span class="arrow">↗</span></button>`).join('')}</div>`}
else if(p==='home'){body=`<div class="boot">portfolio shell v0.2 &nbsp; / &nbsp; interactive session</div><pre class="ascii" aria-hidden="true">┌─────────────────────────────┐
│  NAVEEN / PRODUCT MANAGER   │
└─────────────────────────────┘</pre><h2>Hi, welcome to my portfolio.</h2><p class="lede">${esc(profile.bio)}</p><p>Type a command and press Enter to explore.</p><div class="command-directory">${['projects','experience','about','contact'].map(c=>`<div><a href="#/${c}">/${c.padEnd(14,' ')}</a><span class="muted">${commands[c]}</span></div>`).join('')}</div><p class="muted">/help lists all commands. Tab completes commands.<br>↑ ↓ recall history. /theme changes colours. Type exit to leave.</p>`}
else if(p==='help'||p==='ls'){body=`<div class="eyebrow">Field guide</div><h2>A few commands. Plenty to explore.</h2><p class="lede">The slash is optional. Click a command to try it.</p>${Object.entries(commands).filter(([k])=>p==='help'||['projects','experience','about','resume','contact'].includes(k)).map(([k,v])=>`<div class="help-row"><a href="#" data-command="${k}">/${k}</a><span>${v}</span></div>`).join('')}<h3>Keyboard shortcuts</h3><p class="lede">Tab / Shift+Tab move focus · ↑ ↓ navigate lists or input history · Enter select · Esc focus prompt. Tab in a partially typed command completes it; Tab again moves on.</p>`}
else if(p==='resume'){body=`<h2>Resume</h2><button data-pdf>Open PDF viewer</button> <a href="resume.pdf" download>Download PDF ↓</a><pre class="text-output resume-text">${esc(resumeText)}</pre>`}
else if(p==='experience'){body=`<div class="eyebrow">${p==='resume'?'At a glance':'The journey so far'}</div><h2>Experience, with intention.</h2><p class="lede">Sample roles below. Real experience and achievements will be added here.</p><article class="article">${experience.map(x=>`<section><h3>${esc(x.dates)}</h3><h2>${esc(x.title)}</h2><span class="badge">${esc(x.company)}</span><p>${esc(x.summary)}</p></section>`).join('')}</article>${p==='resume'?(profile.resume?`<p><a href="${esc(profile.resume)}" download>Download resume ↓</a></p>`:'<p class="muted">Resume download will be available once a file is added.</p>'):''}`}
else if(p==='about'){body=`<article class="article"><div class="eyebrow">The person behind the prompt</div><h2>Hi again. I’m ${esc(profile.name)}.</h2><p>${esc(profile.bio)}</p><span class="badge">DRAFT PROFILE</span><h3>How I approach products</h3><p>Start with the problem. Listen closely. Make the tradeoffs explicit. Build something small enough to learn from, then let the evidence guide the next step.</p><h3>Beyond the roadmap</h3><p>Space for personal interests, motivations, and the things that keep curiosity alive.</p></article>`}
else if(p==='contact'){body=`<div class="eyebrow">Keep the conversation going</div><h2>Something on your mind?</h2><p class="lede">Good products begin with a conversation.</p>${profile.email?`<p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></p><button id="copy-email">Copy email</button>`:'<p class="muted">Contact details are coming soon.</p><span class="badge">PLACEHOLDER · NO CONTACT DETAILS ADDED</span>'}${profile.links.map(x=>`<p><a href="${esc(x.url)}">${esc(x.label)} ↗</a></p>`).join('')}`}
else {title='Page not found';body='<h2>This path is still unexplored.</h2><p><a href="#/home">Return home →</a></p>'}
return body;}
function startSession(initial){
document.title='Terminal — Naveen’s portfolio';
app.innerHTML=`<div class="workspace"><div class="shell"><div class="terminal-status"><span>naveen@portfolio</span><span>interactive session</span><button id="autofill-toggle" aria-pressed="${autofill}">Autofill: ${autofill?'on':'off'}</button></div><div class="session-scroll"><div id="transcript"></div><div class="command-area"><div class="suggestions"></div><form class="prompt"><label for="command">visitor@portfolio <span class="muted">~</span> $</label><input id="command" aria-label="Terminal command" autocomplete="off" spellcheck="false" autocapitalize="off" enterkeyhint="go"><button type="submit" aria-label="Run command">↵</button></form></div></div><div class="hint"><span>Tab complete · ↑ ↓ history / select · Enter run · Esc prompt</span><span>clear screen · exit session · <button id="focus-command">/help</button></span></div><div class="sr-only" id="announcement" role="status" aria-live="polite"></div></div></div>`;
document.querySelector('form').onsubmit=e=>{e.preventDefault();run(document.querySelector('#command').value)};
document.querySelector('#command').onkeydown=inputKeys;
document.querySelector('#command').oninput=showSuggestions;
document.querySelector('#autofill-toggle').onclick=()=>setAutofill(!autofill);
document.querySelector('#focus-command').onclick=()=>run('help');
appendOutput(outputFor('home'));
if(!['home','terminal'].includes(initial))run(initial);
window.history.replaceState(null,'','#/terminal');
}
function appendOutput(html,command){
const block=document.createElement('section');block.className='terminal-output';
block.innerHTML=(command?`<div class="command-echo"><span class="accent">visitor@portfolio ~ $</span> ${esc(command)}</div>`:'')+html;
document.querySelector('#transcript').append(block);bind();
block.querySelector('[data-pdf]')?.addEventListener('click',openResume);
block.querySelectorAll('a[href^="#/"]').forEach(a=>a.onclick=e=>{e.preventDefault();run(a.getAttribute('href').slice(2))});
block.querySelector('#copy-email')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(profile.email);feedback('Email copied.')}catch{feedback('Select the email to copy it manually.')}});
document.querySelector('#command').focus({preventScroll:true});
block.scrollIntoView({block:'start'});
const list=block.querySelector('.project-list');if(list)list.querySelector('button')?.focus({preventScroll:true});
const announcement=document.querySelector('#announcement');announcement.textContent=command?`${command} output added. Type the next command or scroll to read.`:'Terminal ready.';
}
function bind(){document.querySelectorAll('[data-go]').forEach(b=>{b.onclick=()=>{if(b.dataset.index)selected=Number(b.dataset.index);go(b.dataset.go)}});document.querySelectorAll('[data-command]').forEach(b=>b.onclick=e=>{e.preventDefault();run(b.dataset.command)})}
function feedback(t){appendOutput(`<pre class="text-output">${esc(t)}</pre>`)}
function run(raw){const cmd=raw.trim().toLowerCase().replace(/^\//,'');if(!cmd)return;
history.push(raw.trim());historyIndex=history.length;
document.querySelector('#command').value='';document.querySelector('.suggestions').replaceChildren();
if(cmd==='autofill'||cmd==='autofill on'||cmd==='autofill off'){setAutofill(cmd==='autofill'?!autofill:cmd.endsWith(' on'));return appendOutput(`<p>Autofill ${autofill?'enabled':'disabled'}. Tab accepts suggestions when enabled.</p>`,raw)}
if(cmd==='resume'){appendOutput(outputFor('resume'),raw);return openResume()}
if(cmd==='exit')return go('');
if(cmd==='clear'){document.querySelector('#transcript').replaceChildren();document.querySelector('#command').focus();document.querySelector('#announcement').textContent='Screen cleared.';return}
if(cmd==='theme'){appendOutput('<p class="muted">Choose an appearance with ↑ ↓, then Enter to save.</p>',raw);return openThemes()}
if(cmd==='pwd')return appendOutput('<pre class="text-output">~/portfolio</pre>',raw);
if(cmd==='history')return appendOutput(`<pre class="text-output">${esc(history.map((v,i)=>`${i+1}  ${v}`).join('\n'))}</pre>`,raw);
if(cmd==='whoami')return appendOutput(outputFor('about'),raw);
if(commands[cmd]||projects.some(p=>'projects/'+p.id===cmd))return appendOutput(outputFor(cmd),raw);
const suggestions=Object.keys(commands).sort((a,b)=>distance(cmd,a)-distance(cmd,b)).slice(0,3);
appendOutput(`<p class="muted">Unknown command “${esc(raw.trim())}”. Try ${suggestions.map(x=>'/'+x).join(', ')} or /help.</p>`,raw);
}
function distance(a,b){let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]===b[j-1]?0:1));row=next}return row[b.length]}
function setAutofill(enabled){autofill=enabled;try{localStorage.setItem('portfolio-autofill',enabled?'on':'off')}catch{}const toggle=document.querySelector('#autofill-toggle');toggle.textContent=`Autofill: ${enabled?'on':'off'}`;toggle.setAttribute('aria-pressed',String(enabled));showSuggestions()}
function showSuggestions(){const input=document.querySelector('#command'),box=document.querySelector('.suggestions');box.replaceChildren();if(!autofill)return;const q=input.value.trim().toLowerCase().replace(/^\//,'');if(!q)return;const matches=[...Object.keys(commands),'autofill on','autofill off',...projects.map(p=>'projects/'+p.id)].filter(c=>c.startsWith(q)&&c!==q);for(const match of matches){const b=document.createElement('button');b.type='button';b.textContent='/'+match;b.onclick=()=>{input.value='/'+match;box.replaceChildren();input.focus()};box.append(b)}}
function inputKeys(e){if(autofill&&e.key==='Tab'&&!e.shiftKey&&document.querySelector('.suggestions button')){e.preventDefault();document.querySelector('.suggestions button').click();return}if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();historyIndex=Math.max(0,Math.min(history.length,historyIndex+(e.key==='ArrowUp'?-1:1)));e.target.value=history[historyIndex]||'';showSuggestions()}}
function openResume(){let viewer=document.querySelector('#resume-viewer');if(!viewer){viewer=document.createElement('dialog');viewer.id='resume-viewer';viewer.setAttribute('aria-label','Resume PDF viewer');viewer.innerHTML=`<div class="pdf-toolbar"><strong>Resume · PDF</strong><a href="resume.pdf" target="_blank" rel="noopener">Open in new tab ↗</a><button type="button" data-close>Close · Esc</button></div><object data="resume.pdf" type="application/pdf" aria-label="Naveen Product Resume"><p>Your browser cannot display embedded PDFs. <a href="resume.pdf" target="_blank" rel="noopener">Open the PDF</a> or read the complete text in the terminal.</p></object>`;document.body.append(viewer);viewer.querySelector('[data-close]').onclick=()=>viewer.close();viewer.addEventListener('close',()=>document.querySelector('#command')?.focus())}viewer.showModal();viewer.querySelector('[data-close]').focus()}
function openThemes(){previousFocus=document.activeElement;document.querySelector('#theme-options').innerHTML=themes.map(t=>`<button data-theme="${t.id}">${t.name}<br><small class="muted">${t.description}</small></button>`).join('');dialog.querySelectorAll('[data-theme]').forEach(b=>{b.onfocus=()=>document.body.dataset.theme=b.dataset.theme;b.onclick=()=>{savedTheme=b.dataset.theme;try{localStorage.setItem('portfolio-theme',savedTheme)}catch{}dialog.close();previousFocus?.focus()}});dialog.showModal();dialog.querySelector(`[data-theme="${savedTheme}"]`).focus()}
function cancelTheme(){document.body.dataset.theme=savedTheme;dialog.close();previousFocus?.focus()}
dialog.addEventListener('cancel',e=>{e.preventDefault();cancelTheme()});document.querySelector('#cancel-theme').onclick=cancelTheme;
document.addEventListener('keydown',e=>{
if(!document.querySelector('#command')||document.querySelector('#resume-viewer')?.open)return;
if(e.ctrlKey&&e.key.toLowerCase()==='l'&&!dialog.open){e.preventDefault();run('clear');return}
if(e.ctrlKey&&e.key.toLowerCase()==='c'&&!dialog.open&&!window.getSelection()?.toString()){e.preventDefault();const input=document.querySelector('#command');input.value='';document.querySelector('.suggestions').replaceChildren();feedback('^C');input.focus();return}
if(e.altKey||e.ctrlKey||e.metaKey)return;
if(!dialog.open&&['PageUp','PageDown'].includes(e.key)){e.preventDefault();const pane=document.querySelector('.session-scroll');pane.scrollBy(0,(e.key==='PageDown'?1:-1)*pane.clientHeight*.8);return}
if(!dialog.open&&e.target.tagName!=='INPUT'&&e.key.length===1&&!window.getSelection()?.toString()){e.preventDefault();const input=document.querySelector('#command');input.focus();input.value+=e.key;showSuggestions();return}
if(['ArrowDown','ArrowUp'].includes(e.key)&&e.target.tagName!=='INPUT'){const group=e.target.closest('#theme-options,.project-list,.suggestions');if(group){const items=[...group.querySelectorAll('button')],i=items.indexOf(e.target);e.preventDefault();items[(i+(e.key==='ArrowDown'?1:items.length-1))%items.length].focus()}}if(e.key==='Escape'&&!dialog.open){const suggestions=document.querySelector('.suggestions');if(suggestions?.children.length){suggestions.replaceChildren();document.querySelector('#command').focus();return}document.querySelector('#command').value='';document.querySelector('#command').focus();}});
window.addEventListener('hashchange',render);render();
