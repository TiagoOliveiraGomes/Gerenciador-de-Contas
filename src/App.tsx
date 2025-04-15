import React, { useEffect, useState } from 'react';
import Header from './Header';
import BankSelector from './BankSelector';
import AccountsTable from './AccountsTable';
import { Bank, NewAccount } from './types';
import ModalCreateBill from './components/ModalCreateBill';
import ModalAddBank from './components/ModalAddBank';
import Modal from './components/ModalBase';

const App: React.FC = () => {
  // Exemplo de dados iniciais
  const [banks, setBanks] = useState<Bank[]>([
    {
      id: 1,
      name: 'Inter',
      // icon: 'I', // substitua por um ícone de sua preferência
      accounts: [
        {
          id: 101,
          date: '2025-05-10',
          value: 500,
          description: 'Pagamento de alguma coisa',
          isConcluded: false,
          showInstallments: false,
          installments: [
            {
              id: 1,
              date: '2025-05-10',
              value: 250,
              isConcluded: false
            },
            {
              id: 2,
              date: '2025-06-10',
              value: 250,
              isConcluded: false
            }
          ]
        },
        {
          id: 102,
          date: '2025-05-15',
          value: 400,
          description: 'Compra de R$400',
          isConcluded: false,
          showInstallments: false
        },
      ]
    },
  ]);

  // Inicializa com o id do primeiro banco se existir, ou 0 (ou outro valor padrão)
  const [selectedBankId, setSelectedBankId] = useState<number>(banks.length > 0 ? banks[0].id : 0);

  useEffect(() => {
    if (banks.length > 0 && !banks.find(b => b.id === selectedBankId)) {
      setSelectedBankId(banks[0].id);
    }
  }, [banks, selectedBankId]);
  

  const [isModalAddBankOpen, setIsModalAddBankOpen] = useState<boolean>(false);


  // Retorna o banco selecionado (ou null se não encontrar)
  const selectedBank = banks.find((bank) => bank.id === selectedBankId) || null;

  // Altera o banco selecionado
  const handleSelectBank = (id: number) => {
    setSelectedBankId(id);
  };

  // Marca (ou desmarca) conta ou parcela como concluída
  const handleToggleConclusion = (accountId: number, installmentId?: number) => {
    setBanks((prevBanks) => {
      return prevBanks.map((bank) => {
        if (bank.id !== selectedBankId) return bank;

        const updatedAccounts = bank.accounts.map((acc) => {
          if (acc.id !== accountId) return acc;
          
          // Se for parcela:
          if (installmentId && acc.installments) {
            const updatedInstallments = acc.installments.map((inst) => {
              if (inst.id === installmentId) {
                return { ...inst, isConcluded: !inst.isConcluded };
              }
              return inst;
            });
            return { ...acc, installments: updatedInstallments };
          } else {
            // Se não for parcela, estamos marcando a conta inteira
            return { ...acc, isConcluded: !acc.isConcluded };
          }
        });

        return { ...bank, accounts: updatedAccounts };
      });
    });
  };
  const handleAddNewBank = (newBank: { name: string;}) => {
    setBanks((prevBanks) => [
      ...prevBanks,
      {
        id: prevBanks.length > 0 ? Math.max(...prevBanks.map((b) => b.id)) + 1 : 1,
        name: newBank.name,
        accounts: [],
      }
    ]);
    setIsModalAddBankOpen(false);
  };
  

  // Alterna exibição de parcelas
  const handleToggleInstallments = (accountId: number) => {
    setBanks((prevBanks) => {
      return prevBanks.map((bank) => {
        if (bank.id !== selectedBankId) return bank;

        const updatedAccounts = bank.accounts.map((acc) => {
          if (acc.id === accountId) {
            return { ...acc, showInstallments: !acc.showInstallments };
          }
          return acc;
        });

        return { ...bank, accounts: updatedAccounts };
      });
    });
  };

  // Deleta a conta selecionada
  const handleDeleteAccount = (accountId: number) => {
    setBanks((prevBanks) => {
      return prevBanks.map((bank) => {
        if (bank.id !== selectedBankId) return bank;
        const filteredAccounts = bank.accounts.filter(
          (acc) => acc.id !== accountId
        );
        return { ...bank, accounts: filteredAccounts };
      });
    });
  };

  // Função para carregar dados de um arquivo .txt (exemplo simplificado)
  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        try {
          // Supondo que o arquivo .txt contenha JSON
          const data: Bank[] = JSON.parse(e.target.result as string);
          setBanks(data);
          setSelectedBankId(data[0]?.id || 1);
        } catch (error) {
          console.error('Erro ao fazer parse do arquivo:', error);
          // Trate o erro: arquivo inválido, etc.
        }
      }
    };
    reader.readAsText(file);
  };

  // Função para salvar os dados em um arquivo .txt (simulação)
  const handleSaveChanges = () => {
    // Convertemos "banks" para JSON
    const jsonString = JSON.stringify(banks, null, 2);
    // Criamos um Blob e "forçamos" o download
    const blob = new Blob([jsonString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'dados_bancos.txt';
    link.click();
    URL.revokeObjectURL(url);
  };
  const handleDeleteBank = (bankId: number) => {
    setBanks((prevBanks) => prevBanks.filter((bank) => bank.id !== bankId));
  
    // se o banco deletado for o selecionado, seleciona o primeiro disponível (ou nenhum)
    if (bankId === selectedBankId) {
      const updatedBanks = banks.filter((bank) => bank.id !== bankId);
      setSelectedBankId(updatedBanks[0]?.id || 0);
    }
  };
  

  const [isBillModalOpen, setIsBillModalOpen] = useState<boolean>(false)
  const [isDeleteBankModalOpen, setIsDeleteBankModalOpen] = useState<boolean>(false)
  const [bankIdToDelete, setBankIdToDelete] = useState<number | null>(null);


  const handleAddNewAccount = (newAccount: NewAccount & { bankId: number }) => {
    setBanks((prevBanks) => {
      return prevBanks.map((bank) => {
        if (bank.id !== newAccount.bankId) return bank;
    
        const newId =
          bank.accounts.length > 0
            ? Math.max(...bank.accounts.map((acc) => acc.id)) + 1
            : 1;
    
        const accountToAdd = {
          id: newId,
          ...newAccount,
          isConcluded: false,
          showInstallments: false,
          installments: newAccount.installments?.map((inst, index: number) => ({
            ...inst,
            id: index + 1,
            isConcluded: false,
          })),
        };
    
        return { ...bank, accounts: [...bank.accounts, accountToAdd] };
      });
    });
    setIsBillModalOpen(false);
  };
  

  const bankToDelete = bankIdToDelete !== null 
  ? banks.find(bank => bank.id === bankIdToDelete) 
  : null;


  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header title="Gerenciador de Contas" />

      {/* Bank Selector (slideScroll) */}
      <BankSelector
        banks={banks}
        selectedBankId={selectedBankId}
        onSelectBank={handleSelectBank}
        onDeleteBank={(id) => {
          setBankIdToDelete(id)
          setIsDeleteBankModalOpen(true)
        }}
      />


      {/* Tabela de Contas */}
      {selectedBank && (
        <AccountsTable
          bank={selectedBank}
          onToggleConclusion={handleToggleConclusion}
          onToggleInstallments={handleToggleInstallments}
          onDeleteAccount={handleDeleteAccount}
        />
      )}

      {/* Botões de Carregar/Salvar no canto inferior direito (ou onde preferir) */}
      <div className="p-4 mt-auto flex justify-between items-center space-x-4">

        <div className='p-4 mt-auto flex justify-end items-center space-x-4'>
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={() => setIsModalAddBankOpen(true)}
        >
          Adicionar Banco +
        </button>

        <button
            disabled={banks.length === 0}
            className={`  px-4 py-2 rounded ${banks.length?'bg-gray-700 hover:bg-gray-800 text-white' : 'text-gray-500 bg-gray-600'}`}
            onClick={() => setIsBillModalOpen(true)}
          >
            Adicionar conta +
          </button>
        </div>

        <div className="p-4 mt-auto flex justify-end items-center space-x-4">
          <div>
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Carregar arquivo
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".txt"
              onChange={handleLoadFromFile}
              className="hidden"
            />
          </div>
          
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Salvar mudanças
          </button>
        </div>

      </div>
      <ModalCreateBill
        isOpen={isBillModalOpen}
        banks={banks.map((b) => ({ id: b.id, name: b.name }))} // mapeando para o formato esperado
        onCancel={() => setIsBillModalOpen(false)}
        onConfirm={handleAddNewAccount}
      />

      <ModalAddBank
        isOpen={isModalAddBankOpen}
        onCancel={() => setIsModalAddBankOpen(false)}
        onConfirm={handleAddNewBank}
      />
      <Modal 
        isOpen={isDeleteBankModalOpen}
        message={`Deseja deletar o banco: ${bankToDelete ? bankToDelete.name : ''}`}
        onCancel={()=> {
          setIsDeleteBankModalOpen(false)
          setBankIdToDelete(null)
        }}
        onConfirm={() => {
          if(bankIdToDelete !== null){
            handleDeleteBank(bankIdToDelete)
            setIsDeleteBankModalOpen(false)
            setBankIdToDelete(null)
          }
        }}
      />


    </div>
  );
};

export default App;
