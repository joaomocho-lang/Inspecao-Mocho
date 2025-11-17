# Formulário Completo Modificado

Alterações:
- Botões de exportação (JSON, PDF, Word) aparecem apenas no final do formulário.
- Exportação para Word inclui todas as secções e fotos.
- Inputs permitem captura de fotos (accept="image/*" capture="camera").

## Como testar localmente
1. Descompacte o ZIP.
2. No Terminal:
   ```bash
   cd ~/Transferências/site_github_pages_modificado
   python3 -m http.server 8000
   ```
3. Abra http://localhost:8000

## Publicar no GitHub Pages
1. Crie repositório público.
2. Faça upload dos ficheiros.
3. Em Settings → Pages, selecione branch `main` e pasta `/root`.
4. Acesse: https://<usuario>.github.io/<repositorio>/
