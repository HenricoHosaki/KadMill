import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import logo from "../assets/Logo_Kadmill.png";
import { isAdmin } from "../utils/authUtils";

// Tipagem simplificada baseada no seu Schema
interface OSData {
  id: number;
  numero_os: string;
  descricao_servico: string;
  status: string;
  valor_total: string; // Vem como string/decimal do backend
  observacao: string | null;
  equipamento_utilizado: string | null;
  tempo_total_execucao: number | null;
  executante: string | null;
  quantidade_esperada: number | null;
  data_abertura: string;
  data_fechamento: string | null;
  inicio_servico: string | null;
  fim_servico: string | null;
  cliente: {
    nome: string;
    cpf_cnpj: string;
    telefone: string;
    endereco: string;
    email: string;
  };
}

const ImpressaoOS: React.FC = () => {
  const { id } = useParams();
  const [os, setOs] = useState<OSData | null>(null);

  useEffect(() => {
    api.get(`/ordensServicos/${id}`)
      .then((response) => {
        setOs(response.data);
        setTimeout(() => window.print(), 500); 
      })
  }, [id]);

  if (!os) return <div className="p-4">Carregando documento...</div>;

  // Formatadores
  const formatMoney = (val: string | number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val));
  
  const formatDate = (dateStr: string | null) => 
    dateStr ? new Date(dateStr).toLocaleDateString('pt-BR') + ' ' + new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <div className="print-container">
      {/* Estilos Inline para garantir isolamento na impressão */}
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none; }
        }
        .print-container {
          font-family: Arial, sans-serif;
          max-width: 210mm; /* Largura A4 */
          margin: 0 auto;
          background: white;
          color: #000;
          padding: 20px;
        }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
        .logo-img { height: 60px; object-fit: contain; }
        .section-title { font-weight: bold; background: #eee; padding: 5px 10px; margin-top: 20px; border-left: 5px solid #000; font-size: 14px; text-transform: uppercase; }
        .row { display: flex; flex-wrap: wrap; margin-top: 10px; }
        .col { flex: 1; min-width: 200px; margin-bottom: 8px; }
        .label { font-weight: bold; font-size: 12px; color: #555; display: block; }
        .value { font-size: 14px; }
        .box-field { border: 1px solid #ccc; padding: 10px; margin-top: 5px; min-height: 40px; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; border-top: 1px solid #ccc; padding-top: 20px; }
        .assinaturas { display: flex; justify-content: space-between; margin-top: 60px; }
        .assinatura-line { border-top: 1px solid #000; width: 40%; text-align: center; padding-top: 5px; }
      `}</style>

      {/* CABEÇALHO */}
      <div className="header">
        <img src={logo} alt="Kadmill Logo" className="logo-img" />
        <div style={{ textAlign: "right" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>ORDEM DE SERVIÇO</h1>
          <h2 style={{ margin: "5px 0 0", fontSize: "18px", color: "#666" }}>#{os.numero_os}</h2>
          <span style={{ fontSize: "12px", display: "block", marginTop: "5px" }}>
             Status: <strong>{os.status}</strong>
          </span>
        </div>
      </div>

      {/* DADOS DO CLIENTE */}
      <div className="section-title">Dados do Cliente</div>
      <div className="row">
        <div className="col">
          <span className="label">Cliente:</span>
          <span className="value">{os.cliente.nome}</span>
        </div>
        <div className="col">
          <span className="label">CPF/CNPJ:</span>
          <span className="value">{os.cliente.cpf_cnpj}</span>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <span className="label">Telefone:</span>
          <span className="value">{os.cliente.telefone}</span>
        </div>
        <div className="col">
          <span className="label">Email:</span>
          <span className="value">{os.cliente.email}</span>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <span className="label">Endereço:</span>
          <span className="value">{os.cliente.endereco}</span>
        </div>
      </div>

      {/* DETALHES DO SERVIÇO */}
      <div className="section-title">Detalhes do Serviço</div>
      <div className="row">
        <div className="col">
          <span className="label">Descrição do Serviço:</span>
          <div className="value box-field">{os.descricao_servico}</div>
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          <span className="label">Equipamento Utilizado:</span>
          <span className="value">{os.equipamento_utilizado || "—"}</span>
        </div>
        <div className="col">
          <span className="label">Executante (Técnico):</span>
          <span className="value">{os.executante || "—"}</span>
        </div>
        <div className="col">
            <span className="label">Quantidade Esperada:</span>
            <span className="value">{os.quantidade_esperada || 0}</span>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <span className="label">Data Abertura:</span>
          <span className="value">{formatDate(os.data_abertura)}</span>
        </div>
        <div className="col">
          <span className="label">Início Serviço:</span>
          <span className="value">{formatDate(os.inicio_servico)}</span>
        </div>
        <div className="col">
          <span className="label">Fim Serviço:</span>
          <span className="value">{formatDate(os.fim_servico)}</span>
        </div>
      </div>

      {/* OBSERVACÕES */}
      {os.observacao && (
        <>
          <div className="section-title">Observações</div>
          <div className="value box-field" style={{ minHeight: "60px" }}>
            {os.observacao}
          </div>
        </>
      )}

      {/* --- 2. ALTERAÇÃO AQUI: Bloco de Fechamento/Valor --- */}
      <div className="section-title">Fechamento</div>
      <div className="row" style={{ alignItems: "center", justifyContent: "flex-end", marginTop: "20px" }}>
        <div style={{ marginRight: "40px", textAlign: "right" }}>
            <span className="label">Tempo Total (Min):</span>
            <span className="value" style={{ fontSize: "16px" }}>{os.tempo_total_execucao || 0} min</span>
        </div>
        
        {/* SÓ MOSTRA O VALOR SE FOR ADMIN */}
        {isAdmin() ? (
            <div style={{ textAlign: "right", background: "#f0f0f0", padding: "10px", borderRadius: "4px" }}>
                <span className="label">VALOR TOTAL:</span>
                <span className="value" style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {formatMoney(os.valor_total)}
                </span>
            </div>
        ) : (
            <div style={{ textAlign: "right", padding: "10px" }}>
                <span className="label">VALOR TOTAL:</span>
                <span className="value" style={{ fontSize: "16px", fontStyle: "italic", color: "#666" }}>
                0
                </span>
            </div>
        )}
      </div>

      {/* ASSINATURAS */}
      <div className="assinaturas">
        <div className="assinatura-line">
            Responsável
        </div>
        <div className="assinatura-line">
            Cliente
        </div>
      </div>

      <div className="footer">
        <p>LR Usinagem</p>
      </div>

      {/* Botão apenas para tela, caso o print automático falhe */}
      <div className="no-print" style={{ position: "fixed", top: 20, right: 20 }}>
        <button 
            onClick={() => window.print()}
            style={{ padding: "10px 20px", background: "#333", color: "#fff", border: "none", cursor: "pointer", borderRadius: "5px" }}
        >
            🖨️ Imprimir
        </button>
      </div>
    </div>
  );
};

export default ImpressaoOS;