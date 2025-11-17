# Formulário Completo

Este projeto inclui:
- Formulário dinâmico carregado de JSON.
- Exportação para JSON, PDF e Word (com todas as respostas e fotos).
- Captura de fotos via input (accept="image/*" capture="camera").

## Como testar localmente
1. Descompacte o ZIP.
2. No Terminal:
   ```bash
   cd ~/Transferências/site_final_v4
   python3 -m http.server 8000
   ```
3. Abra http://localhost:8000

### Testar no telemóvel
- Descubra o IP do seu Mac com `ifconfig`.
- Inicie o servidor: `python3 -m http.server 8000`.
- No telemóvel, aceda a: `http://<IP-do-Mac>:8000`.

## Publicar no GitHub Pages
1. Crie repositório público.
2. Faça upload dos ficheiros.
3. Em Settings → Pages, selecione branch `main` e pasta `/root`.
4. Acesse: https://<usuario>.github.io/<repositorio>/

## O que foi alterado
- Perguntas restauradas do JSON.
- Botões de exportação aparecem sempre no final.
- Função exportarWord inclui todas as respostas e fotos.
- Inputs permitem captura de fotos.
