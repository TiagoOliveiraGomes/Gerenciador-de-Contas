import React from 'react';
import { Bank, Account, Installment } from './types';
// import { FaTrash, FaCheck, FaChevronDown } from 'react-icons/fa';

interface AccountsTableProps {
  bank: Bank;
  onToggleConclusion: (accountId: number, installmentId?: number) => void;
  onToggleInstallments: (accountId: number) => void;
  onDeleteAccount: (accountId: number) => void;
}

const AccountsTable: React.FC<AccountsTableProps> = ({
  bank,
  onToggleConclusion,
  onToggleInstallments,
  onDeleteAccount
}) => {
  return (
    <div className="p-4">
      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Ações</th>
            <th className="p-2">Data</th>
            <th className="p-2">Valor</th>
            <th className="p-2">Descrição</th>
          </tr>
        </thead>
        <tbody>
          {bank.accounts.map((account) => {
            // Se a conta estiver concluída, deixamos um estilo semi-transparente
            const rowStyle = account.isConcluded ? 'opacity-50' : '';

            return (
              <React.Fragment key={account.id}>
                <tr className={`${rowStyle} border-b border-gray-300`}>
                  <td className="p-2">
                    {/* Botão de marcar como concluído */}
                    <button
                      className="mr-2 text-green-500"
                      onClick={() => onToggleConclusion(account.id)}
                      title="Marcar como concluída"
                    >
                      {/* <FaCheck /> */}
                    </button>

                    {/* Botão de apagar a conta */}
                    <button
                      className="mr-2 text-red-500"
                      onClick={() => onDeleteAccount(account.id)}
                      title="Apagar conta"
                    >
                      {/* <FaTrash /> */}
                    </button>

                    {/* Botão de expandir parcelas (se houver) */}
                    {account.installments && account.installments.length > 0 && (
                      <button
                        className="text-white bg-gray-600 px-2 py-1 rounded"
                        onClick={() => onToggleInstallments(account.id)}
                        title="Exibir parcelas"
                      >
                        {/* <FaChevronDown /> */}
                      </button>
                    )}
                  </td>
                  <td className="p-2">{account.date}</td>
                  <td className="p-2">{account.value}</td>
                  <td className="p-2">{account.description}</td>
                </tr>

                {/* Se showInstallments estiver true, exibe as parcelas */}
                {account.showInstallments && account.installments?.map((inst: Installment) => {
                  const installmentStyle = inst.isConcluded ? 'opacity-50' : '';
                  return (
                    <tr
                      key={inst.id}
                      className={`border-b border-gray-300 ${installmentStyle}`}
                    >
                      <td className="p-2 pl-8">
                        {/* Marcando parcela como concluída */}
                        <button
                          className="mr-2 text-green-500"
                          onClick={() => onToggleConclusion(account.id, inst.id)}
                          title="Marcar parcela como concluída"
                        >
                          {/* <FaCheck /> */}
                        </button>
                        {/* Não apagamos parcela individual, mas poderia adicionar
                            um botão, se desejado. */}
                      </td>
                      <td className="p-2">{inst.date}</td>
                      <td className="p-2">{inst.value}</td>
                      <td className="p-2">Parcela #{inst.id}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccountsTable;
