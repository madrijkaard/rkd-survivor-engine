import { project, unproject, routes, allPoints, locationAt, START, DIRECTIONS, imagePath, moveActor, findPath, CROSS_Y, MENDONCA_END, WORLD_BOUNDS } from './world.js';
import { loadMapManifests } from './map-manifests.js';
import { createScene, createActorFrames, renderWorld } from './render.js';
import { BAR, insideBar } from './bar-layout.js';
import { CAMERA_VIEWS, getCameraView, setCameraView } from './projection.js';
import { createClickNavigation, WALK_SPEED, RUN_SPEED } from './click-navigation.js';
import { CHURCH_PLAZA, PLAZA_CHURCH, plazaRoads, mendoncaPoints } from './mendonca-data.js';
import { antonioPoints, ANTONIO_END, CINEMA_GARDEN } from './antonio-data.js';

const $ = id => document.getElementById(id);
const surface = $('scene'), ctx = surface.getContext('2d', { alpha: false });
const mini = $('minimap'), miniCtx = mini.getContext('2d');
const actor = { ...START, direction: 4, facing: unproject(0,-1), walkCycle: 0, moving: false, running: false };
const camera = { x: 0, y: 0, zoom: 1 }, keys = new Set(), taps = new Set(), visited = new Set(['simeao:1']);
const arrivals=new Set();
let scene, sceneViews, frames, path = [], overview = false, retro = true, currentPoint = 0;
let pathRunning = false;
let currentStreet = 'simeao';
const clickNavigation = createClickNavigation();
let turnAnimation;
let lastTime = 0, elapsed = 0, hudTime = 0, arrivalShown = false, arrivalTimer = 0, toastTimer;
let sound = null, soundEnabled = false, footstepTimer = 0;
let talkRequested = false;

function resize() {
  clickNavigation.reset();
  // Render at a lower resolution, then enlarge the baked artwork without filtering.
  const scale = retro ? Math.min(.75, 1000 / innerWidth) : Math.min(1, 1600 / innerWidth);
  surface.width = Math.round(surface.clientWidth * scale);
  surface.height = Math.round(surface.clientHeight * scale);
  ctx.imageSmoothingEnabled = !retro;
}
function cameraGoal() {
  if (overview) {
    const {x,y,w,h,height}=WORLD_BOUNDS;
    const corners = [0,height].flatMap(z=>[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([xx,yy])=>project(xx,yy,z)));
    const minX = Math.min(...corners.map(p => p.x)), maxX = Math.max(...corners.map(p => p.x));
    const minY = Math.min(...corners.map(p => p.y)) - 100, maxY = Math.max(...corners.map(p => p.y));
    const zoom = Math.min((surface.width - 80) / (maxX - minX), (surface.height - 115) / (maxY - minY));
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 - 22 / zoom, zoom };
  }
  const p = project(actor.x, actor.y), scale = surface.width / surface.clientWidth;
  const focusX=locationAt(actor.x,actor.y).route.id!=='simeao'?0:getCameraView()===1 && insideBar(actor.x,actor.y)?-45:(actor.y<410?95:45);
  return { x: p.x + focusX, y: p.y - 80, zoom: scale * (innerWidth < 600 ? 1.45 : 1.55) };
}
function updateHud() {
  const {route,point:data,city,neighborhood}=locationAt(actor.x,actor.y),point=data.id;
  const locationLabel = [city,neighborhood].filter(Boolean).join(', ').toLocaleUpperCase('pt-BR');
  if ($('cityNeighborhood').textContent !== locationLabel) $('cityNeighborhood').textContent = locationLabel;
  surface.dataset.neighborhood = neighborhood ?? '';
  visited.add(`${route.id}:${point}`);
  const inBar = insideBar(actor.x,actor.y);
  currentPoint = point;
  currentStreet = route.id;
  $('barAction').hidden = overview || (!inBar && (Math.abs(actor.x)>90 || actor.y<1820 || actor.y>2290));
  $('barAction').textContent = inBar?'Sair para a rua ↗':'Entrar no Bar O Péricles ↗';
  surface.dataset.insideBar = String(inBar); surface.dataset.talking = String(!$('dialogue').hidden);
  surface.dataset.point = point; surface.dataset.playerX = actor.x.toFixed(2); surface.dataset.playerY = actor.y.toFixed(2);
  surface.dataset.overview = String(overview); surface.dataset.moving = String(actor.moving);
  surface.dataset.movementMode = actor.moving ? (actor.running ? 'run' : 'walk') : 'idle';
  surface.dataset.arrived = String(arrivalShown);
  surface.dataset.view=CAMERA_VIEWS[getCameraView()].id;
  surface.dataset.street=route.id;
  drawMinimap();
}
function rotateCamera() {
  if(!sceneViews || modalOpen())return;
  const overlay=$('cameraTransition');
  turnAnimation?.cancel();
  overlay.width=surface.width;overlay.height=surface.height;
  overlay.getContext('2d').drawImage(surface,0,0);
  overlay.hidden=false;
  const next=(getCameraView()+1)%CAMERA_VIEWS.length;
  setCameraView(next);scene=sceneViews[next];
  const direction=project(actor.facing.x,actor.facing.y);
  actor.direction=(Math.round(Math.atan2(direction.x,direction.y)/(Math.PI/4))+8)%8;
  Object.assign(camera,cameraGoal());
  $('cameraViewNumber').textContent=`${next+1}/${CAMERA_VIEWS.length}`;
  $('rotateCamera').setAttribute('aria-pressed',String(next!==0));
  $('rotateCamera').title=`${CAMERA_VIEWS[next].label}. Q: próxima vista.`;
  document.body.classList.toggle('east-view',next===1);
  updateHud();positionPericlesButton();
  turnAnimation=overlay.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-out'});
  turnAnimation.onfinish=()=>{overlay.hidden=true;};
  notify(CAMERA_VIEWS[next].label);
  surface.focus({preventScroll:true});
}
function miniProject(x, y) { return { x: 12 + x * (mini.width-28)/(MENDONCA_END+300) + y * .0018, y: mini.height-16 - y * (mini.height-32)/3360 }; }
function drawMinimap() {
  const c = miniCtx; c.clearRect(0, 0, mini.width, mini.height);
  c.lineCap = 'round';
  const start = miniProject(0, -60), corner=miniProject(0,CROSS_Y),end = miniProject(MENDONCA_END,CROSS_Y);
  for(const [color,width] of [['#536c63',10],['#a2b295',1]]){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(start.x,start.y);c.lineTo(corner.x,corner.y);c.lineTo(end.x,end.y);c.stroke();}
  for(const [color,width] of [['#536c63',7],['#a2b295',1]]){
    c.strokeStyle=color;c.lineWidth=width;c.beginPath();antonioPoints.forEach((p,i)=>{const q=miniProject(p.x,p.y);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.lineTo(start.x,start.y);c.stroke();
  }
  c.strokeStyle='#82968a';c.lineWidth=3;
  for(const r of plazaRoads){const vertical=r.h>r.w,a=miniProject(vertical?r.x+r.w/2:r.x,vertical?r.y:r.y+r.h/2),b=miniProject(vertical?r.x+r.w/2:r.x+r.w,vertical?r.y+r.h:r.y+r.h/2);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
  for(const [r,color] of [[CHURCH_PLAZA,'#98987970'],[PLAZA_CHURCH,'#c1b393'],[CINEMA_GARDEN,'#647a535e']]){const w=r.w,h=r.h,ps=[[r.x,r.y],[r.x+w,r.y],[r.x+w,r.y+h],[r.x,r.y+h]].map(([x,y])=>miniProject(x,y));c.fillStyle=color;c.beginPath();ps.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();}
  c.fillStyle = '#647a535e'; c.strokeStyle = '#a5af7888'; c.lineWidth = 1;
  const plaza = [[70, 0], [400, 0], [400, 360], [70, 360]].map(([x, y]) => miniProject(x, y));
  c.beginPath(); plaza.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.closePath(); c.fill(); c.stroke();
  for (const p of allPoints) {
    const q = miniProject(p.x,p.y),active=p.id===currentPoint&&p.street===currentStreet; c.fillStyle = active ? '#e3c681' : visited.has(`${p.street}:${p.id}`) ? '#a9b791' : '#789084';
    c.beginPath(); c.arc(q.x, q.y, active ? 3.6 : 1.5, 0, Math.PI * 2); c.fill();
    if (p.street==='simeao'&&[1,9,17].includes(p.id)) { c.font = '8px Arial'; c.fillStyle = '#bac6b3'; c.fillText(String(p.id).padStart(2, '0'), q.x - 16, q.y + 3); }
  }
  c.fillStyle='#bac6b3';c.font='8px Arial';c.fillText(`C${mendoncaPoints.length}`,end.x-9,end.y+17);
  const antonioEnd=miniProject(ANTONIO_END.x,ANTONIO_END.y);c.fillText('A20',antonioEnd.x+6,antonioEnd.y+3);
  c.strokeStyle = '#8fa595'; c.lineWidth = 3; c.beginPath(); c.moveTo(end.x,end.y-5); c.lineTo(end.x,end.y+12); c.stroke();
  const a = miniProject(actor.x, actor.y); c.fillStyle = '#efcf83'; c.shadowColor = '#e2c477'; c.shadowBlur = 8;
  c.beginPath(); c.arc(a.x, a.y, 3, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
}
function toggleOverview() {
  closeDialogue();
  overview = !overview;
  document.body.classList.toggle('overview', overview); $('mapToggle').classList.toggle('active', overview);
  $('mapToggle').setAttribute('aria-pressed', String(overview)); $('overviewHint').hidden = !overview;
  $('arrival').hidden = true; surface.focus({ preventScroll: true }); updateHud();
}
function reset() {
  closeDialogue();
  Object.assign(actor, START, { direction: 4, facing:unproject(0,-1), moving: false, running: false, walkCycle: 0 }); path = []; pathRunning = false; clickNavigation.reset(); keys.clear(); taps.clear();
  visited.clear(); visited.add('simeao:1'); arrivals.clear();arrivalShown = false; $('arrival').hidden = true;
  if (overview) toggleOverview(); Object.assign(camera, cameraGoal()); updateHud(); surface.focus({ preventScroll: true });
}
function notify(text) {
  $('destinationLabel').textContent = text; $('destinationLabel').hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('destinationLabel').hidden = true; }, 1800);
}
function navigate(destination, forConversation=false, running=false) {
  if(!forConversation)closeDialogue();
  const route = findPath(actor, destination);
  if (!route) { notify(insideBar(actor.x,actor.y)?'Escolha um espaço livre entre as mesas.':'Não há passagem por aqui. Selecione a rua, a praça ou uma porta aberta.'); return false; }
  path = route; pathRunning = running;
  if (overview) toggleOverview();
  surface.focus({ preventScroll: true });
  return true;
}
function closeDialogue(){talkRequested=false;$('dialogue').hidden=true;}
function showDialogue(){
  talkRequested=false;path=[];pathRunning=false;clickNavigation.reset();keys.clear();taps.clear();actor.moving=false;actor.running=false;
  $('dialogueText').textContent=BAR.greeting;$('dialogue').hidden=false;
  updateHud();
}
function talkToPericles(){
  if(!insideBar(actor.x,actor.y) || overview)return;
  if(Math.hypot(actor.x-BAR.talkSpot.x,actor.y-BAR.talkSpot.y)<12){showDialogue();return;}
  talkRequested=navigate(BAR.talkSpot,true);
}
function positionPericlesButton(){
  const button=$('periclesHit');
  button.hidden=!insideBar(actor.x,actor.y)||overview||modalOpen();
  if(button.hidden)return;
  const p=project(BAR.owner.x,BAR.owner.y),ratio=surface.clientWidth/surface.width;
  const x=(surface.width/2+(p.x-camera.x)*camera.zoom)*ratio;
  const y=(surface.height/2+(p.y-camera.y)*camera.zoom)*ratio;
  button.style.left=`${x}px`;button.style.top=`${y}px`;
  button.style.width=`${40*camera.zoom*ratio}px`;button.style.height=`${66*camera.zoom*ratio}px`;
}
$('barAction').addEventListener('click',()=>navigate(insideBar(actor.x,actor.y)?BAR.exit:BAR.entry));
$('periclesHit').addEventListener('click',talkToPericles);
$('closeDialogue').addEventListener('click',()=>{closeDialogue();surface.focus({preventScroll:true});});
function navigateByPointer(event, destinationAtPointer) {
  if (!scene || event.button !== 0 || event.isPrimary === false || modalOpen()) return;
  event.preventDefault();
  const intent = clickNavigation.select({
    x: event.clientX, y: event.clientY, time: event.timeStamp,
    source: event.currentTarget.id, type: event.pointerType
  }, destinationAtPointer);
  if (!navigate(intent.destination, false, intent.running)) clickNavigation.reset();
}
surface.addEventListener('pointerdown', event => navigateByPointer(event, () => {
  const bounds = surface.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * surface.width / bounds.width, y = (event.clientY - bounds.top) * surface.height / bounds.height;
  if(!overview && !insideBar(actor.x,actor.y)){
    for(const door of BAR.doors){
      const p=project(-80,door.y+door.w/2,22),dx=x-(surface.width/2+(p.x-camera.x)*camera.zoom),dy=y-(surface.height/2+(p.y-camera.y)*camera.zoom);
      if(Math.abs(dx)<19*camera.zoom && Math.abs(dy)<26*camera.zoom)return {x:-106,y:door.y+door.w/2};
    }
  }
  return unproject((x - surface.width / 2) / camera.zoom + camera.x, (y - surface.height / 2) / camera.zoom + camera.y);
}));
mini.style.cursor = 'pointer'; mini.title = 'Um clique para caminhar; dois cliques rápidos para correr até o trecho';
mini.addEventListener('pointerdown', event => navigateByPointer(event, () => {
  const rect = mini.getBoundingClientRect(), x=(event.clientX-rect.left)*mini.width/rect.width,y = (event.clientY - rect.top) * mini.height / rect.height;
  const distance=p=>{const q=miniProject(p.x,p.y);return Math.hypot(q.x-x,q.y-y);};
  const point=allPoints.reduce((best,p)=>distance(p)<distance(best)?p:best);
  return {x:point.x,y:point.y};
}));
// A UI action or keyboard input separates two clicks into independent commands.
window.addEventListener('pointerdown', event => {
  if (event.target !== surface && event.target !== mini) clickNavigation.reset();
}, { capture: true });
surface.addEventListener('pointercancel', () => clickNavigation.reset());
mini.addEventListener('pointercancel', () => clickNavigation.reset());

const controlKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight'];
const modalOpen = () => $('referenceDialog').open || $('helpDialog').open;
window.addEventListener('keydown', event => {
  clickNavigation.reset();
  if (modalOpen()) return;
  if (controlKeys.includes(event.code)) { event.preventDefault(); closeDialogue(); keys.add(event.code); if (!event.repeat) taps.add(event.code); path = []; pathRunning = false; }
  if(event.code==='Escape')closeDialogue();
  if (event.repeat) return;
  if (event.code === 'KeyM') toggleOverview();
  if (event.code === 'KeyQ') rotateCamera();
  if (event.code === 'KeyE') showReference();
  if (event.code === 'KeyR') reset();
});
window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('blur', () => { keys.clear(); taps.clear(); clickNavigation.reset(); });
document.addEventListener('visibilitychange', () => { keys.clear(); taps.clear(); clickNavigation.reset(); lastTime = performance.now(); });
const virtualKeys = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
document.querySelectorAll('[data-move]').forEach(button => {
  button.addEventListener('pointerdown', event => { event.preventDefault(); closeDialogue(); button.setPointerCapture(event.pointerId); keys.add(virtualKeys[button.dataset.move]); taps.add(virtualKeys[button.dataset.move]); path = []; pathRunning = false; });
  const release = () => keys.delete(virtualKeys[button.dataset.move]);
  button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
});
$('mapToggle').addEventListener('click', toggleOverview); $('arrivalMap').addEventListener('click', toggleOverview);
$('rotateCamera').addEventListener('click',rotateCamera);
$('reset').addEventListener('click', reset);
$('effectToggle').addEventListener('click', () => {
  retro = !retro; document.body.classList.toggle('clean', !retro);
  $('effectToggle').classList.toggle('active', retro); $('effectToggle').setAttribute('aria-pressed', String(retro));
  resize(); Object.assign(camera, cameraGoal());
});
function showReference() {
  if (!scene || modalOpen()) return;
  keys.clear(); actor.moving = false;
  const {route,point}=locationAt(actor.x,actor.y);
  $('referenceTitle').textContent = `${route.name} · Ponto ${String(point.id).padStart(2, '0')}`;
  const container = $('referenceDirections'); container.replaceChildren();
  const select = i => {
    $('referenceMain').src = imagePath(point.id, i + 1,route.id);
    $('referenceMain').alt = `Ponto ${point.id} da ${route.name}, direção ${DIRECTIONS[i]}`;
    [...container.children].forEach((b, n) => { b.classList.toggle('active', n === i); b.setAttribute('aria-pressed', String(n === i)); });
  };
  DIRECTIONS.forEach((direction, i) => {
    const button = document.createElement('button'), thumbnail = document.createElement('img');
    thumbnail.src = imagePath(point.id, i + 1,route.id); thumbnail.alt = ''; button.append(thumbnail, `${i + 1} · ${direction}`);
    button.setAttribute('aria-label', `Direção ${direction}`); button.addEventListener('click', () => select(i)); container.append(button);
  });
  select(0); $('referenceDialog').showModal();
}
$('helpToggle').addEventListener('click', () => { keys.clear(); actor.moving = false; $('helpDialog').showModal(); });
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $(button.dataset.close).close()));
for (const id of ['referenceDialog', 'helpDialog']) $(id).addEventListener('close', () => surface.focus({ preventScroll: true }));

function createSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  const context = new Audio(), master = context.createGain(); master.gain.value = .23; master.connect(context.destination);
  const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate), data = buffer.getChannelData(0);
  let previous = 0;
  for (let i = 0; i < data.length; i++) { previous = (previous + (Math.random() * 2 - 1) * .02) / 1.02; data[i] = previous * 3; }
  const wind = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
  wind.buffer = buffer; wind.loop = true; filter.type = 'lowpass'; filter.frequency.value = 650; gain.gain.value = .35;
  wind.connect(filter).connect(gain).connect(master); wind.start();
  for (const frequency of [110, 164.81]) {
    const oscillator = context.createOscillator(), volume = context.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency; volume.gain.value = .025;
    oscillator.connect(volume).connect(master); oscillator.start();
  }
  return { context, master, buffer };
}
$('soundToggle').addEventListener('click', async () => {
  sound ||= createSound();
  if (!sound) { notify('Áudio não disponível neste navegador.'); return; }
  try {
    soundEnabled = !soundEnabled; await (soundEnabled ? sound.context.resume() : sound.context.suspend());
    $('soundToggle').classList.toggle('active', soundEnabled); $('soundToggle').setAttribute('aria-pressed', String(soundEnabled));
    $('soundToggle').querySelector('span').textContent = soundEnabled ? '●' : '○';
  } catch { soundEnabled = false; notify('Não foi possível ativar o áudio.'); }
});
function footstep() {
  if (!soundEnabled) return;
  const { context, master, buffer } = sound, node = context.createBufferSource(), volume = context.createGain();
  node.buffer = buffer; volume.gain.setValueAtTime(.6, context.currentTime); volume.gain.exponentialRampToValueAtTime(.001, context.currentTime + .11);
  node.connect(volume).connect(master); node.start(0, Math.random() * 3, .13);
  node.onended = () => { node.disconnect(); volume.disconnect(); };
}
function step(dt) {
  actor.moving = false; actor.running = false;
  if (modalOpen() || !$('dialogue').hidden) return;
  // Preserve a very brief key tap even if keyup arrives between animation frames.
  const pressed = code => keys.has(code) || taps.has(code);
  const left = pressed('KeyA') || pressed('ArrowLeft'), right = pressed('KeyD') || pressed('ArrowRight');
  const up = pressed('KeyW') || pressed('ArrowUp'), down = pressed('KeyS') || pressed('ArrowDown');
  const manual = left || right || up || down;
  const running = keys.has('ShiftLeft') || keys.has('ShiftRight') || (!manual && path.length > 0 && pathRunning);
  const speed = running ? RUN_SPEED : WALK_SPEED;
  let vx = 0, vy = 0;
  if (left || right || up || down) {
    const direction = unproject(Number(right) - Number(left), Number(down) - Number(up));
    const length = Math.hypot(direction.x, direction.y);
    if (length) { vx = direction.x / length * speed * dt; vy = direction.y / length * speed * dt; }
  } else if (path.length) {
    const next = path[0], dx = next.x - actor.x, dy = next.y - actor.y, length = Math.hypot(dx, dy);
    if (length <= speed * dt) { vx = dx; vy = dy; path.shift(); }
    else { vx = dx / length * speed * dt; vy = dy / length * speed * dt; }
  }
  if (vx || vy) {
    const before = { x: actor.x, y: actor.y };
    actor.moving = moveActor(actor, vx, vy);
    if (actor.moving) {
      actor.running = running;
      actor.facing={x:actor.x-before.x,y:actor.y-before.y};
      const direction = project(actor.facing.x, actor.facing.y);
      actor.direction = (Math.round(Math.atan2(direction.x, direction.y) / (Math.PI / 4)) + 8) % 8;
      actor.walkCycle += dt * (running ? 14 : 9);
      footstepTimer += dt;
      if (footstepTimer > (running ? .27 : .42)) { footstep(); footstepTimer = 0; }
    } else if (path.length) path = [];
  }
  if (!path.length) pathRunning = false;
  if(talkRequested && insideBar(actor.x,actor.y) && Math.hypot(actor.x-BAR.talkSpot.x,actor.y-BAR.talkSpot.y)<8)showDialogue();
  const atAntonio=Math.hypot(actor.x-ANTONIO_END.x,actor.y-ANTONIO_END.y)<40;
  const arrivalId=atAntonio?'antonio':actor.x>=MENDONCA_END-30&&Math.abs(actor.y-CROSS_Y)<100?'conego':null;
  if (arrivalId&&!arrivals.has(arrivalId)) {
    arrivals.add(arrivalId);arrivalShown = true; $('arrival').hidden = false; arrivalTimer = 6;
    $('arrivalTitle').textContent=atAntonio?'A esquina da Vinte e Oito de Julho':'O fim da Cônego Mendonça';
    $('arrivalDetail').textContent=atAntonio?'Você percorreu a Rua Antônio Alexandre. Siga pela rua transversal para voltar à Simeão.':'Você chegou à esquina diante da Academia Figueiredo. Explore também a praça e a Rua Antônio Alexandre.';
  }
  if (arrivalTimer > 0) { arrivalTimer -= dt; if (arrivalTimer <= 0) $('arrival').hidden = true; }
}
function animate(time) {
  const dt = Math.min(.05, (time - lastTime) / 1000 || 0); lastTime = time; elapsed += dt;
  step(dt); taps.clear();
  const goal = cameraGoal(), ease = 1 - Math.exp(-dt * (overview ? 5 : 7));
  for (const key of ['x', 'y', 'zoom']) camera[key] += (goal[key] - camera[key]) * ease;
  ctx.imageSmoothingEnabled = !retro;
  renderWorld(ctx, scene, camera, actor, frames, { width: surface.width, height: surface.height, time: elapsed, overview, path });
  positionPericlesButton();
  hudTime += dt; if (hudTime > .12) { updateHud(); hudTime = 0; }
  requestAnimationFrame(animate);
}
window.addEventListener('resize', resize);
async function init() {
  try {
    resize();
    await loadMapManifests(routes);
    const prepared = await createScene(progress => {
      $('loadFill').style.width = `${progress * 100}%`;
      $('loadStatus').textContent = progress < .78 ? 'Lendo as fachadas das três ruas…' : 'Preparando as quatro vistas do cenário…';
    });
    sceneViews=prepared.views;scene=sceneViews[getCameraView()];
    frames = createActorFrames(); Object.assign(camera, cameraGoal()); updateHud();
    surface.dataset.ready = 'true'; surface.dataset.loadedPhotos = scene.photosCount;
    $('loadFill').style.width = '100%'; $('loading').classList.add('finished');
    setTimeout(() => $('loading').remove(), 900);
    if (scene.photosCount < scene.sourceCount) notify('Algumas fotos não carregaram; usando as fachadas desenhadas.');
    lastTime = performance.now(); requestAnimationFrame(animate); surface.focus({ preventScroll: true });
  } catch (error) {
    $('loadStatus').textContent = `Não foi possível preparar o cenário: ${error.message}`;
    surface.dataset.ready = 'error'; console.error(error);
  }
}
init();
