
const library=[
{id:1,text:"NOPE.",cat:"Funny",color:"#151515",style:"outline"},{id:2,text:"LET'S GO",cat:"Football",color:"#ff4d2e",style:"bubble"},{id:3,text:"PLAY IT LOUD",cat:"Music",color:"#151515",style:"shadow"},{id:4,text:"GOOD IDEA",cat:"Type",color:"#ff4d2e",style:"clean"},{id:5,text:"BRB",cat:"Funny",color:"#151515",style:"bubble"},{id:6,text:"FULL SEND",cat:"Football",color:"#151515",style:"outline"},{id:7,text:"ONE MORE SONG",cat:"Music",color:"#ff4d2e",style:"clean"},{id:8,text:"WHY NOT?",cat:"Type",color:"#151515",style:"shadow"}];
let saved=[];
try{
  const rawSaved=localStorage.getItem("stickerStudioSaved");
  saved=rawSaved?JSON.parse(rawSaved):[];
  if(!Array.isArray(saved))saved=[];
}catch(e){
  saved=[];
  try{localStorage.removeItem("stickerStudioSaved")}catch(_){}
}
let cat="All";
let layers=[],selectedId=null,history=[],historyIndex=-1,pendingEdits={},drag=null,dragBefore=null;
let pointers=new Map(),gesture=null,autosaveTimer=null,assetStore=new Map(),suppressClick=false;
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function stateJSON(){return JSON.stringify(layers.map(l=>l.type==='image'?({...l,src:undefined}):l))}
function fullDraftJSON(){return JSON.stringify(layers)}
function saveDraft(){clearTimeout(autosaveTimer);autosaveTimer=setTimeout(()=>{try{localStorage.setItem("stickerStudioDraft",fullDraftJSON());localStorage.setItem("stickerStudioDraftAt",Date.now())}catch(e){console.warn("Draft save skipped",e)}},900)}
function commitHistory(){const snap=stateJSON();if(history[historyIndex]===snap){updateHistoryUI();saveDraft();return}history=history.slice(0,historyIndex+1);history.push(snap);historyIndex=history.length-1;updateHistoryUI();saveDraft()}
function updateHistoryUI(){if($('undoBtn'))$('undoBtn').disabled=historyIndex<=0;if($('redoBtn'))$('redoBtn').disabled=historyIndex>=history.length-1}
function restoreState(s){layers=JSON.parse(s).map(l=>{if(l.type==='image'&&!l.src&&l.assetId)l.src=assetStore.get(l.assetId)||'';return l});selectedId=layers.length?layers[layers.length-1].id:null;renderEditor();updateHistoryUI();saveDraft()}
function beginContinuousEdit(k){if(!pendingEdits[k])pendingEdits[k]=stateJSON()}
function finishContinuousEdit(k){if(!pendingEdits[k])return;const before=pendingEdits[k];delete pendingEdits[k];const after=stateJSON();if(before===after)return;history=history.slice(0,historyIndex+1);history.push(before,after);historyIndex=history.length-1;updateHistoryUI();saveDraft()}
function finishAllContinuousEdits(){Object.keys(pendingEdits).forEach(finishContinuousEdit)}
window.undo=()=>{finishAllContinuousEdits();if(historyIndex<=0)return;historyIndex--;restoreState(history[historyIndex]);toast("Undid last change")}
window.redo=()=>{finishAllContinuousEdits();if(historyIndex>=history.length-1)return;historyIndex++;restoreState(history[historyIndex]);toast("Redid last change")}
window.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"){const tag=document.activeElement?.tagName;if(tag==="INPUT"&&document.activeElement.type==="text")return;e.preventDefault();e.shiftKey?redo():undo()}})
window.show=function(id){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));$(id).classList.add('active');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===id));if(id==='explore')renderExplore();if(id==='saved')renderSaved();window.scrollTo({top:0,behavior:'smooth'})}
function styleCSS(s){let x=`color:${s.color||'#151515'};font-size:${s.size||54}px;`;if(s.style==='outline')x+='text-shadow:2px 0 #fff,-2px 0 #fff,0 2px #fff,0 -2px #fff;';if(s.style==='shadow')x+='text-shadow:5px 5px 0 rgba(0,0,0,.18);';if(s.style==='bubble')x+='background:#fff;padding:12px 16px;border-radius:18px;box-shadow:0 3px 0 rgba(0,0,0,.12);';return x}
function card(s){return `<article class="card"><div class="preview"><div class="text-layer" style="${styleCSS(s)}">${esc(s.text)}</div></div><div class="card-info"><small>${s.cat||'Created'}</small><button class="save" onclick='toggleSave(${JSON.stringify(s)})'>${saved.some(x=>x.id===s.id)?'♥':'♡'}</button></div></article>`}
function renderHome(){$('homeGrid').innerHTML=library.slice(0,4).map(card).join('')}
function renderExplore(){let q=($('search')?.value||'').toLowerCase();let arr=library.filter(s=>(cat==='All'||s.cat===cat)&&s.text.toLowerCase().includes(q));$('exploreGrid').innerHTML=arr.length?arr.map(card).join(''):`<div class="empty">Nothing here yet. Try another search.</div>`}
function renderSaved(){$('savedGrid').innerHTML=saved.length?saved.map(card).join(''):`<div class="empty"><strong>Your collection is empty.</strong><br><br>Create or save a sticker and it will appear here.</div>`}
window.setCat=(c,b)=>{cat=c;document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderExplore()}
window.toggleSave=s=>{if(saved.some(x=>x.id===s.id))saved=saved.filter(x=>x.id!==s.id);else saved=[s,...saved];localStorage.setItem('stickerStudioSaved',JSON.stringify(saved));renderHome();renderExplore();renderSaved();toast(saved.some(x=>x.id===s.id)?'Saved':'Removed')}
function newId(){return 'l'+Date.now()+Math.random().toString(16).slice(2)}
function addText(text='YOUR TEXT'){commitHistory();let l={id:newId(),type:'text',text,fontFamily:'DM Sans',fontSize:54,color:'#151515',opacity:1,scale:1,rotation:0,x:250,y:250,letterSpacing:0,lineHeight:1,textAlign:'center',outline:false,outlineWidth:3,outlineColor:'#ffffff',shadow:false,shadowBlur:8,shadowOffset:4,shadowColor:'#000000',curve:0,highlight:false,highlightPadding:10,highlightRadius:8,highlightColor:'#ffffff',highlightOpacity:.85,visible:true,locked:false};layers.push(l);selectedId=l.id;renderEditor();commitHistory()}
function addImage(src,name='Photo',iw=1000,ih=1000){commitHistory();const max=330,ratio=Math.max(iw,ih)/max,w=Math.max(40,iw/ratio),h=Math.max(40,ih/ratio),assetId=newId();assetStore.set(assetId,src);let l={id:newId(),assetId,type:'image',src,name,opacity:1,scale:1,rotation:0,x:250,y:250,w,h,fit:'contain',cropRatio:null,cropX:50,cropY:50,stickerOutline:0,stickerOutlineColor:'#ffffff',stickerShadow:0,visible:true,locked:false};layers.push(l);selectedId=l.id;renderEditor();commitHistory()}
window.addText=addText;function selected(){return layers.find(l=>l.id===selectedId)}
function outlineFilter(l){if(!l.stickerOutline&&!l.stickerShadow)return 'none';const f=[];if(l.stickerOutline){const r=Math.max(1,Math.min(20,l.stickerOutline)),c=l.stickerOutlineColor||'#fff';for(let i=0;i<8;i++){const a=Math.PI*2*i/8;f.push(`drop-shadow(${Math.cos(a)*r}px ${Math.sin(a)*r}px 0 ${c})`)}}if(l.stickerShadow)f.push(`drop-shadow(${l.stickerShadow/2}px ${l.stickerShadow/2}px ${l.stickerShadow}px rgba(0,0,0,.35))`);return f.join(' ')}
function renderEditor(){const stage=$('stage');const oldV=$('guideV'),oldH=$('guideH');stage.innerHTML='';if(oldV)stage.appendChild(oldV);if(oldH)stage.appendChild(oldH);layers.forEach(l=>{if(l.visible===false)return;const el=document.createElement('div');el.className='layer'+(l.id===selectedId?' selected':'')+(l.locked?' locked':'');el.dataset.id=l.id;el.style.left=l.x+'px';el.style.top=l.y+'px';el.style.opacity=l.opacity;el.style.transform=`translate(-50%,-50%) rotate(${l.rotation}deg) scale(${l.scale})`;
if(l.type==='text'){el.className+=' text-layer';el.style.fontFamily=`"${l.fontFamily}"`;el.style.fontSize=l.fontSize+'px';el.style.color=l.color;el.style.letterSpacing=(l.letterSpacing||0)+'px';el.style.lineHeight=l.lineHeight||1;el.style.textAlign=l.textAlign||'center';if(l.highlight){el.style.backgroundColor=hexToRgba(l.highlightColor||'#fff',l.highlightOpacity??.85);el.style.padding=(l.highlightPadding||0)+'px';el.style.borderRadius=(l.highlightRadius||0)+'px';el.style.boxDecorationBreak='clone';el.style.webkitBoxDecorationBreak='clone'}if(l.outline){el.style.webkitTextStroke=`${l.outlineWidth||1}px ${l.outlineColor||'#fff'}`;el.style.paintOrder='stroke fill'}if(l.shadow){const o=l.shadowOffset||0;el.style.textShadow=`${o}px ${o}px ${l.shadowBlur||0}px ${l.shadowColor||'#000'}`}if(l.curve){el.innerHTML=curvedTextSVG(l);el.style.backgroundColor='transparent';el.style.padding='0';el.style.width=Math.max(220,Math.abs(l.curve)*5+220)+'px';el.style.height=Math.max(120,Math.abs(l.curve)*2+120)+'px'}else{const span=document.createElement('span');span.className='text-content';span.textContent=l.text||'TEXT';el.appendChild(span)}}else{const img=document.createElement('img');img.className='layer-media';img.src=l.src;img.style.width=l.w+'px';img.style.height=l.h+'px';img.style.objectFit=l.fit==='cover'?'cover':'contain';img.style.objectPosition=`${l.cropX??50}% ${l.cropY??50}%`;img.style.filter=outlineFilter(l);el.appendChild(img)}
const del=document.createElement('button');del.className='delete';del.textContent='×';del.onclick=e=>{e.stopPropagation();deleteLayer(l.id)};el.appendChild(del);
/* V9.3: no canvas transform handles. A pointer on the object always means MOVE. Scale and rotation are controlled only by the property sliders. */
el.onpointerdown=e=>beginPointer(e,l.id);el.onclick=()=>{if(suppressClick){suppressClick=false;return}selectedId=l.id;renderEditor()};stage.appendChild(el)});renderLayers();updatePanel();saveDraft();updateGuides(null)}

function curvedTextSVG(l){const text=esc(l.text||'TEXT'),curve=l.curve||0,width=Math.max(220,Math.abs(curve)*5+220),height=Math.max(120,Math.abs(curve)*2+120),r=Math.max(70,110+Math.abs(curve)*2),cy=curve>=0?height+r*.25:-r*.15,start=curve>=0?Math.PI+.35:Math.PI-.35,end=curve>=0?-.35:.35,sweep=curve>=0?1:0,x1=width/2+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=width/2+r*Math.cos(end),y2=cy+r*Math.sin(end),path=`M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`;return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible"><defs><path id="curvePath" d="${path}"/></defs><text fill="${l.color||'#151515'}" stroke="${l.outline?(l.outlineColor||'#fff'):'none'}" stroke-width="${l.outline?(l.outlineWidth||1)*2:0}" paint-order="stroke" font-family="${esc(l.fontFamily)}" font-size="${l.fontSize}" font-weight="900" letter-spacing="${l.letterSpacing||0}px"><textPath href="#curvePath" startOffset="50%" text-anchor="middle">${text}</textPath></text></svg>`}
function updateLayerVisual(id){const l=layers.find(x=>x.id===id),el=document.querySelector(`.layer[data-id="${id}"]`);if(!l||!el)return;el.style.left=l.x+'px';el.style.top=l.y+'px';el.style.opacity=l.opacity;el.style.transform=`translate(-50%,-50%) rotate(${l.rotation}deg) scale(${l.scale})`;if(l.type==='image'){const img=el.querySelector('.layer-media');if(img){img.style.width=l.w+'px';img.style.height=l.h+'px';img.style.objectFit=l.fit==='cover'?'cover':'contain';img.style.objectPosition=`${l.cropX??50}% ${l.cropY??50}%`;img.style.filter=outlineFilter(l)}}if(l.type==='text'){el.style.textAlign=l.textAlign||'center';const span=el.querySelector('.text-content');if(span)span.textContent=l.text||'TEXT'}}
function stagePoint(e){const r=$('stage').getBoundingClientRect();return {x:(e.clientX-r.left)/(r.width/500),y:(e.clientY-r.top)/(r.height/500),r}}
function layerCenterPx(id){const el=document.querySelector(`.layer[data-id="${id}"]`);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}}
function snapPosition(l,threshold=10){let sx=null,sy=null;const candidates=[{x:250,y:250,id:null}];layers.forEach(o=>{if(o.id!==l.id&&o.visible!==false)candidates.push({x:o.x,y:o.y,id:o.id})});for(const c of candidates){if(Math.abs(l.x-c.x)<=threshold){l.x=c.x;sx=c.x}if(Math.abs(l.y-c.y)<=threshold){l.y=c.y;sy=c.y}}return {x:sx,y:sy}}
function updateGuides(g){const v=$('guideV'),h=$('guideH');if(v)v.style.display=g?.x!=null?'block':'none';if(h)h.style.display=g?.y!=null?'block':'none';if(v&&g?.x!=null)v.style.left=(g.x/5)+'%';if(h&&g?.y!=null)h.style.top=(g.y/5)+'%'}
function beginPointer(e,id){
  if(e.target.closest('.delete,.handle'))return;
  const l=layers.find(x=>x.id===id);
  if(!l||l.locked)return;
  e.preventDefault();
  selectedId=id;
  // One finger is ALWAYS move. No accidental scaling/rotation.
  // Resize and rotate are explicit actions through their handles.
  drag={id,ox:e.clientX,oy:e.clientY,x:l.x,y:l.y,before:stateJSON(),mode:'move',moved:false};
  $('stage').setPointerCapture?.(e.pointerId);
}
function beginHandle(e,id,mode){
  e.stopPropagation();
  e.preventDefault();
  const l=layers.find(x=>x.id===id);
  if(!l||l.locked)return;
  selectedId=id;
  const r=document.querySelector(`.layer[data-id="${id}"]`)?.getBoundingClientRect();
  if(!r)return;
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const startDist=Math.max(8,Math.hypot(e.clientX-cx,e.clientY-cy));
  const startAngle=Math.atan2(e.clientY-cy,e.clientX-cx);
  drag={id,ox:e.clientX,oy:e.clientY,scale:l.scale,rotation:l.rotation,before:stateJSON(),mode,centerX:cx,centerY:cy,startDist,startAngle,moved:false};
  $('stage').setPointerCapture?.(e.pointerId);
}
$('stage').addEventListener('pointermove',e=>{
  if(!drag)return;
  e.preventDefault();
  const l=layers.find(x=>x.id===drag.id);
  if(!l)return;
  const r=$('stage').getBoundingClientRect();
  const dx=e.clientX-drag.ox,dy=e.clientY-drag.oy;
  if(Math.abs(dx)+Math.abs(dy)>3){drag.moved=true;suppressClick=true}
  if(drag.mode==='move'){
    l.x=Math.max(-180,Math.min(680,drag.x+dx/(r.width/500)));
    l.y=Math.max(-180,Math.min(680,drag.y+dy/(r.height/500)));
    const guide=snapPosition(l,9);
    updateGuides(guide);
  }else if(drag.mode==='resize'){
    const d1=Math.hypot(e.clientX-drag.centerX,e.clientY-drag.centerY);
    l.scale=Math.max(.25,Math.min(3,drag.scale*(d1/drag.startDist)));
  }else if(drag.mode==='rotate'){
    l.rotation=drag.rotation+(Math.atan2(e.clientY-drag.centerY,e.clientX-drag.centerX)-drag.startAngle)*180/Math.PI;
    const snap=Math.round(l.rotation/15)*15;
    if(Math.abs(l.rotation-snap)<3)l.rotation=snap;
  }
  updateLayerVisual(l.id);
},{passive:false});
$('stage').addEventListener('pointerup',e=>{
  if(!drag)return;
  const finished=drag;
  drag=null;
  updateGuides(null);
  finishGesture(finished.before);
  renderEditor();
  setTimeout(()=>{suppressClick=false},0);
});
$('stage').addEventListener('pointercancel',e=>{
  if(drag){drag=null;updateGuides(null);renderEditor()}
  suppressClick=false;
});
function finishGesture(before){const after=stateJSON();if(before===after)return;history=history.slice(0,historyIndex+1);history.push(before,after);historyIndex=history.length-1;updateHistoryUI();saveDraft()}

function renderLayers(){$('layers').innerHTML=layers.length?layers.slice().reverse().map(l=>`<div class="layer-row ${l.id===selectedId?'active':''}" onclick="selectLayer('${l.id}')"><div class="layer-thumb">${l.type==='image'?`<img src="${l.src}">`:'T'}</div><div class="layer-name">${esc(l.type==='text'?l.text||'Text':l.name||'Photo')}</div><div class="layer-order"><button class="mini" onclick="event.stopPropagation();moveLayer('${l.id}',1)">↑</button><button class="mini" onclick="event.stopPropagation();moveLayer('${l.id}',-1)">↓</button></div></div>`).join(''):`<div class="status">No layers yet.</div>`}
window.selectLayer=id=>{selectedId=id;renderEditor()}
window.moveLayer=(id,dir)=>{const i=layers.findIndex(x=>x.id===id),j=i+dir;if(i<0||j<0||j>=layers.length)return;commitHistory();[layers[i],layers[j]]=[layers[j],layers[i]];selectedId=id;renderEditor();commitHistory()}
function deleteLayer(id){commitHistory();layers=layers.filter(x=>x.id!==id);if(selectedId===id)selectedId=layers.length?layers[layers.length-1].id:null;renderEditor();commitHistory()}
window.duplicateSelected=()=>{const l=selected();if(!l)return;commitHistory();const n=JSON.parse(JSON.stringify(l));n.id=newId();n.x=Math.min(620,n.x+24);n.y=Math.min(620,n.y+24);layers.push(n);selectedId=n.id;renderEditor();commitHistory();toast('Layer duplicated')}
window.toggleSelectedVisibility=()=>{const l=selected();if(!l)return;commitHistory();l.visible=l.visible===false;renderEditor();commitHistory()}
window.toggleSelectedLock=()=>{const l=selected();if(!l)return;commitHistory();l.locked=!l.locked;renderEditor();commitHistory();toast(l.locked?'Layer locked':'Layer unlocked')}
function updatePanel(){const l=selected();$('selectionControls').textContent=l?`${l.type==='text'?'Text':'Image'} layer selected. Drag to move. Use the black handle to resize and the red handle to rotate.`:'Select a layer on the canvas.';if(!l){$('textControls').style.display='none';$('textEffectsControls').style.display='none';$('presetControls').style.display='none';$('imageControls').style.display='none';return}$('opacity').value=l.opacity*100;$('opacityVal').textContent=Math.round(l.opacity*100)+'%';$('scale').value=Math.round(l.scale*100);$('scaleVal').textContent=Math.round(l.scale*100)+'%';$('rotation').value=l.rotation;$('rotationVal').textContent=Math.round(l.rotation)+'°';$('zoom').value=Math.round(l.scale*100);$('zoomVal').textContent=Math.round(l.scale*100)+'%';$('color').value=l.color||'#151515';$('colorHex').value=(l.color||'#151515').toUpperCase();$('textControls').style.display=l.type==='text'?'block':'none';$('textEffectsControls').style.display=l.type==='text'?'block':'none';$('presetControls').style.display=l.type==='text'?'block':'none';$('imageControls').style.display=l.type==='image'?'block':'none';$('removeBgBtn').disabled=l.type!=='image';if(l.type==='image'){$('cropX').value=l.cropX??50;$('cropXVal').textContent=Math.round(l.cropX??50);$('cropY').value=l.cropY??50;$('cropYVal').textContent=Math.round(l.cropY??50);$('mediaOutline').value=l.stickerOutline||0;$('mediaOutlineVal').textContent=l.stickerOutline||0;$('mediaOutlineColor').value=l.stickerOutlineColor||'#ffffff';$('mediaOutlineHex').value=(l.stickerOutlineColor||'#ffffff').toUpperCase();$('mediaShadow').value=l.stickerShadow||0;$('mediaShadowVal').textContent=l.stickerShadow||0}if(l.type==='text'){$('textValue').value=l.text;$('fontSize').value=l.fontSize;$('fontSizeVal').textContent=l.fontSize;document.querySelectorAll('.align-btn').forEach(b=>b.classList.toggle('on',b.dataset.align===(l.textAlign||'center')));$('letterSpacing').value=l.letterSpacing||0;$('letterVal').textContent=l.letterSpacing||0;$('lineHeight').value=(l.lineHeight||1)*100;$('lineVal').textContent=(l.lineHeight||1).toFixed(1);$('outlineToggle').classList.toggle('on',!!l.outline);$('shadowToggle').classList.toggle('on',!!l.shadow);$('curveToggle').classList.toggle('on',!!l.curve);$('highlightToggle').classList.toggle('on',!!l.highlight);$('outlineControls').style.display=l.outline?'block':'none';$('shadowControls').style.display=l.shadow?'block':'none';$('curveControls').style.display=l.curve?'block':'none';$('highlightControls').style.display=l.highlight?'block':'none';$('outlineWidth').value=l.outlineWidth||3;$('outlineWidthVal').textContent=l.outlineWidth||3;$('outlineColor').value=l.outlineColor||'#ffffff';$('outlineColorHex').value=(l.outlineColor||'#ffffff').toUpperCase();$('shadowBlur').value=l.shadowBlur||0;$('shadowBlurVal').textContent=l.shadowBlur||0;$('shadowOffset').value=l.shadowOffset||0;$('shadowOffsetVal').textContent=l.shadowOffset||0;$('shadowColor').value=l.shadowColor||'#000';$('shadowColorHex').value=(l.shadowColor||'#000').toUpperCase();$('curveAmount').value=l.curve||45;$('curveVal').textContent=l.curve||45;$('highlightPad').value=l.highlightPadding||10;$('highlightPadVal').textContent=l.highlightPadding||10;$('highlightRadius').value=l.highlightRadius||8;$('highlightRadiusVal').textContent=l.highlightRadius||8;$('highlightColor').value=l.highlightColor||'#fff';$('highlightColorHex').value=(l.highlightColor||'#fff').toUpperCase();$('highlightOpacity').value=(l.highlightOpacity??.85)*100;$('highlightOpacityVal').textContent=Math.round((l.highlightOpacity??.85)*100)+'%';document.querySelectorAll('.font-btn').forEach(b=>b.classList.toggle('active',b.textContent.trim().toLowerCase().startsWith(l.fontFamily.split(' ')[0].toLowerCase())))}}
window.setProp=(k,v)=>{const l=selected();if(!l)return;beginContinuousEdit('p:'+l.id+':'+k);l[k]=v;if(k==='fontSize')$('fontSizeVal').textContent=v;if(k==='opacity')$('opacityVal').textContent=Math.round(v*100)+'%';if(k==='rotation')$('rotationVal').textContent=Math.round(v)+'°';updateLayerVisual(l.id);if(k==='fontSize')updateTextGeometry(l);saveDraft()}
window.setTextProp=(k,v)=>{const l=selected();if(!l||l.type!=='text')return;beginContinuousEdit('t:'+l.id+':'+k);l[k]=v;const map={letterSpacing:['letterVal',v],lineHeight:['lineVal',(+v).toFixed(1)],outlineWidth:['outlineWidthVal',v],shadowBlur:['shadowBlurVal',v],shadowOffset:['shadowOffsetVal',v],curve:['curveVal',v],highlightPadding:['highlightPadVal',v],highlightRadius:['highlightRadiusVal',v],highlightOpacity:['highlightOpacityVal',Math.round(v*100)+'%']};if(map[k])$(map[k][0]).textContent=map[k][1];renderEditor()}
let visualRaf=0;window.setImageProp=(k,v)=>{const l=selected();if(!l||l.type!=='image')return;beginContinuousEdit('i:'+l.id+':'+k);l[k]=v;if(k==='stickerOutline')$('mediaOutlineVal').textContent=v;if(k==='stickerShadow')$('mediaShadowVal').textContent=v;cancelAnimationFrame(visualRaf);visualRaf=requestAnimationFrame(()=>updateLayerVisual(l.id))};window.setCropPosition=(axis,v)=>{const l=selected();if(!l||l.type!=='image')return;beginContinuousEdit('crop:'+l.id+':'+axis);l[axis==='x'?'cropX':'cropY']=v;$(axis==='x'?'cropXVal':'cropYVal').textContent=Math.round(v);cancelAnimationFrame(visualRaf);visualRaf=requestAnimationFrame(()=>updateLayerVisual(l.id))}
window.setZoom=v=>{const l=selected();if(!l)return;beginContinuousEdit('zoom:'+l.id);l.scale=Math.max(.25,Math.min(3,v/100));$('zoomVal').textContent=Math.round(l.scale*100)+'%';updateLayerVisual(l.id);saveDraft()}
window.adjustZoom=d=>{const l=selected();if(!l)return;setZoom(Math.round((l.scale+d)*100));finishContinuousEdit('zoom:'+l.id)}
window.setScale=v=>{const l=selected();if(!l)return;beginContinuousEdit('scale:'+l.id);l.scale=+v;updateLayerVisual(l.id);$('scaleVal').textContent=Math.round(l.scale*100)+'%';saveDraft()}
window.setText=v=>{const l=selected();if(!l||l.type!=='text')return;beginContinuousEdit('text:'+l.id);l.text=v;const el=document.querySelector(`.layer[data-id="${l.id}"] .text-content`);if(el)el.textContent=v||'TEXT';else renderEditor();saveDraft()}
window.setTextAlign=align=>{const l=selected();if(!l||l.type!=='text')return;commitHistory();l.textAlign=align;updateLayerVisual(l.id);document.querySelectorAll('.align-btn').forEach(b=>b.classList.toggle('on',b.dataset.align===align));commitHistory();saveDraft()}
function updateTextGeometry(l){const el=document.querySelector(`.layer[data-id="${l.id}"]`);if(!el)return;el.style.fontSize=l.fontSize+'px';el.style.letterSpacing=(l.letterSpacing||0)+'px'}
window.setFont=(f,b)=>{const l=selected();if(!l||l.type!=='text')return;commitHistory();l.fontFamily=f;document.querySelectorAll('.font-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderEditor();commitHistory()}
window.toggleEffect=e=>{const l=selected();if(!l||l.type!=='text')return;commitHistory();if(e==='outline')l.outline=!l.outline;if(e==='shadow')l.shadow=!l.shadow;if(e==='curve')l.curve=l.curve?0:45;if(e==='highlight')l.highlight=!l.highlight;renderEditor();commitHistory()}
const textPresets={meme:{fontFamily:'Archivo Black',fontSize:62,color:'#ffffff',outline:true,outlineWidth:5,outlineColor:'#151515',shadow:true,shadowBlur:8,shadowOffset:4,highlight:false,curve:0},editorial:{fontFamily:'Playfair Display',fontSize:58,color:'#151515',outline:false,shadow:false,highlight:false,curve:0},impact:{fontFamily:'Bebas Neue',fontSize:76,color:'#ffffff',outline:true,outlineWidth:4,outlineColor:'#151515',shadow:true,shadowBlur:4,shadowOffset:3,highlight:false,curve:0},bubble:{fontFamily:'DM Sans',fontSize:54,color:'#151515',outline:false,shadow:true,shadowBlur:8,shadowOffset:3,highlight:true,highlightColor:'#ffffff',highlightOpacity:.95,highlightPadding:12,highlightRadius:18,curve:0},marker:{fontFamily:'Permanent Marker',fontSize:58,color:'#ff4d2e',outline:false,shadow:false,highlight:false,curve:0},clean:{fontFamily:'DM Sans',fontSize:54,color:'#151515',outline:false,shadow:false,highlight:false,curve:0}};
window.applyTextPreset=name=>{const l=selected(),p=textPresets[name];if(!l||l.type!=='text')return;commitHistory();Object.assign(l,p);renderEditor();commitHistory();toast(name+' style applied')}
window.fitImage=()=>{const l=selected();if(!l||l.type!=='image')return;commitHistory();l.fit='contain';renderEditor();commitHistory()}
window.fillImage=()=>{const l=selected();if(!l||l.type!=='image')return;commitHistory();l.fit='cover';renderEditor();commitHistory()}
window.applyCrop=ratio=>{const l=selected();if(!l||l.type!=='image')return;commitHistory();const [a,b]=ratio.split(':').map(Number);let w=360,h=w*b/a;if(h>440){h=440;w=h*a/b}l.w=w;l.h=h;l.fit='cover';l.cropRatio=ratio;l.cropX=50;l.cropY=50;renderEditor();commitHistory();toast('Crop '+ratio)}
function validHex(v){return /^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(v)}function normalizeHex(v){v=v.trim();if(!v.startsWith('#'))v='#'+v;if(/^#[0-9a-f]{3}$/i.test(v))v='#'+v.slice(1).split('').map(x=>x+x).join('');return v.toUpperCase()}
function setColorControl(prop,hex){const v=normalizeHex(hex);if(!validHex(v)){toast('Enter a valid HEX color');return}const l=selected();if(!l)return;const key=prop==='mediaOutlineColor'?'stickerOutlineColor':prop;finishAllContinuousEdits();commitHistory();l[key]=v.toLowerCase();const n=$(prop),t=$(prop+'Hex');if(n)n.value=v;if(t)t.value=v;renderEditor();commitHistory()}
window.pickScreenColor=async prop=>{if(!window.EyeDropper){toast('Eyedropper is not supported here');return}try{const r=await new EyeDropper().open();setColorControl(prop,r.sRGBHex)}catch(e){if(e?.name!=='AbortError')toast('Could not sample color')}}
function wireColors(){['color','outlineColor','shadowColor','highlightColor','mediaOutlineColor'].forEach(prop=>{const n=$(prop),t=$(prop+'Hex');if(n)n.addEventListener('input',()=>setColorControl(prop,n.value));if(t)t.addEventListener('change',()=>setColorControl(prop,t.value))})}
async function normalizeImageFile(file){const name=(file.name||'').toLowerCase();if(name.endsWith('.heic')||name.endsWith('.heif')||file.type==='image/heic'||file.type==='image/heif'){try{const mod=await import('https://esm.sh/heic2any@0.0.4');const blob=await mod.default({blob:file,toType:'image/png'});return Array.isArray(blob)?blob[0]:blob}catch(e){toast('HEIC conversion failed. Try JPG or PNG.');throw e}}return file}
async function handleFile(file){if(!file)return;const stage=$('stage');try{stage?.classList.add('busy');$('status').textContent='Preparing photo…';file=await normalizeImageFile(file);const optimized=await optimizeImage(file);const src=optimized.data;addImage(src,file.name||'Photo',optimized.width,optimized.height);$('status').textContent='Photo added. Drag, resize or rotate it directly on the canvas.'}catch(e){console.error(e);toast('Could not add that photo')}finally{stage?.classList.remove('busy')}}
function readData(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
async function optimizeImage(file){let src,img,w0,h0;try{if(window.createImageBitmap){img=await createImageBitmap(file);w0=img.width;h0=img.height}else{src=await readData(file);img=await loadImg(src);w0=img.naturalWidth||img.width;h0=img.naturalHeight||img.height}}catch(e){src=await readData(file);img=await loadImg(src);w0=img.naturalWidth||img.width;h0=img.naturalHeight||img.height}const max=1200,scale=Math.min(1,max/Math.max(w0,h0));const w=Math.max(1,Math.round(w0*scale)),h=Math.max(1,Math.round(h0*scale));const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{alpha:true});ctx.drawImage(img,0,0,w,h);if(img.close)img.close();const type=(file.type||'').toLowerCase();const needsAlpha=type==='image/png'||type==='image/webp'||type==='image/gif';const mime=needsAlpha?'image/png':'image/webp';const data=c.toDataURL(mime,needsAlpha?undefined:.80);if(data.length>1800000&&!needsAlpha)return {data:c.toDataURL('image/jpeg',.76),width:w,height:h,mime:'image/jpeg'};return {data,width:w,height:h,mime}}
window.handleFile=handleFile
window.pasteFromClipboard=async()=>{try{if(!navigator.clipboard?.read)throw 0;const items=await navigator.clipboard.read();for(const item of items){const type=item.types.find(t=>t.startsWith('image/'));if(type){const b=await item.getType(type);return handleFile(b)}}toast('No image found in clipboard')}catch(e){toast('Clipboard permission blocked. Use paste from your keyboard.')}}
document.addEventListener('paste',e=>{const item=[...(e.clipboardData?.items||[])].find(x=>x.type.startsWith('image/'));if(item){e.preventDefault();handleFile(item.getAsFile())}})
window.removeBackground=async()=>{const l=selected();if(!l||l.type!=='image')return;try{$('removeBgBtn').disabled=true;$('status').textContent='Preparing cutout…';setProgress(5);const srcImg=await loadImg(l.src);const max=1024,sc=Math.min(1,max/Math.max(srcImg.naturalWidth,srcImg.naturalHeight));const cc=document.createElement('canvas');cc.width=Math.max(1,Math.round(srcImg.naturalWidth*sc));cc.height=Math.max(1,Math.round(srcImg.naturalHeight*sc));cc.getContext('2d').drawImage(srcImg,0,0,cc.width,cc.height);const input=await new Promise(r=>cc.toBlob(r,'image/png'));setProgress(12);$('status').textContent='Removing background…';const mod=await import('https://esm.sh/@imgly/background-removal@1.7.0');const fn=mod.default||mod.removeBackground;if(typeof fn!=='function')throw Error('unavailable');const blob=await fn(input,{progress:(k,c,t)=>{if(t)setProgress(Math.max(12,Math.min(96,Math.round(c/t*100))) )}});l.src=URL.createObjectURL(blob);if(l.assetId)assetStore.set(l.assetId,l.src);else{l.assetId=newId();assetStore.set(l.assetId,l.src)}l.fit='contain';l.name=(l.name||'photo').replace(/\.[^.]+$/,'')+' cutout.png';commitHistory();renderEditor();setProgress(100);$('status').textContent='Background removed. Outline is now ready.';setTimeout(()=>setProgress(0),700)}catch(e){console.error(e);$('status').textContent='Background removal could not load.';toast('Background removal unavailable');setProgress(0)}finally{$('removeBgBtn').disabled=false}}
window.stickerize=async()=>{const l=selected();if(!l||l.type!=='image'){toast('Select a photo first');return}await removeBackground();const x=selected();if(x&&x.type==='image'){commitHistory();x.stickerOutline=7;x.stickerOutlineColor='#ffffff';x.stickerShadow=10;renderEditor();commitHistory();toast('Stickerized')}}
function setProgress(n){$('progress').style.width=n+'%'}
window.newCanvas=()=>{finishAllContinuousEdits();if(!layers.length)return;commitHistory();layers=[];selectedId=null;renderEditor();commitHistory();localStorage.removeItem('stickerStudioDraft');toast('New sticker')}
window.saveComposition=()=>{const data={layers:layers.map(l=>({...l}))};saved=[{id:'comp'+Date.now(),text:'Composition',cat:'Created',color:'#151515',style:'clean',data},...saved];localStorage.setItem('stickerStudioSaved',JSON.stringify(saved));toast('Composition saved')}
async function renderBlob(){const base=1400,c=document.createElement('canvas');c.width=c.height=base;const ctx=c.getContext('2d',{alpha:true});ctx.clearRect(0,0,base,base);for(const l of layers){if(l.visible===false)continue;ctx.save();ctx.globalAlpha=l.opacity;ctx.translate(l.x*(base/500),l.y*(base/500));ctx.rotate(l.rotation*Math.PI/180);ctx.scale(l.scale*(base/500),l.scale*(base/500));if(l.type==='text'){drawTextCanvas(ctx,l)}else{try{const img=await loadImg(l.src);drawImageCanvas(ctx,l,img)}catch(e){console.warn('Could not render image layer',e)}}ctx.restore()}const pad=36;const px=ctx.getImageData(0,0,base,base).data;let minX=base,minY=base,maxX=-1,maxY=-1;for(let y=0;y<base;y++){for(let x=0;x<base;x++){if(px[(y*base+x)*4+3]>8){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}}}if(maxX<0)return new Blob();minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(base-1,maxX+pad);maxY=Math.min(base-1,maxY+pad);const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;out.getContext('2d').drawImage(c,minX,minY,out.width,out.height,0,0,out.width,out.height);return await new Promise(r=>out.toBlob(r,'image/png'))}

function drawTextCanvas(ctx,l){ctx.font=`900 ${l.fontSize}px "${l.fontFamily}"`;ctx.textAlign=l.textAlign||'center';ctx.textBaseline='middle';const lines=String(l.text||'TEXT').split(/\n/),lh=l.fontSize*(l.lineHeight||1),maxW=Math.max(...lines.map(t=>ctx.measureText(t).width)),totalH=lines.length*lh;if(l.highlight){const p=l.highlightPadding||0;ctx.fillStyle=hexToRgba(l.highlightColor||'#fff',l.highlightOpacity??.85);roundedRect(ctx,-maxW/2-p,-totalH/2-p,maxW+p*2,totalH+p*2,Math.min(l.highlightRadius||0,40));ctx.fill()}if(l.shadow){ctx.shadowColor=l.shadowColor||'#000';ctx.shadowBlur=l.shadowBlur||0;ctx.shadowOffsetX=l.shadowOffset||0;ctx.shadowOffsetY=l.shadowOffset||0}if(l.curve){const chars=[...String(l.text||'TEXT')],radius=Math.max(90,220-Math.abs(l.curve)),step=(Math.abs(l.curve)/100)*Math.PI/Math.max(chars.length,1),start=-(chars.length-1)*step/2;chars.forEach((ch,i)=>{const a=(l.curve>=0?1:-1)*(start+i*step),xx=Math.sin(a)*radius,yy=(l.curve>=0?-1:1)*(radius-Math.cos(a)*radius);ctx.save();ctx.translate(xx,yy);ctx.rotate(a*(l.curve>=0?1:-1));drawTextWithOutline(ctx,ch,0,0,l);ctx.restore()})}else {const x=l.textAlign==='left'?-maxW/2:l.textAlign==='right'?maxW/2:0;lines.forEach((line,i)=>drawTextWithOutline(ctx,line,x,(i-(lines.length-1)/2)*lh,l))}}
function drawTextWithOutline(ctx,text,x,y,l){if(l.outline){ctx.lineJoin='round';ctx.strokeStyle=l.outlineColor||'#fff';ctx.lineWidth=(l.outlineWidth||1)*2;ctx.strokeText(text,x,y)}ctx.fillStyle=l.color||'#151515';ctx.fillText(text,x,y)}
function drawImageCanvas(ctx,l,img){const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;let sx=0,sy=0,sw=iw,sh=ih;if(l.fit==='cover'){const target=l.w/l.h,source=iw/ih;if(source>target){sw=ih*target;sx=(iw-sw)*(l.cropX??50)/100}else{sh=iw/target;sy=(ih-sh)*(l.cropY??50)/100}}const fit=Math.min(l.w/sw,l.h/sh),dw=sw*fit,dh=sh*fit;if(l.stickerOutline){const r=Math.max(1,l.stickerOutline),c=l.stickerOutlineColor||'#fff';const f=[];for(let i=0;i<8;i++){const a=2*Math.PI*i/8;f.push(`drop-shadow(${Math.cos(a)*r}px ${Math.sin(a)*r}px 0 ${c})`)}ctx.filter=f.join(' ');ctx.drawImage(img,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.filter='none'}else{ctx.drawImage(img,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh)}if(l.stickerShadow){ctx.filter=`drop-shadow(${l.stickerShadow/2}px ${l.stickerShadow/2}px ${l.stickerShadow}px rgba(0,0,0,.35))`;ctx.drawImage(img,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.filter='none'}}
function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function hexToRgba(hex,a){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(x=>x+x).join('');const n=parseInt(hex,16);return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=async()=>{try{if(i.decode)await i.decode()}catch(_){}res(i)};i.onerror=rej;i.src=src})}
window.exportPNG=async()=>{if(!layers.length){toast('Add something first');return}finishAllContinuousEdits();const status=$('status');if(status)status.textContent='Exporting transparent PNG…';const blob=await renderBlob();const a=document.createElement('a');a.download='sticker-studio.png';a.href=URL.createObjectURL(blob);a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('PNG exported · transparent + tightly cropped');if(status)status.textContent='PNG ready for Stories, WhatsApp or Telegram.'}
window.copyPNG=async()=>{try{finishAllContinuousEdits();const blob=await renderBlob();if(!navigator.clipboard?.write)throw 0;await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);toast('Sticker copied')}catch(e){toast('Copy is not supported here. Use Export PNG.')}}
window.sharePNG=async()=>{try{finishAllContinuousEdits();const blob=await renderBlob();const file=new File([blob],'sticker-studio.png',{type:'image/png'});if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({files:[file],title:'Sticker Studio'});toast('Shared')}else{await copyPNG()}}catch(e){if(e?.name!=='AbortError')toast('Share is not available here')}}
function toast(t){const e=$('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1700)}
window.addEventListener('error',e=>{
  console.error('Sticker Studio runtime error:',e.error||e.message);
  const status=$('status');
  if(status)status.textContent='A tool hit an error. The rest of the editor is still available.';
});
window.addEventListener('unhandledrejection',e=>{
  console.error('Sticker Studio async error:',e.reason);
});

wireColors();
try{
  const draft=localStorage.getItem('stickerStudioDraft');
  if(draft){
    try{
      layers=JSON.parse(draft);
      if(!Array.isArray(layers))layers=[];
      layers=layers.map(l=>{if(l.type==='image'){if(!l.assetId)l.assetId=newId();if(l.src)assetStore.set(l.assetId,l.src)}return l});
      selectedId=layers.length?layers[layers.length-1]?.id||null:null;
    }catch(e){
      layers=[];
      try{localStorage.removeItem('stickerStudioDraft')}catch(_){}
    }
  }
  if(!layers.length)addText('YOUR STICKER');else{commitHistory();renderEditor()}
  renderHome();renderExplore();renderSaved();
}catch(e){
  console.error('Sticker Studio boot error:',e);
  const status=$('status');
  if(status)status.textContent='Something went wrong while loading the editor. Refresh to try again.';
}
