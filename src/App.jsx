import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Eye, FileImage } from 'lucide-react';

const App = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Simula a resposta da Google Vision API baseado no nome/tipo do arquivo
  const simulateVisionAPI = (fileName) => {
    const lowerName = fileName.toLowerCase();
    
    // Determina o tipo de documento e confiança baseado no nome
    let documentType = 'unknown';
    let confidence = 0;
    let labels = [];
    let extractedText = [];
    
    if (lowerName.includes('passaport') || lowerName.includes('passport')) {
      documentType = 'passport';
      confidence = Math.random() * 0.25 + 0.75; // 0.75 - 1.0
      labels = [
        { description: 'Passport', score: confidence },
        { description: 'Identity document', score: confidence - 0.03 },
        { description: 'Official document', score: confidence - 0.07 }
      ];
      extractedText = [
        'REPÚBLICA FEDERATIVA DO BRASIL',
        'PASSPORT / PASSAPORTE',
        'Surname / Apellido / Nome',
        'SILVA',
        'Given names / Nombres / Prenomes',
        'MARIA',
        'Nationality / Nacionalidad / Nacionalidade',
        'BRAZILIAN / BRASILEIRA'
      ];
    } else if (lowerName.includes('extrato') || lowerName.includes('bank')) {
      documentType = 'bank_statement';
      confidence = Math.random() * 0.20 + 0.70; // 0.70 - 0.90
      labels = [
        { description: 'Document', score: confidence },
        { description: 'Bank statement', score: confidence - 0.05 },
        { description: 'Financial document', score: confidence - 0.10 }
      ];
      extractedText = [
        'EXTRATO BANCÁRIO',
        'Período: 01/09/2025 a 30/09/2025',
        'Agência: 1234-5',
        'Conta: 67890-1',
        'Saldo Final: R$ 15.430,00'
      ];
    } else if (lowerName.includes('comprovante') || lowerName.includes('residencia') || lowerName.includes('address')) {
      documentType = 'address_proof';
      confidence = Math.random() * 0.25 + 0.70; // 0.70 - 0.95
      labels = [
        { description: 'Document', score: confidence },
        { description: 'Utility bill', score: confidence - 0.08 },
        { description: 'Address proof', score: confidence - 0.12 }
      ];
      extractedText = [
        'COMPROVANTE DE RESIDÊNCIA',
        'Rua das Flores, 123',
        'Bairro Centro',
        'Campinas - SP',
        'CEP: 13010-000'
      ];
    } else if (lowerName.includes('fake') || lowerName.includes('falso') || lowerName.includes('fraud')) {
      // Simula documento fraudulento
      documentType = 'suspicious';
      confidence = Math.random() * 0.30 + 0.40; // 0.40 - 0.70 (baixa confiança)
      labels = [
        { description: 'Document', score: confidence },
        { description: 'Paper', score: 0.60 },
        { description: 'Image manipulation', score: 0.35 }
      ];
      extractedText = [
        'Text unclear',
        'Low quality scan',
        'Possible alterations detected'
      ];
    } else {
      // Documento genérico
      documentType = 'generic';
      confidence = Math.random() * 0.40 + 0.50; // 0.50 - 0.90
      labels = [
        { description: 'Document', score: confidence },
        { description: 'Paper', score: confidence - 0.15 },
        { description: 'Text', score: confidence - 0.20 }
      ];
      extractedText = [
        'Generic document text',
        'Unable to classify specific type'
      ];
    }

    return {
      documentType,
      confidence: parseFloat(confidence.toFixed(2)),
      labels,
      extractedText
    };
  };

  // Avalia a confiança e decide a ação
  const evaluateConfidence = (confidence, documentType) => {
    const threshold = 0.80;
    
    let action, reason, color, icon;
    
    if (confidence >= 0.95) {
      action = 'AUTO_APPROVE';
      reason = 'Alta confiança na autenticidade do documento';
      color = 'text-green-600';
      icon = <CheckCircle className="w-6 h-6" />;
    } else if (confidence >= threshold) {
      action = 'PROCEED_TO_OCR';
      reason = 'Confiança aceitável, prosseguir com extração de dados';
      color = 'text-blue-600';
      icon = <Eye className="w-6 h-6" />;
    } else {
      action = 'FLAG_FOR_HUMAN_REVIEW';
      reason = `Baixa confiança (${(confidence * 100).toFixed(0)}%), possível documento adulterado ou ilegível`;
      color = 'text-red-600';
      icon = <AlertCircle className="w-6 h-6" />;
    }

    return { action, reason, color, icon, threshold };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      
      // Cria preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setAnalyzing(true);
    setResult(null);

    // Simula delay da API (1-3 segundos)
    const delay = Math.random() * 2000 + 1000;
    
    setTimeout(() => {
      const visionResponse = simulateVisionAPI(file.name);
      const decision = evaluateConfidence(visionResponse.confidence, visionResponse.documentType);
      
      setResult({
        ...visionResponse,
        decision
      });
      setAnalyzing(false);
    }, delay);
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      passport: 'Passaporte',
      bank_statement: 'Extrato Bancário',
      address_proof: 'Comprovante de Residência',
      suspicious: 'Documento Suspeito',
      generic: 'Documento Genérico'
    };
    return labels[type] || 'Desconhecido';
  };

  const getActionDescription = (action) => {
    const descriptions = {
      AUTO_APPROVE: '✅ Aprovação Automática',
      PROCEED_TO_OCR: '🔍 Prosseguir para Extração OCR',
      FLAG_FOR_HUMAN_REVIEW: '⚠️ Encaminhar para Revisão Humana'
    };
    return descriptions[action] || action;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Testador de Visão Computacional
            </h1>
          </div>
          <p className="text-gray-600">
            Simula a integração com Google Cloud Vision API para validação de documentos do YOUVISA
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload de Documento
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <FileImage className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Clique para selecionar um arquivo
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG ou PDF (máx. 20MB)
                </p>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Arquivo selecionado:
                </p>
                <p className="text-sm text-gray-600 break-all">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain bg-gray-100 rounded-lg"
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                !file || analyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analisando documento...
                </span>
              ) : (
                'Analisar com Vision AI'
              )}
            </button>

            {/* Dicas */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                💡 Dicas para testar:
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use "passaporte" no nome para simular passaporte</li>
                <li>• Use "extrato" para simular extrato bancário</li>
                <li>• Use "comprovante" para documento de residência</li>
                <li>• Use "fake" ou "falso" para simular documento suspeito</li>
              </ul>
            </div>
          </div>

          {/* Results Area */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resultados da Análise
            </h2>

            {!result && !analyzing && (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                  <p>Nenhuma análise realizada ainda</p>
                  <p className="text-sm mt-2">
                    Faça upload de um documento e clique em "Analisar"
                  </p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Decision Card */}
                <div className={`p-4 rounded-lg border-2 ${
                  result.decision.action === 'AUTO_APPROVE' ? 'bg-green-50 border-green-200' :
                  result.decision.action === 'PROCEED_TO_OCR' ? 'bg-blue-50 border-blue-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className={`flex items-center gap-3 mb-2 ${result.decision.color}`}>
                    {result.decision.icon}
                    <h3 className="font-bold text-lg">
                      {getActionDescription(result.decision.action)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700">{result.decision.reason}</p>
                </div>

                {/* Document Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Informações do Documento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo Detectado:</span>
                      <span className="font-medium text-gray-800">
                        {getDocumentTypeLabel(result.documentType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confiança:</span>
                      <span className={`font-bold ${
                        result.confidence >= 0.95 ? 'text-green-600' :
                        result.confidence >= 0.80 ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Threshold:</span>
                      <span className="font-medium text-gray-800">
                        {(result.decision.threshold * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          result.confidence >= 0.95 ? 'bg-green-500' :
                          result.confidence >= 0.80 ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>80% (threshold)</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Labels Detected */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Labels Detectados (Vision API)
                  </h4>
                  <div className="space-y-2">
                    {result.labels.map((label, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{label.description}</span>
                        <span className="px-2 py-1 bg-white rounded text-gray-600 font-mono text-xs">
                          {(label.score * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extracted Text */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Texto Extraído (OCR)
                  </h4>
                  <div className="bg-white p-3 rounded border border-gray-200 max-h-48 overflow-y-auto">
                    {result.extractedText.map((text, idx) => (
                      <p key={idx} className="text-sm text-gray-700 font-mono">
                        {text}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">
                    🎯 Próximos Passos no n8n:
                  </h4>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    {result.decision.action === 'AUTO_APPROVE' && (
                      <>
                        <li>1. Atualizar status do documento no CRM: "Validado"</li>
                        <li>2. Enviar notificação de sucesso ao cliente</li>
                        <li>3. Prosseguir para próximo documento da checklist</li>
                      </>
                    )}
                    {result.decision.action === 'PROCEED_TO_OCR' && (
                      <>
                        <li>1. Enviar para workflow de extração avançada (OCR)</li>
                        <li>2. Validar dados extraídos contra regras de negócio</li>
                        <li>3. Atualizar CRM com dados estruturados</li>
                      </>
                    )}
                    {result.decision.action === 'FLAG_FOR_HUMAN_REVIEW' && (
                      <>
                        <li>1. Criar tarefa URGENTE no CRM para atendente</li>
                        <li>2. Notificar equipe via Slack/Email</li>
                        <li>3. Pausar processamento automático do processo</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Reference */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📋 Código de Referência (Nó 10: Confidence Evaluator)
          </h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`const passportConfidence = response.labelAnnotations
  .find(label => label.description === 'Passport')?.score || 0;

const threshold = 0.80;
let action, reason;

if (passportConfidence >= 0.95) {
  action = 'AUTO_APPROVE';
  reason = 'Alta confiança na autenticidade';
} else if (passportConfidence >= threshold) {
  action = 'PROCEED_TO_OCR';
  reason = 'Confiança aceitável, prosseguir com extração';
} else {
  action = 'FLAG_FOR_HUMAN_REVIEW';
  reason = \`Baixa confiança (\${passportConfidence}%), possível fraude\`;
  
  createCRMTask({
    type: 'Validação Manual - Documento Suspeito',
    priority: 'Crítica',
    document_url: presignedS3URL
  });
}

return { action, reason, confidence: passportConfidence };`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;