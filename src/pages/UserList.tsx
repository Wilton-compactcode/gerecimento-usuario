import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';

interface UserListProps {
  setThemeMode: (mode: 'light' | 'dark') => void;
  themeMode: 'light' | 'dark';
}

// Define the theme object
const theme = {
  light: {
    background: '#fef3c7',
    cardBackground: '#ffffff',
    text: '#1e293b',
    secondaryText: '#64748b',
    border: 'rgba(0, 0, 0, 0.1)',
    inputBackground: '#f8fafc',
    inputBorder: '#cbd5e1',
    placeholder: '#94a3b8',
    frameBorder: '5px solid #ef4444',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    headerBackground: '#f8fafc',
    rowHover: '#f8fafc',
    rowBorder: '#f1f5f9',
    tagBackground: '#e2e8f0',
    statusActive: '#22c55e',
    statusInactive: '#ef4444',
    actionEdit: '#3b82f6',
    actionDelete: '#ef4444',
    modalBackground: '#ffffff',
    modalShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    footerBackground: '#ffffff',
  },
  dark: {
    background: '#0f172a',
    cardBackground: '#232a36',
    text: '#fff',
    secondaryText: '#a0a4ab',
    border: 'rgba(255, 255, 255, 0.2)',
    inputBackground: '#181e27',
    inputBorder: '#3a4252',
    placeholder: '#6b7280',
    frameBorder: '5px solid #22c55e',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    headerBackground: '#1a202c',
    rowHover: '#2a3441',
    rowBorder: '#2d3748',
    tagBackground: '#3a4252',
    statusActive: '#22c55e',
    statusInactive: '#ef4444',
    actionEdit: '#3b82f6',
    actionDelete: '#ef4444',
    modalBackground: '#232a36',
    modalShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    footerBackground: '#232a36',
  },
};

// Container principal
const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  position: relative;
`;


// Header conforme print
const Header = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  padding: 8px 12px;
  flex: 1;
  max-width: calc(100% - 20px);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled.span`
  color: ${({ theme }) => theme.placeholder};
  margin-right: 8px;
  font-size: 16px;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }
`;


const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.border};
    border-color: #3b82f6;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

// Tabela
const TableContainer = styled.div`
  padding: 24px;
`;

const Table = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
`;

const TableHeader = styled.div`
  background-color: ${({ theme }) => theme.headerBackground};
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 60px 1fr 150px 120px 150px 100px;
  gap: 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.secondaryText};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
`;

const TableRow = styled.div`
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 60px 1fr 150px 120px 150px 100px;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.rowBorder};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.rowHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.secondaryText};
`;

const Tag = styled.span<{ color: string }>`
  padding: 4px 12px;
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

const StatusCell = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
`;

// Footer
const Footer = styled.div`
  background-color: ${({ theme }) => theme.footerBackground};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const PaginationInfo = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.secondaryText};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active', 'disabled'].includes(prop as string)
})<{ active?: boolean; disabled?: boolean }>`
  padding: 8px 16px;
  background-color: ${({ theme, active }) => active ? theme.tagBackground : 'transparent'};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  font-size: 14px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.rowHover};
  }
`;

// Componentes do menu de três pontinhos
const MenuContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.rowHover};
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadow};
  min-width: 120px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.rowHover};
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

// Componentes dos modais
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.modalBackground};
  border-radius: 12px;
  padding: 0;
  min-width: 800px;
  max-width: 900px;
  box-shadow: ${({ theme }) => theme.modalShadow};
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBackground};
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ModalSidebar = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.border};
`;

const ProfileImageContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: scale(1.05);
    border-color: #3b82f6;
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  }
`;

const ProfileImagePlaceholder = styled.div`
  color: white;
  font-size: 48px;
  font-weight: bold;
`;

const ProfileName = styled.h3`
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
`;

const ProfileRole = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
  font-size: 14px;
  text-align: center;
`;

const ModalMainContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const FormTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.text};
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${({ theme }) => theme.secondaryText};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.rowHover};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.rowHover};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.rowHover};
    cursor: not-allowed;
    opacity: 0.6;
  }

  option {
    background-color: ${({ theme }) => theme.cardBackground};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const ModalButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
  &:hover {
            background-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover {
            background-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
          &:hover {
            background-color: #f3f4f6;
          }
        `;
    }
  }}
`;

const UnlockButton = styled.button`
  padding: 8px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
  }
`;

// Modal de Filtro
const FilterModal = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: ${({ theme }) => theme.cardBackground};
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const FilterModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const FilterModalTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const FilterModalBody = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  option {
    background-color: ${({ theme }) => theme.cardBackground};
  }
`;

const FilterCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FilterCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const FilterCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const FilterModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  gap: 12px;
`;

const FilterModalButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 10px;
  border: ${({ variant }) => variant === 'primary' ? 'none' : '1px solid #d1d5db'};
  border-radius: 6px;
  background-color: ${({ variant }) => variant === 'primary' ? '#3b82f6' : 'transparent'};
  color: ${({ variant }) => variant === 'primary' ? 'white' : '#6b7280'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ variant }) => variant === 'primary' ? '#2563eb' : '#f3f4f6'};
  }
`;

const FilterOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen'
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

interface User {
  id: string;
  nome: string;
  email: string;
  id_Usuario_Nivel?: string;
  desativadoSN?: boolean;
  apelido?: string;
  id_Pessoa?: string | null;
  menu_Principal_PersonalizadoSN?: boolean;
}

const UserList: React.FC<UserListProps> = ({ setThemeMode, themeMode }) => {
  // Dados completos da API
  const [allUsers, setAllUsers] = useState<User[]>([]);
  // Dados filtrados (após aplicar filtros)
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  // Dados paginados (o que aparece na tela)
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
  
  const [filterName, setFilterName] = useState('');
  const [filterLevel, setFilterLevel] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormLocked, setEditFormLocked] = useState(true);
  const [editFormData, setEditFormData] = useState({
    nome: '',
    apelido: '',
    id_Usuario_Nivel: '' as string,
    email: '',
    novoEmail: '',
    confirmaEmail: '',
    senhaAtual: '',
    novaSenha: '',
    confirmaSenha: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Buscar todos os usuários da API (sem paginação)
  const fetchAllUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Buscando TODOS os usuários da API...');
      
      const response = await axios.get('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Listar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const users = response.data || [];
      console.log('📊 API retornou:', users.length, 'usuários');
      
      setAllUsers(users);
      
    } catch (error: any) {
      console.error('❌ Erro ao buscar usuários:', error);
      if (error.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Aplicar filtros e paginação localmente
  const applyFiltersAndPagination = useCallback(() => {
    console.log('🔍 Aplicando filtros e paginação local...');
    
    let filtered = [...allUsers];
    
    // Filtro por nome
    if (filterName.trim()) {
      const searchTerm = filterName.toLowerCase().trim();
      filtered = filtered.filter(user => 
        (user.nome?.toLowerCase().includes(searchTerm)) ||
        (user.email?.toLowerCase().includes(searchTerm))
      );
      console.log('🔍 Filtro por nome:', searchTerm, '- Resultado:', filtered.length, 'usuários');
    }
    
    // Filtro por nível
    if (filterLevel.length > 0) {
      filtered = filtered.filter(user => 
        user.id_Usuario_Nivel && filterLevel.includes(user.id_Usuario_Nivel)
      );
      console.log('🔍 Filtro por nível:', filterLevel, '- Resultado:', filtered.length, 'usuários');
    }
    
    // Filtro por status
    if (filterStatus !== '') {
      const isInactive = filterStatus === 'true';
      filtered = filtered.filter(user => user.desativadoSN === isInactive);
      console.log('🔍 Filtro por status:', isInactive ? 'Inativo' : 'Ativo', '- Resultado:', filtered.length, 'usuários');
    }
    
    setFilteredUsers(filtered);
    
    // Aplicar paginação
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const validPage = Math.min(currentPage, Math.max(1, totalPages));
    
    if (validPage !== currentPage && totalPages > 0) {
      setCurrentPage(validPage);
    }
    
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    
    console.log('📄 Paginação:', {
      totalFiltrados: filtered.length,
      páginaAtual: validPage,
      totalPáginas: totalPages,
      itensPorPágina: itemsPerPage,
      índiceInício: startIndex,
      índiceFim: endIndex,
      usuáriosNaPágina: paginated.length
    });
    
    setPaginatedUsers(paginated);
  }, [allUsers, filterName, filterLevel, filterStatus, currentPage, itemsPerPage]);

  // Buscar dados iniciais
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Aplicar filtros e paginação quando dados ou filtros mudarem
  useEffect(() => {
    if (allUsers.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allUsers, filterName, filterLevel, filterStatus, currentPage, applyFiltersAndPagination]);

  // Função para realizar a busca
  const handleSearch = useCallback(() => {
    console.log('🔍 Iniciando busca com filtro:', filterName);
    setCurrentPage(1); // Reset para primeira página ao buscar
  }, [filterName]);

  // Reset para primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterLevel, filterStatus]);

  // Detectar refresh solicitado pela navegação após criação
  useEffect(() => {
    if (location.state?.refresh) {
      console.log('🔄 Refresh solicitado após criação de usuário');
      // Limpar filtros para garantir que o novo usuário apareça
      setFilterName('');
      setFilterLevel([]);
      setFilterStatus('');
      setCurrentPage(1);
      fetchAllUsers();
      // Limpar o state para evitar refresh desnecessário
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, fetchAllUsers, navigate, location.pathname]);

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    if (activeMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenuId]);

  const handleMenuToggle = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === userId ? null : userId);
  };

  const handleEditClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setEditFormData({
      nome: user.nome || '',
      apelido: user.apelido || '',
      id_Usuario_Nivel: user.id_Usuario_Nivel || '',
      email: user.email || '',
      novoEmail: '',
      confirmaEmail: '',
      senhaAtual: '',
      novaSenha: '',
      confirmaSenha: ''
    });
    setEditFormLocked(true);
    setEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeactivateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeactivateModalOpen(true);
    setActiveMenuId(null);
  };

  const handleEditSave = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      // Enviar como array conforme API v2 espera
      await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar', [{
        id: selectedUser.id,
        nome: editFormData.nome,
        apelido: editFormData.apelido,
        id_Usuario_Nivel: editFormData.id_Usuario_Nivel
      }], {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditModalOpen(false);
      setEditFormLocked(true);
      fetchAllUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        navigate('/');
        return;
      }

      console.log('🔧 Desativando usuário via API...');
      
      // Usar o endpoint de atualização com campo desativadoSN = true
      const updatePayload: any = {
        id: selectedUser.id,
        nome: selectedUser.nome,
        id_Usuario_Nivel: selectedUser.id_Usuario_Nivel,
        desativadoSN: true // Desativar usuário
      };

      // Adicionar apelido se existir
      if (selectedUser.apelido) {
        updatePayload.apelido = selectedUser.apelido;
      }

      const response = await axios.put(
        'https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar',
        [updatePayload],
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        console.log('✅ Usuário desativado com sucesso via API');
        alert(`Usuário "${selectedUser.nome}" foi desativado com sucesso!`);
      }
      
      setDeleteModalOpen(false);
      fetchAllUsers(); // Atualizar lista para refletir mudanças
    } catch (error: any) {
      console.error('❌ Erro ao desativar usuário:', error);
      
      let errorMessage = 'Erro ao desativar usuário.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Token expirado. Faça login novamente.';
        navigate('/');
      }
      
      alert(errorMessage);
    }
  };

  const handleDeactivateConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      const token = localStorage.getItem('token');
      // Usar endpoint correto para desativar usuário
      await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Desativar', [{
        id: selectedUser.id
      }], {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeactivateModalOpen(false);
      setEditModalOpen(false);
      fetchAllUsers();
    } catch (error: any) {
      console.error('Error deactivating user:', error);
    }
  };

  const applyFilters = () => {
    console.log('Aplicando filtros:', {
      filterName,
      filterLevel,
      filterStatus
    });
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterLevel([]);
    setFilterStatus('');
    setFilterName('');
    setCurrentPage(1);
    setFilterOpen(false); // Fechar o modal após limpar filtros
  };


  const handleLevelFilterChange = (level: string, checked: boolean) => {
    if (checked) {
      setFilterLevel(prev => [...prev, level]);
    } else {
      setFilterLevel(prev => prev.filter(l => l !== level));
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      nome: user.nome,
      apelido: user.apelido || '',
      id_Usuario_Nivel: user.id_Usuario_Nivel || '',
      email: user.email,
      novoEmail: '',
      confirmaEmail: '',
      senhaAtual: '',
      novaSenha: '',
      confirmaSenha: ''
    });
    setEditModalOpen(true);
    setEditFormLocked(true);
  };



  const getAvatarColor = (name: string | undefined) => {
    if (!name) return '#6b7280';
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'N/A';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getLevelTagColor = (level: string | undefined) => {
    if (!level) return '#6b7280';
    const colors: { [key: string]: string } = {
      ADMINISTRADOR: '#6366f1',
      ENGENHARIA_01: '#10b981',
      ENGENHARIA_02: '#f59e0b',
    };
    return colors[level] || '#6b7280';
  };

  const getStatusTagColor = (active: boolean) => {
    return active ? theme[themeMode].statusActive : theme[themeMode].statusInactive;
  };

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <Container>

        <Header>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              placeholder="Pesquisa"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  console.log('⌨️ Enter pressionado, executando busca...');
                  handleSearch();
                }
              }}
            />
          </SearchContainer>
          <HeaderButtons>
            <FilterButton onClick={() => setFilterOpen(true)}>
              <span>🔽</span>
              Filtrar
            </FilterButton>
            <AddButton onClick={() => navigate('/create-user')}>
              📄 Relatório
            </AddButton>
            <AddButton onClick={() => navigate('/create-user')}>
              ➕ Adicionar
            </AddButton>
          </HeaderButtons>
        </Header>

        <TableContainer>
          <Table>
            <TableHeader>
              <div></div>
              <div>Usuário</div>
              <div>Nível</div>
              <div>Status</div>
              <div>Email</div>
              <div>Ações</div>
            </TableHeader>
            
            {loading ? (
              <TableRow>
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#6b7280' 
                }}>
                  🔍 Carregando usuários...
                </div>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px', 
                  color: '#6b7280' 
                }}>
                  📄 Nenhum usuário encontrado
                </div>
              </TableRow>
            ) : paginatedUsers.map((user) => (
              <TableRow key={user.id} onClick={() => handleRowClick(user)}>
                <Avatar color={getAvatarColor(user.nome)}>
                  {getInitials(user.nome)}
                </Avatar>
                <UserInfo>
                  <UserName>{user.nome || 'Nome não disponível'}</UserName>
                  {user.apelido && <UserEmail>{user.apelido}</UserEmail>}
                </UserInfo>
                <div>
                  <Tag color={getLevelTagColor(user.id_Usuario_Nivel)}>
                    {user.id_Usuario_Nivel ? user.id_Usuario_Nivel.replace('_', ' ') : 'N/A'}
                  </Tag>
                </div>
                <StatusCell>
                  <Tag color={getStatusTagColor(!user.desativadoSN)}>
                    {user.desativadoSN ? 'Inativo' : 'Ativo'}
                  </Tag>
                </StatusCell>
                <UserEmail>{user.email}</UserEmail>
                <ActionsCell>
                  <MenuContainer>
                     <MenuButton onClick={(e) => handleMenuToggle(user.id, e)}>
                       ⋮
                     </MenuButton>
                    {activeMenuId === user.id && (
                      <MenuDropdown>
                        <MenuItem onClick={(e) => handleEditClick(user, e)}>
                    Editar
                        </MenuItem>
                        <MenuItem onClick={(e) => handleDeleteClick(user, e)}>
                    Excluir
                        </MenuItem>
                      </MenuDropdown>
                    )}
                  </MenuContainer>
                </ActionsCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>

        <Footer>
          <PaginationInfo>
            {filteredUsers.length > 0 ? (
              `Mostrando ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, filteredUsers.length)} de ${filteredUsers.length} usuários`
            ) : (
              'Nenhum usuário encontrado'
            )}
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton 
              disabled={currentPage === 1}
              onClick={() => {
                if (currentPage > 1) {
                  const newPage = currentPage - 1;
                  console.log('⬅️ Navegando para página anterior:', newPage);
                  setCurrentPage(newPage);
                }
              }}
            >
              ← Anterior
            </PaginationButton>
            
            {/* Mostrar páginas */}
            {Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => i + 1)
              .filter(page => {
                const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                if (totalPages <= 5) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                return false;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                const showEllipsis = prevPage && page - prevPage > 1;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span style={{ padding: '8px 4px', color: '#6b7280' }}>...</span>
                    )}
                    <PaginationButton
                      active={currentPage === page}
                      onClick={() => {
                        console.log('🔢 Navegando para página:', page);
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationButton>
                  </React.Fragment>
                );
              })}
            
            <PaginationButton 
              disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
              onClick={() => {
                const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                if (currentPage < totalPages) {
                  const newPage = currentPage + 1;
                  console.log('➡️ Navegando para próxima página:', newPage);
                  setCurrentPage(newPage);
                }
              }}
            >
              Próxima →
            </PaginationButton>
          </PaginationControls>
        </Footer>


         {/* Modal de Edição */}
         {editModalOpen && (
           <ModalOverlay onClick={() => setEditModalOpen(false)}>
             <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
                 <ModalTitle>Editar</ModalTitle>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   {editFormLocked && (
                     <UnlockButton onClick={() => setEditFormLocked(false)}>
                       🔓 Liberar
                     </UnlockButton>
                   )}
                   <MenuContainer>
                     <MenuButton onClick={(e) => handleMenuToggle('edit-modal', e)}>
                       ⋮
                     </MenuButton>
                     {activeMenuId === 'edit-modal' && (
                       <MenuDropdown>
                         <MenuItem onClick={(e) => handleDeactivateClick(e)}>
                           Desativar
                         </MenuItem>
                       </MenuDropdown>
                     )}
                   </MenuContainer>
                   <CloseButton onClick={() => setEditModalOpen(false)}>×</CloseButton>
                 </div>
            </ModalHeader>

               <ModalBody>
                 <ModalSidebar>
                   <ProfileImageContainer title="Clique para alterar foto">
                     <ProfileImagePlaceholder>
                       {getInitials(selectedUser?.nome)}
                     </ProfileImagePlaceholder>
                     {/* Ícone de câmera sobreposto */}
                     <div style={{
                       position: 'absolute',
                       bottom: '8px',
                       right: '8px',
                       backgroundColor: 'rgba(0, 0, 0, 0.7)',
                       borderRadius: '50%',
                       width: '24px',
                       height: '24px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       fontSize: '12px'
                     }}>
                       📷
                     </div>
                   </ProfileImageContainer>
                   <ProfileName>{selectedUser?.nome || 'Nome não disponível'}</ProfileName>
                   <ProfileRole>
                     {selectedUser?.id_Usuario_Nivel ? selectedUser.id_Usuario_Nivel.replace('_', ' ') : 'Nível não definido'}
                   </ProfileRole>
                 </ModalSidebar>

                 <ModalMainContent>
                   <FormTitle>Dados do usuário</FormTitle>

                   <FormGrid>
                    <FormGroup>
                      <FormLabel>Nome</FormLabel>
                      <FormInput
                type="text"
                        value={editFormData.nome}
                        onChange={(e) => setEditFormData({...editFormData, nome: e.target.value})}
                        disabled={editFormLocked}
                        placeholder="Digite o nome completo"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Apelido</FormLabel>
                      <FormInput
                        type="text"
                        value={editFormData.apelido}
                        onChange={(e) => setEditFormData({...editFormData, apelido: e.target.value})}
                        disabled={editFormLocked}
                        placeholder="Ex: Fazendeiro"
                      />
                    </FormGroup>
                  </FormGrid>

                  <FormGrid>
                    <FormGroup>
                      <FormLabel>Email</FormLabel>
                      <FormInput
                        type="email"
                        value={selectedUser?.email || ''}
                        disabled={true}
                        placeholder="email@exemplo.com"
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Nível da conta</FormLabel>
                      <FormSelect
                        value={editFormData.id_Usuario_Nivel}
                        onChange={(e) => setEditFormData({...editFormData, id_Usuario_Nivel: e.target.value})}
                        disabled={editFormLocked}
                      >
                        <option value="">Selecione o nível</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="ENGENHARIA_01">Engenharia 01</option>
                <option value="ENGENHARIA_02">Engenharia 02</option>
                      </FormSelect>
                    </FormGroup>
                  </FormGrid>

                  {/* Status do usuário */}
                  <FormGroup>
                    <FormLabel>Status da conta</FormLabel>
                    <div style={{ 
                      padding: '12px', 
                      border: `1px solid ${selectedUser?.desativadoSN ? '#ef4444' : '#22c55e'}`,
                      borderRadius: '8px',
                      backgroundColor: selectedUser?.desativadoSN ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ 
                        color: selectedUser?.desativadoSN ? '#ef4444' : '#22c55e',
                        fontWeight: '500'
                      }}>
                        {selectedUser?.desativadoSN ? '🔴 Conta Desativada' : '🟢 Conta Ativa'}
                      </span>
                      {selectedUser?.desativadoSN && !editFormLocked && (
                        <ModalButton 
                          variant="primary" 
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem('token');
                              await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar', [{
                                id: selectedUser.id,
                                nome: selectedUser.nome,
                                id_Usuario_Nivel: selectedUser.id_Usuario_Nivel,
                                desativadoSN: false,
                                ...(selectedUser.apelido ? { apelido: selectedUser.apelido } : {})
                              }], {
                                headers: { Authorization: `Bearer ${token}` }
                              });
                              alert('Usuário reativado com sucesso!');
                              setEditModalOpen(false);
                              fetchAllUsers();
                            } catch (error: any) {
                              console.error('Erro ao reativar usuário:', error);
                              alert('Erro ao reativar usuário.');
                            }
                          }}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Reativar Conta
                        </ModalButton>
                      )}
                    </div>
                  </FormGroup>

                  <ModalActions>
                    <ModalButton onClick={() => setEditModalOpen(false)}>
                      Cancelar
                    </ModalButton>
                    <ModalButton 
                      variant="primary" 
                      onClick={handleEditSave}
                      disabled={editFormLocked}
                    >
                      Salvar
                    </ModalButton>
                  </ModalActions>
                </ModalMainContent>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}

         {/* Modal de Confirmação de Desativação */}
         {deleteModalOpen && (
           <ModalOverlay onClick={() => setDeleteModalOpen(false)}>
             <ModalContent onClick={(e) => e.stopPropagation()} style={{ minWidth: '450px', maxWidth: '550px' }}>
               <ModalHeader>
                 <ModalTitle>Desativar Usuário</ModalTitle>
                 <CloseButton onClick={() => setDeleteModalOpen(false)}>×</CloseButton>
               </ModalHeader>
               
               <ModalMainContent>
                 <p style={{ color: 'inherit', marginBottom: '16px' }}>
                   Tem certeza que deseja desativar o usuário <strong>{selectedUser?.nome}</strong>?
                 </p>
                 <p style={{ color: '#22c55e', fontSize: '14px', marginBottom: '24px', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '6px' }}>
                   ✅ <strong>Funcionalidade:</strong> O usuário será desativado via API e não poderá mais acessar o sistema. 
                   Esta ação pode ser revertida posteriormente através da edição do usuário.
                 </p>

                 <ModalActions>
                   <ModalButton onClick={() => setDeleteModalOpen(false)}>
                     Cancelar
                   </ModalButton>
                   <ModalButton variant="danger" onClick={handleDeleteConfirm}>
                     Desativar Usuário
                   </ModalButton>
                 </ModalActions>
               </ModalMainContent>
             </ModalContent>
           </ModalOverlay>
         )}

         {/* Modal de Confirmação de Desativação */}
         {deactivateModalOpen && (
           <ModalOverlay onClick={() => setDeactivateModalOpen(false)}>
             <ModalContent onClick={(e) => e.stopPropagation()} style={{ minWidth: '400px', maxWidth: '500px' }}>
               <ModalHeader>
                 <ModalTitle>Confirmar Desativação</ModalTitle>
                 <CloseButton onClick={() => setDeactivateModalOpen(false)}>×</CloseButton>
               </ModalHeader>
               
               <ModalMainContent>
                 <p style={{ color: 'inherit', marginBottom: '24px' }}>
                   Tem certeza que deseja desativar o usuário <strong>{selectedUser?.nome}</strong>?
                   <br />
                   Esta ação não pode ser desfeita.
                 </p>

                 <ModalActions>
                   <ModalButton onClick={() => setDeactivateModalOpen(false)}>
                     Cancelar
                   </ModalButton>
                   <ModalButton variant="danger" onClick={handleDeactivateConfirm}>
                     Desativar
                   </ModalButton>
                 </ModalActions>
               </ModalMainContent>
             </ModalContent>
           </ModalOverlay>
         )}

        {/* Modal de Filtro */}
        <FilterOverlay isOpen={filterOpen} onClick={() => setFilterOpen(false)} />
        <FilterModal isOpen={filterOpen}>
          <FilterModalHeader>
            <FilterModalTitle>Filtro</FilterModalTitle>
            <CloseButton onClick={() => setFilterOpen(false)}>×</CloseButton>
          </FilterModalHeader>
          
          <FilterModalBody>
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="false">Ativo</option>
                <option value="true">Inativo</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Nível</FilterLabel>
              <FilterCheckboxGroup>
                <FilterCheckboxItem>
                  <FilterCheckbox
                    type="checkbox"
                    checked={filterLevel.includes('ADMINISTRADOR')}
                    onChange={(e) => handleLevelFilterChange('ADMINISTRADOR', e.target.checked)}
                  />
                  ADMINISTRADOR
                </FilterCheckboxItem>
                <FilterCheckboxItem>
                  <FilterCheckbox
                    type="checkbox"
                    checked={filterLevel.includes('ENGENHARIA_01')}
                    onChange={(e) => handleLevelFilterChange('ENGENHARIA_01', e.target.checked)}
                  />
                  ENGENHARIA 01
                </FilterCheckboxItem>
                <FilterCheckboxItem>
                  <FilterCheckbox
                    type="checkbox"
                    checked={filterLevel.includes('ENGENHARIA_02')}
                    onChange={(e) => handleLevelFilterChange('ENGENHARIA_02', e.target.checked)}
                  />
                  ENGENHARIA 02
                </FilterCheckboxItem>
              </FilterCheckboxGroup>
            </FilterGroup>
          </FilterModalBody>

          <FilterModalFooter>
            <FilterModalButton onClick={clearFilters}>
              Limpar filtro
            </FilterModalButton>
            <FilterModalButton variant="primary" onClick={applyFilters}>
              Aplicar filtro
            </FilterModalButton>
          </FilterModalFooter>
        </FilterModal>
      </Container>
    </ThemeProvider>
  );
};

export default UserList;