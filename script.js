let perguntas=[];let respostas=JSON.parse(localStorage.getItem('respostas'))||{};

function renderForm(filtroSecao='',pesquisa=''){
  const c=document.getElementById('formContainer');c.innerHTML='';
  perguntas.forEach(secao=>{
    if(filtroSecao&&secao.secao!==filtroSecao)return;
    const d=document.createElement('div');d.className='section';d.innerHTML=`<h2>${secao.secao}</h2>`;
    secao.campos.forEach(campo=>{
      if(pesquisa&&!campo.pergunta.toLowerCase().includes(pesquisa.toLowerCase()))return;
      const l=document.createElement('label');l.textContent=campo.pergunta;
      const s=document.createElement('select');s.dataset.pergunta=campo.pergunta;
      s.innerHTML='<option value="">Selecione...</option>'+campo.opcoes.map(op=>`<option>${op}</option>`).join('');
      if(respostas[campo.pergunta])s.value=respostas[campo.pergunta].resposta;
      s.addEventListener('change',()=>{respostas[campo.pergunta]={resposta:s.value,foto:respostas[campo.pergunta]?.foto||null,fotoPreview:respostas[campo.pergunta]?.fotoPreview||null};localStorage.setItem('respostas',JSON.stringify(respostas));atualizarGrafico();});
      const f=document.createElement('input');f.type='file';f.accept='image/*';f.capture='camera';f.dataset.pergunta=campo.pergunta;
      const img=document.createElement('img');img.className='preview';img.style.display='none';
      if(respostas[campo.pergunta]?.fotoPreview){img.src=respostas[campo.pergunta].fotoPreview;img.style.display='block';}
      f.addEventListener('change',e=>{const file=e.target.files[0];if(file){const r=new FileReader();r.onload=()=>{img.src=r.result;img.style.display='block';respostas[campo.pergunta]={resposta:s.value,foto:file.name,fotoPreview:r.result};localStorage.setItem('respostas',JSON.stringify(respostas));};r.readAsDataURL(file);}});
      d.appendChild(l);d.appendChild(s);d.appendChild(f);d.appendChild(img);
    });
    if(d.querySelector('select'))c.appendChild(d);
  });
  mostrarExportacoes();atualizarGrafico();
}

function preencherFiltroSecao(){const filtro=document.getElementById('filterSecao');perguntas.forEach(secao=>{const opt=document.createElement('option');opt.value=secao.secao;opt.textContent=secao.secao;filtro.appendChild(opt);});}

document.getElementById('searchBar').addEventListener('input',e=>{renderForm(document.getElementById('filterSecao').value,e.target.value);});
document.getElementById('filterSecao').addEventListener('change',e=>{renderForm(e.target.value,document.getElementById('searchBar').value);});

function calcularProgresso(){let total=0,preenchidas=0;perguntas.forEach(secao=>{secao.campos.forEach(campo=>{total++;if(respostas[campo.pergunta]?.resposta)preenchidas++;});});return(total?(preenchidas/total)*100:0);}
function atualizarGrafico(){const progresso=calcularProgresso();progressChart.data.datasets[0].data=[progresso,100-progresso];progressChart.update();}
function mostrarExportacoes(){document.getElementById('exportButtons').style.display='block';}

function exportarJSON(){const dados={cabecalho:JSON.parse(localStorage.getItem('dadosCabecalho')),respostas:respostas};const blob=new Blob([JSON.stringify(dados,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='relatorio.json';a.click();}

const ctx=document.getElementById('progressChart').getContext('2d');const progressChart=new Chart(ctx,{type:'doughnut',data:{labels:['Concluído','Pendente'],datasets:[{data:[0,100],backgroundColor:['#0078D4','#ccc']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
fetch('formulario_completo.json').then(r=>r.json()).then(data=>{perguntas=data;preencherFiltroSecao();renderForm();});