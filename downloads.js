(()=>{
 const id=location.pathname.match(/tools\/(\d{3})\//)?.[1];if(!id)return;
 const checklist=['011','014','020'].includes(id);
 const panel=document.createElement('aside');panel.className='download-panel';
 panel.style.cssText='max-width:820px;margin:24px auto;padding:22px;box-sizing:border-box;background:#fff5dc;border-radius:12px;font:16px/1.8 "Malgun Gothic",sans-serif';
 const heading=document.createElement('h2');heading.textContent='파일로 보관하고 다시 사용하세요';heading.style.fontSize='21px';panel.append(heading);
 const link=(name,file)=>{const a=document.createElement('a');a.textContent=name;a.href='../../downloads/'+file;a.download=file;a.style.cssText='display:inline-block;margin:8px 14px 8px 0;color:#175e50';panel.append(a)};
 if(checklist){link('빈 워드 양식 (.docx)',`checklist-${id}.docx`);link('빈 인쇄 양식 (.pdf)',`checklist-${id}.pdf`)}else{link('계산식이 있는 엑셀 양식 (.xlsx)','ecommerce-calculators.xlsx')}
 const note=document.createElement('p');note.textContent=checklist?'다운로드 양식은 빈 양식입니다. 현재 체크와 메모를 보관하려면 아래 버튼을 누르세요.':`엑셀은 예시값이 들어 있는 20개 계산 시트와 시작 메뉴 모음입니다. ${id} 시트를 사용하세요. 웹에서 바꾼 값은 엑셀에 자동으로 옮겨지지 않습니다.`;panel.append(note);
 const button=document.createElement('button');button.type='button';button.textContent='현재 입력과 결과 PDF로 저장';button.style.cssText='padding:13px 18px;background:#175e50;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer';panel.append(button);
 const tip=document.createElement('p');tip.textContent='인쇄 화면에서 대상을 “PDF로 저장”으로 선택하세요. 기기에 따라 저장 메뉴 이름이 다를 수 있습니다.';panel.append(tip);document.body.append(panel);
 button.onclick=()=>{
  const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';
  const scope=document.querySelector('#ecom-tool,[id^="mdtool-"],#md-shipping-tool')||document.querySelector('main');
  const fields=[...scope.querySelectorAll('input,textarea')].filter(visible);
  if(fields.some(e=>e.type==='number'&&(!e.checkValidity()||e.value.trim()===''))){alert('빈칸과 입력 범위를 먼저 확인해 주세요.');return}
  const error=[...scope.querySelectorAll('.error')].find(e=>visible(e)&&e.textContent.trim());if(error){alert(error.textContent);return}
  const win=window.open('','_blank');if(!win){alert('인쇄 창을 열 수 없습니다. 팝업 허용 후 다시 눌러주세요.');return}
  const doc=win.document;doc.open();doc.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>실무 도구 결과</title><style>body{font:12pt/1.7 "Malgun Gothic",sans-serif;color:#17334a;margin:28px}h1{font-size:20pt}h2{font-size:15pt;margin-top:24px}p{white-space:pre-wrap;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%}td{padding:10px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}tr{break-inside:avoid}small{color:#52635e;display:block;white-space:pre-wrap;overflow-wrap:anywhere}button{padding:12px}@page{size:A4;margin:16mm}@media print{button{display:none}body{margin:0}}</style></head><body></body></html>');doc.close();
  const add=(tag,text)=>{const el=doc.createElement(tag);el.textContent=text;doc.body.append(el);return el};
  add('h1',document.querySelector('h1')?.textContent||'실무 도구 결과');
  add('small','팔아본 팀장의 실무노트 · 저장 시각 '+new Date().toLocaleString('ko-KR')+'\n'+'https://khhjyc.github.io/md-team-tools/tools/'+id+'/index.html');
  const active=scope.querySelector('[role="tab"][aria-selected="true"]');if(active)add('p','선택한 계산: '+active.textContent);
  add('h2','입력한 값과 확인 내용');const table=doc.createElement('table');doc.body.append(table);
  for(const e of fields){const tr=doc.createElement('tr');const label=doc.createElement('td');label.textContent=(e.closest('label')?.textContent||document.querySelector(`label[for="${e.id}"]`)?.textContent||e.name||'메모').trim();const value=doc.createElement('td');value.textContent=e.type==='checkbox'?(e.checked?'확인함':'미확인'):(e.value||'미작성');tr.append(label,value);table.append(tr)}
  const results=[...scope.querySelectorAll('.result')].filter(visible);if(results.length){add('h2','계산 결과');results.forEach(e=>add('p',e.innerText))}
  else{const status=[...scope.querySelectorAll('[role="status"]')].filter(visible);status.forEach(e=>add('p',e.textContent))}
  add('h2','적용 조건');
  const notes=[...scope.querySelectorAll('p,.formula,.note')].filter(visible).map(e=>e.innerText.trim()).filter(Boolean);[...new Set(notes)].forEach(t=>add('p',t));
  const print=add('button','인쇄 또는 PDF로 저장');print.onclick=()=>win.print();win.focus();setTimeout(()=>win.print(),350);
 };
})();


