import type { ToastType } from '@/types';

export interface ToastConfig {
  duration?: number;
  position?: 'top' | 'bottom';
}

export const defaultToastConfig: ToastConfig = {
  duration: 3000,
  position: 'top',
};

export const toastIcons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export const toastMessages = {
  success: {
    added: 'Adicionado ao carrinho!',
    removed: 'Removido do carrinho!',
    cleared: 'Carrinho limpo!',
    saved: 'Salvo com sucesso!',
    copied: 'Copiado para a área de transferência!',
  },
  error: {
    generic: 'Ocorreu um erro. Tente novamente.',
    empty: 'Preencha todos os campos obrigatórios.',
    invalid: 'Dados inválidos.',
    network: 'Erro de conexão. Verifique sua internet.',
  },
  info: {
    loading: 'Carregando...',
    redirecting: 'Redirecionando...',
  },
};
