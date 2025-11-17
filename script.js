
let perguntas = [];

// Carregar perguntas do JSON
fetch('formulario_completo.json')
  .then(r => r.json())
  .then(data => {
    perguntas = data;
    preencherFiltroSecao();
    renderForm();
  });

function preencherFiltroSecao(){
  const filtro=document.getElementById('filterSecao');
  perguntas.forEach(secao=>{
    const opt=document.createElement('option');
    opt.value=secao.secao;
    opt.textContent=secao.secao;
    filtro.appendChild(opt);
  });
}

function renderForm(filtroSecao='', pesquisa=''){
  const c=document.getElementById('formContainer');
  c.innerHTML='';
  perguntas.forEach(secao=>{
    if(filtroSecao && secao.secao!==filtroSecao)return;
    const d=document.createElement('div');
    d.className='section';
    d.innerHTML=`<h3>${secao.secao}</h3>`;
    secao.campos.forEach(campo=>{
      if(pesquisa && !campo.pergunta.toLowerCase().includes(pesquisa.toLowerCase()))return;
      const label=document.createElement('label');
      label.textContent=campo.pergunta;
      const select=document.createElement('select');
      select.dataset.pergunta=campo.pergunta;
      select.innerHTML=`<option value=''>Selecione...</option>`+campo.opcoes.map(op=>`<option>${op}</option>`).join('');
      const fileInput=document.createElement('input');
      fileInput.type='file';
      fileInput.accept='image/*';
      fileInput.capture='camera';
      d.appendChild(label);
      d.appendChild(select);
      d.appendChild(fileInput);
    });
    if(d.querySelector('select'))c.appendChild(d);
  });
  atualizarGrafico();
  mostrarExportacoes();
}

// Mostrar botões sempre no final
function mostrarExportacoes(){
  document.getElementById('exportButtons').style.display='block';
}

// Exportar JSON
function exportarJSON(){
  const respostas={};
  document.querySelectorAll('select').forEach(s=>{
    respostas[s.dataset.pergunta]=s.value||'';
  });
  const blob=new Blob([JSON.stringify(respostas,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='inspecao.json';
  a.click();
}

// Exportar PDF
function exportarPDF(){
  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();
  let y=10;
  document.querySelectorAll('select').forEach(s=>{
    doc.text(`${s.dataset.pergunta}: ${s.value||'Não preenchido'}`,10,y);
    y+=10;
  });
  doc.save('inspecao.pdf');
}

// Exportar Word
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

// Atualizar gráfico
function atualizarGrafico(){
  const total=document.querySelectorAll('select').length;
  const preenchidos=[...document.querySelectorAll('select')].filter(s=>s.value).length;
  const ctx=document.getElementById('progressChart');
  new Chart(ctx,{type:'doughnut',data:{labels:['Preenchidos','Pendentes'],datasets:[{data:[preenchidos,total-preenchidos],backgroundColor:['#0078D4','#ccc']}]} });
}
