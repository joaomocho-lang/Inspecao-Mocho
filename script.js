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
  mostrarExportacoes();atualizarGrafico();}

function preencherFiltroSecao(){const filtro=document.getElementById('filterSecao');perguntas.forEach(secao=>{const opt=document.createElement('option');opt.value=secao.secao;opt.textContent=secao.secao;filtro.appendChild(opt);});}

document.getElementById('searchBar').addEventListener('input',e=>{renderForm(document.getElementById('filterSecao').value,e.target.value);});
document.getElementById('filterSecao').addEventListener('change',e=>{renderForm(e.target.value,document.getElementById('searchBar').value);});

function calcularProgresso(){let total=0,preenchidas=0;perguntas.forEach(secao=>{secao.campos.forEach(campo=>{total++;if(respostas[campo.pergunta]?.resposta)preenchidas++;});});return(total?(preenchidas/total)*100:0);}
function atualizarGrafico(){const progresso=calcularProgresso();progressChart.data.datasets[0].data=[progresso,100-progresso];progressChart.update();}
function mostrarExportacoes(){document.getElementById('exportButtons').style.display='block';}

function resetarFormulario(){localStorage.removeItem('respostas');localStorage.removeItem('dadosCabecalho');window.location.href='index.html';}

function exportarPDFCompleto(){const { jsPDF }=window.jspdf;const doc=new jsPDF();const cabecalho=JSON.parse(localStorage.getItem('dadosCabecalho'))||{};let y=10;
doc.setFontSize(18);doc.text('Relatório de Inspeção',10,y);y+=10;
try{doc.addImage('Captura de ecrã 2025-11-17, às 22.07.23.png','PNG',150,5,40,40);}catch(e){}
doc.setFontSize(12);doc.setTextColor(0,0,255);doc.text('Dados do Cabeçalho:',10,y);y+=10;doc.setTextColor(0,0,0);
for(const[k,v]of Object.entries(cabecalho)){doc.text(`${k}: ${v}`,10,y);y+=8;if(y>270){doc.addPage();y=10;}}
doc.addPage();doc.setFontSize(14);doc.setTextColor(255,140,0);doc.text('Respostas do Formulário',10,10);y=20;doc.setTextColor(0,0,0);
for(const[pergunta,dados]of Object.entries(respostas)){doc.text(`${pergunta}: ${dados.resposta||'Não preenchido'}`,10,y);y+=8;if(y>270){doc.addPage();y=10;}if(dados.fotoPreview){doc.addImage(dados.fotoPreview,'JPEG',10,y,50,50);y+=60;if(y>270){doc.addPage();y=10;}}}
doc.addPage();doc.text('Assinatura do Inspetor:',10,20);doc.text(cabecalho.assinatura||'',10,30);doc.save('relatorio_completo.pdf');}

const ctx=document.getElementById('progressChart').getContext('2d');const progressChart=new Chart(ctx,{type:'doughnut',data:{labels:['Concluído','Pendente'],datasets:[{data:[0,100],backgroundColor:['#0078D4','#ccc']}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
fetch('formulario_completo.json').then(r=>r.json()).then(data=>{perguntas=data;preencherFiltroSecao();renderForm();});