
let perguntas = [];

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


function mostrarExportacoes(){
  document.getElementById('exportButtons').style.display='block';
}

async function exportarWord(){
  const { Document, Packer, Paragraph, TextRun } = docx;
  const doc = new Document();
  const elementos = [];

  document.querySelectorAll('select').forEach(s => {
    elementos.push(new Paragraph({
      children:[
        new TextRun({text:`${s.dataset.pergunta}: `,bold:true}),
        new TextRun(s.value||'Não preenchido')
      ]
    }));
  });

  document.querySelectorAll('input[type="file"]').forEach(f => {
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
