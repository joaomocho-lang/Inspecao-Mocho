function exportarPDFCompleto(){const { jsPDF } = window.jspdf;const doc=new jsPDF('p','mm','a4');const cabecalho=JSON.parse(localStorage.getItem('dadosCabecalho'))||{};let y=20;
// Cabeçalho com logotipo e título
doc.setFontSize(18);doc.text('Relatório de Inspeção',10,10);
try{doc.addImage('Captura de ecrã 2025-11-17, às 22.07.23.png','PNG',160,5,40,40);}catch(e){}
doc.setFontSize(12);
doc.setTextColor(0,0,255);doc.text('Informações do Cliente',10,y);y+=10;doc.setTextColor(0,0,0);
for(const[k,v]of Object.entries(cabecalho)){doc.text(`${k}: ${v}`,10,y);y+=8;if(y>270){doc.addPage();y=10;}}
// Secções do formulário
doc.addPage();doc.setFontSize(14);doc.setTextColor(255,140,0);doc.text('Respostas do Formulário',10,10);y=20;doc.setTextColor(0,0,0);
document.querySelectorAll('.section').forEach(secao=>{doc.setFontSize(12);doc.setTextColor(0,0,255);doc.text(secao.querySelector('h2').textContent,10,y);y+=10;doc.setTextColor(0,0,0);
secao.querySelectorAll('select').forEach(s=>{doc.text(`${s.dataset.pergunta}: ${s.value||'Não preenchido'}`,10,y);y+=8;if(y>270){doc.addPage();y=10;}});
secao.querySelectorAll('input[type="file"]').forEach(f=>{if(f.files[0]){const reader=new FileReader();reader.onload=function(e){doc.addImage(e.target.result,'JPEG',10,y,50,50);y+=60;if(y>270){doc.addPage();y=10;}doc.save('relatorio_completo.pdf');};reader.readAsDataURL(f.files[0]);}});});doc.save('relatorio_completo.pdf');}