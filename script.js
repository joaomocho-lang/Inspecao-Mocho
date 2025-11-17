let perguntas=[];function renderForm(filtroSecao='',pesquisa=''){const c=document.getElementById('formContainer');c.innerHTML='';perguntas.forEach(secao=>{if(filtroSecao&&secao.secao!==filtroSecao)return;const d=document.createElement('div');d.className='section';d.innerHTML=`<h2>${secao.secao}</h2>`;secao.campos.forEach(campo=>{if(pesquisa&&!campo.pergunta.toLowerCase().includes(pesquisa.toLowerCase()))return;const l=document.createElement('label');l.textContent=campo.pergunta;const s=document.createElement('select');s.dataset.pergunta=campo.pergunta;s.innerHTML='<option value="">Selecione...</option>'+campo.opcoes.map(op=>`<option>${op}</option>`).join('');const f=document.createElement('input');f.type='file';f.accept='image/*';f.dataset.pergunta=campo.pergunta;const img=document.createElement('img');img.className='preview';img.style.display='none';f.addEventListener('change',e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=()=>{img.src=r.result;img.style.display='block';};r.readAsDataURL(file);}});d.appendChild(l);d.appendChild(s);d.appendChild(f);d.appendChild(img);});if(d.querySelector('select'))c.appendChild(d);});atualizarGrafico();}function preencherFiltroSecao(){const filtro=document.getElementById('filterSecao');perguntas.forEach(secao=>{const opt=document.createElement('option');opt.value=secao.secao;opt.textContent=secao.secao;filtro.appendChild(opt);});}document.getElementById('searchBar').addEventListener('input',e=>{renderForm(document.getElementById('filterSecao').value,e.target.value);});document.getElementById('filterSecao').addEventListener('change',e=>{renderForm(e.target.value,document.getElementById('searchBar').value);});function calcularProgresso(){const selects=document.querySelectorAll('select');let preenchidas=0;selects.forEach(s=>{if(s.value)preenchidas++;});return(preenchidas/selects.length)*100;}function atualizarGrafico(){const progresso=calcularProgresso();progressChart.data.datasets[0].data=[progresso,100-progresso];progressChart.update();}document.addEventListener('change',atualizarGrafico);function exportarJSON(){const dados={};document.querySelectorAll('select').forEach(s=>{dados[s.dataset.pergunta]={resposta:s.value};});document.querySelectorAll('input[type="file"]').forEach(f=>{if(f.files[0]){dados[f.dataset.pergunta].foto=f.files[0].name;}});const blob=new Blob([JSON.stringify(dados,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='inspecao.json';a.click();}function exportarPDF(){const{jsPDF}=window.jspdf;const doc=new jsPDF();doc.text('Relatório de Inspeção',10,10);let y=20;document.querySelectorAll('select').forEach(s=>{doc.text(`${s.dataset.pergunta}: ${s.value||'Não preenchido'}`,10,y);y+=10;});doc.save('inspecao.pdf');}const ctx=document.getElementById('progressChart').getContext('2d');const progressChart=new Chart(ctx,{type:'doughnut',data:{labels:['Concluído','Pendente'],datasets:[{data:[0,100],backgroundColor:['#0078D4','#ccc']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});fetch('formulario_completo.json').then(r=>r.json()).then(data=>{perguntas=data;preencherFiltroSecao();renderForm();});

function mostrarExportacoes(){
  document.getElementById('exportButtons').style.display='block';
}

function exportarJSON(){
  const respostas={};
  document.querySelectorAll('select').forEach(s=>{
    respostas[s.dataset.pergunta]=s.value||'';
  });
  document.querySelectorAll('input[type="file"]').forEach(f=>{
    if(f.files[0]){
      respostas[`Foto_${f.previousSibling.textContent}`]=f.files[0].name;
    }
  });
  const blob=new Blob([JSON.stringify(respostas,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='inspecao.json';
  a.click();
}

function exportarPDF(){
  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();
  let y=10;

  document.querySelectorAll('select').forEach(s=>{
    doc.text(`${s.dataset.pergunta}: ${s.value||'Não preenchido'}`,10,y);
    y+=10;
    if(y>270){doc.addPage();y=10;}
  });

  const inputs=document.querySelectorAll('input[type="file"]');
  let processadas=0;
  inputs.forEach(f=>{
    if(f.files[0]){
      const reader=new FileReader();
      reader.onload=function(e){
        doc.addImage(e.target.result,'JPEG',10,y,50,50);
        y+=60;
        if(y>270){doc.addPage();y=10;}
        processadas++;
        if(processadas===inputs.length){doc.save('inspecao.pdf');}
      };
      reader.readAsDataURL(f.files[0]);
    }else{
      processadas++;
      if(processadas===inputs.length){doc.save('inspecao.pdf');}
    }
  });
}

async function exportarWord(){
  const { Document,Packer,Paragraph,TextRun }=docx;
  const doc=new Document();
  const elementos=[];
  document.querySelectorAll('select').forEach(s=>{
    elementos.push(new Paragraph({children:[new TextRun({text:`${s.dataset.pergunta}: `,bold:true}),new TextRun(s.value||'Não preenchido')]}));
  });
  document.querySelectorAll('input[type="file"]').forEach(f=>{
    if(f.files[0]){
      elementos.push(new Paragraph(`Foto anexada: ${f.files[0].name}`));
    }
  });
  doc.addSection({children:elementos});
  const blob=await Packer.toBlob(doc);
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='inspecao.docx';
  a.click();
}


const originalRenderForm = renderForm;
renderForm = function(filtroSecao='', pesquisa=''){
  originalRenderForm(filtroSecao,pesquisa);
  document.querySelectorAll('input[type="file"]').forEach(inp=>{inp.accept='image/*';inp.capture='camera';});
  mostrarExportacoes();
}
