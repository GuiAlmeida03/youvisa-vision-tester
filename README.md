# YOUVISA Vision AI Tester

Aplicação de teste para simular a integração com Google Cloud Vision API no projeto YOUVISA Sprint 2.

## 🚀 Funcionalidades

- Upload de documentos (JPG, PNG, PDF)
- Simulação de análise com Vision API
- Validação de confiança com threshold configurável
- Extração de texto (OCR simulado)
- Decisão automatizada (Auto-Approve, OCR, Manual Review)

## 🛠️ Tecnologias

- React 18
- Tailwind CSS
- Lucide React (ícones)

## 📦 Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/youvisa-vision-tester.git

# Entre na pasta
cd youvisa-vision-tester

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

## 🧪 Como Testar

Use estes nomes de arquivo para simular diferentes cenários:

| Nome do Arquivo | Tipo Simulado | Confiança Esperada |
|----------------|---------------|-------------------|
| `passaporte.jpg` | Passaporte | 75-100% |
| `extrato.pdf` | Extrato Bancário | 70-90% |
| `comprovante.png` | Comp. Residência | 70-95% |
| `fake.jpg` | Documento Suspeito | 40-70% |

## 📚 Documentação

Veja o [Documento Completo da Sprint 2](link-do-documento) para entender a arquitetura completa.

## 🔗 Integração Real com Google Vision API

Para usar a API real, substitua a função `simulateVisionAPI` por:
```javascript
const analyzeWithVisionAPI = async (imageBase64) => {
  const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [{
        image: { content: imageBase64 },
        features: [
          { type: 'DOCUMENT_TEXT_DETECTION' },
          { type: 'LABEL_DETECTION' }
        ]
      }]
    })
  });
  return response.json();
};
```

## 📄 Licença

MIT License - Projeto YOUVISA Sprint 2

## 👥 Autor

Equipe de Arquitetura RPA - YOUVISA