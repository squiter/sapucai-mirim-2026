'use strict';
const schedule = {
 9: {title:'Chegada & primeira noite',intro:'Sexta-feira · Instalar-se em Sapucaí-Mirim e manter o primeiro dia leve.',items:[['Tarde','Chegada & centrinho','Check-in, uma caminhada no centro e uma compra de lanches para os próximos dias.'],['Fim da tarde','Mirante do Cruzeiro','Consulte o acesso com a hospedagem e aproveite a luz do fim do dia.'],['Jantar','Uma refeição combinada','Confirme a adaptação vegana no Panela Mineira ou na Cantina da Lurdinha.'],['Noite','Primeira chance de Via Láctea','Se o céu estiver limpo, use um ponto reconhecido de dia próximo à hospedagem.','#estrelas']]},
 10: {title:'Cachoeiras & Lua Nova',intro:'Sábado · Amizade e, se houver tempo, Posses ou Ponte Nova. A noite de Lua Nova é a prioridade.',items:[['Manhã','Cachoeira da Amizade','Acesso fácil, perto do centro. Reserve de 20 minutos a 1 hora para o passeio, conforme as condições locais.','#lugares'],['Almoço','Refeição vegana combinada','Combine o almoço antes da saída ou leve um piquenique.','#vegano'],['Tarde','Posses ou Ponte Nova','Escolha uma segunda cachoeira se houver disposição e clima favorável. Evite lotar o dia. La Gorda é uma pausa opcional em São Bento, somente com abertura confirmada.','#lugares'],['Noite','Lua Nova, sessão principal','Monte a câmera ao entardecer em ponto reconhecido de dia. Leve cadeira, lanche, casaco e lanterna vermelha para algumas horas sob as estrelas.','#estrelas']]},
 11: {title:'São Bento & mais uma noite',intro:'Domingo · Bauzinho como passeio mais leve, ou Ana Chata para uma trilha mais exigente.',items:[['Manhã','Bauzinho ou Pedra Ana Chata','Escolha conforme disposição. Ana Chata exige agendamento; a subida ao Baú é uma atividade técnica, com preparo específico.','#lugares'],['Almoço','Uma pausa em São Bento','Considere Entre Vilas com reserva e menu vegano combinados; confira a distância. Brazin Burger é outra opção, com ingredientes e horário confirmados.','#vegano'],['Tarde','Centrinho & descanso','Uma caminhada, artesanato e tempo para descansar antes de fotografar. La Gorda só entra com abertura confirmada, pois o horário listado não inclui domingo.'],['Noite','Via Láctea ou jantar na cidade','Se sábado falhar, domingo é a segunda chance principal de fotografia. Se escolherem jantar em São Bento, a Bentô declara pizzas veganas e abre a partir de 18h30.','#estrelas']]},
 12: {title:'Trilha leve & retorno',intro:'Segunda-feira · Uma trilha antes do retorno, se o horário permitir. Deixe margem para o trânsito do feriado.',items:[['Manhã','Pedra da Mata ou cachoeira','Reserve 2–3 h para a trilha de 2,7 km e comunique o proprietário. Se estiverem cansados, escolham uma cachoeira ainda não visitada ou um passeio leve.','#lugares'],['Almoço','Refeição antes do retorno','Combine uma opção vegana e garanta lanches para a viagem.','#vegano'],['Retorno','Check-out & estrada','Confira os itens da câmera e ajuste a saída à distância até sua casa e ao trânsito.']] }
};
const tabs=[...document.querySelectorAll('[role=tab]')];
function renderDay(key){
 const day=schedule[key];
 tabs.forEach(t=>{const active=t.dataset.day===String(key);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});
 const panel=document.querySelector('#day-panel');panel.setAttribute('aria-labelledby','tab-'+key);panel.replaceChildren();
 const heading=document.createElement('h3');heading.className='day-heading';heading.textContent=day.title;panel.append(heading);
 const list=document.createElement('ol');list.className='timeline';
 day.items.forEach(([time,title,description,href])=>{
  const li=document.createElement('li');if(time==='Noite')li.className='night-event';
  const details=document.createElement('details');const summary=document.createElement('summary');
  const label=document.createElement('span');label.className='time-label';label.textContent=time;
  const name=document.createElement('strong');name.textContent=title;const plus=document.createElement('span');plus.className='plus';plus.textContent='＋';plus.setAttribute('aria-hidden','true');summary.append(label,name,plus);
  const content=document.createElement('div');content.className='detail-content';const text=document.createElement('p');text.textContent=description;content.append(text);
  if(href){const a=document.createElement('a');a.href=href;a.textContent=href==='#estrelas'?'Abrir guia da noite':href==='#vegano'?'Ver opções de comida':'Ver lugares e mapas';content.append(a)}
  details.append(summary,content);li.append(details);list.append(li);
 });panel.append(list);
}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>renderDay(t.dataset.day));t.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();renderDay(tabs[next].dataset.day);tabs[next].focus()}})});renderDay(9);
const places=JSON.parse(document.querySelector('#place-data').textContent);const dialog=document.querySelector('#place-dialog');let lastTrigger;
document.querySelectorAll('[data-place]').forEach(button=>button.addEventListener('click',()=>{
 const place=places.find(p=>p.id===button.dataset.place);lastTrigger=button;
 document.querySelector('#dialog-city').textContent=place.city;document.querySelector('#dialog-title').textContent=place.title;document.querySelector('#dialog-description').textContent=place.details;
 const links=document.querySelector('#dialog-links');links.replaceChildren();
 const items=place.links||[{url:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place.map),label:'Abrir no mapa'},{url:place.source,label:'Consultar fonte'}];
 items.forEach((item,i)=>{const a=document.createElement('a');a.href=item.url;a.textContent=item.label;a.target='_blank';a.rel='noopener noreferrer';a.className='button '+(i===0?'primary':'secondary');links.append(a)});
 dialog.showModal();document.querySelector('#close-dialog').focus();
}));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});dialog.addEventListener('close',()=>lastTrigger?.focus());
document.querySelector('#night-mode').addEventListener('click',e=>{const dim=document.body.classList.toggle('dim');e.currentTarget.setAttribute('aria-pressed',String(dim));e.currentTarget.setAttribute('aria-label',dim?'Desativar luz baixa':'Ativar luz baixa');document.querySelector('#mode-label').textContent=dim?'Luz normal':'Luz baixa'});
const navLinks=[...document.querySelectorAll('.bottom-nav a')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){navLinks.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}}},{rootMargin:'-15% 0px -60% 0px'});
['estrelas','roteiro','lugares','vegano'].forEach(id=>observer.observe(document.getElementById(id)));
