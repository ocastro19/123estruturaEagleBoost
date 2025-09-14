import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// Interface para as credenciais de autenticação
interface AdminCredentials {
  username: string;
  password: string;
}

interface CredentialsUpdateResult {
  success: boolean;
  error?: string;
}

// Credenciais iniciais do sistema
const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'eagleboost123'
};

class AuthService {
  private storageKey = 'admin_auth';
  private tokenKey = 'admin_token';
  private credentials: AdminCredentials;

  constructor() {
    this.credentials = this.loadCredentials();
  }

  // Carrega credenciais do localStorage ou usa padrão
  private loadCredentials(): AdminCredentials {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored) as AdminCredentials;
      }
    } catch (error) {
      console.warn('Falha ao carregar credenciais:', error);
    }
    
    // Se não existir, salva as credenciais padrão
    this.saveCredentials(DEFAULT_CREDENTIALS);
    return DEFAULT_CREDENTIALS;
  }

  // Salva credenciais no localStorage
  private saveCredentials(credentials: AdminCredentials): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(credentials));
    } catch (error) {
      console.error('Falha ao salvar credenciais:', error);
    }
  }

  // Verifica se as credenciais são válidas
  public login(username: string, password: string): boolean {
    const storedPassword = this.credentials.password;
    
    // Se a senha armazenada parece ser criptografada (contém caracteres especiais típicos do AES)
    const isEncrypted = storedPassword.includes('/');
    const actualPassword = isEncrypted ? this.decryptPassword(storedPassword) : storedPassword;
    
    if (username === this.credentials.username && password === actualPassword) {
      // Gera um token simples (em produção, use algo mais seguro)
      const token = `${username}_${Date.now()}`;
      localStorage.setItem(this.tokenKey, token);
      return true;
    }
    return false;
  }

  // Verifica se o usuário está autenticado
  public isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Faz logout do usuário
  public logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Atualiza as credenciais
  public updateCredentials(username: string, password: string): void {
    const newCredentials = { username, password };
    this.credentials = newCredentials;
    this.saveCredentials(newCredentials);
  }

  // Método para validar credenciais
  public validateCredentials(username: string, password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!username || username.trim().length < 3) {
      errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
    }
    
    if (!password || password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }
    
    if (username && !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      errors.push('Nome de usuário deve conter apenas letras, números e underscore');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Método para criptografar senha
  private encryptPassword(password: string): string {
    const secretKey = 'eagleboost-admin-secret-2024';
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  }

  // Método para descriptografar senha
  private decryptPassword(encryptedPassword: string): string {
    try {
      const secretKey = 'eagleboost-admin-secret-2024';
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }

  // Método para atualizar credenciais com validação e criptografia
  public async updateCredentialsSecure(currentPassword: string, newUsername: string, newPassword: string, confirmPassword: string): Promise<CredentialsUpdateResult> {
    try {
      // Verificar senha atual
      if (!this.verifyCurrentPassword(currentPassword)) {
        return {
          success: false,
          error: 'Senha atual incorreta'
        };
      }

      // Validar senhas coincidem
      if (newPassword !== confirmPassword) {
        return {
          success: false,
          error: 'As senhas não coincidem'
        };
      }

      // Validar credenciais
      const validation = this.validateCredentials(newUsername, newPassword);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Criptografar nova senha
      const encryptedPassword = this.encryptPassword(newPassword);
      
      // Atualizar credenciais
      this.updateCredentials(newUsername.trim(), encryptedPassword);
      
      // Fazer logout para forçar novo login
      this.logout();
      
      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro interno ao atualizar credenciais'
      };
    }
  }
  // Método para verificar senha atual
  private verifyCurrentPassword(currentPassword: string): boolean {
    const storedPassword = this.credentials.password;
    
    // Se a senha armazenada parece ser criptografada (contém caracteres especiais típicos do AES)
    const isEncrypted = storedPassword.includes('/');
    const actualPassword = isEncrypted ? this.decryptPassword(storedPassword) : storedPassword;
    
    return actualPassword === currentPassword;
  }
}

// Instância global do serviço de autenticação
export const authService = new AuthService();

// Hook para usar o serviço de autenticação em componentes React
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    // Verifica autenticação quando o componente monta
    checkAuth();

    // Adiciona listener para mudanças de armazenamento (para sincronizar entre abas)
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return {
    isAuthenticated,
    login: (username: string, password: string) => {
      const result = authService.login(username, password);
      setIsAuthenticated(result);
      return result;
    },
    logout: () => {
      authService.logout();
      setIsAuthenticated(false);
    },
    updateCredentials: authService.updateCredentials.bind(authService)
  };
};