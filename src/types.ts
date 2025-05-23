// types.ts

// Representa uma parcela (se houver várias parcelas)
export interface Installment {
    id: number;
    date: string;
    value: number;
    isConcluded: boolean;
  }
  
  // Representa uma conta
  export interface Account {
    id: number;
    date: string;
    value: number;
    description: string;
    isConcluded: boolean;
    showInstallments: boolean; // se a seta for clicada, exibirá as parcelas
    installments?: Installment[]; // parcelas, se houver
  }
  
  // Representa um banco
  export interface Bank {
    id: number;
    name: string;
    // icon: string; // caminho do ícone ou nome do ícone do react-icons
    accounts: Account[];
  }
  
  export interface Installment {
    id: number;
    value: number;
    date: string;
    isConcluded: boolean;
  }
  
  export interface NewAccount {
    bank: string; // se quiser pode mudar para 'bankId: number' mais tarde
    isInstallment: boolean;
    value: number;
    date: string;
    description: string;
    isConcluded: boolean;
    showInstallments: boolean;
    installments: Installment[];
  }