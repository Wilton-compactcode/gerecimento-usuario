import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { ThemeProvider } from 'styled-components';

interface EditUserProps {
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
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    modalBackground: '#ffffff',
    modalShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
    rowHover: '#f8fafc',
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
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    modalBackground: '#232a36',
    modalShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    rowHover: '#2a3441',
  },
};

// Container principal
const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// Toggle de tema
const ThemeToggle = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  font-weight: 500;
`;

const ToggleSwitch = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOn'
})<{ isOn: boolean }>`
  width: 50px;
  height: 26px;
  background-color: ${({ theme, isOn }) => isOn ? '#3b82f6' : '#374151'};
  border-radius: 13px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ isOn }) => isOn ? '26px' : '2px'};
    width: 22px;
    height: 22px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// Componentes do Modal
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
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;

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

const UnlockButton = styled.button`
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #6b7280;
    cursor: not-allowed;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

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
    background-color: ${({ theme }) => theme.border};
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
    background-color: ${({ theme }) => theme.border};
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
          &:disabled {
            background-color: #f87171;
            cursor: not-allowed;
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

// Componentes específicos para o modal de exclusão
const DeleteModalContent = styled.div`
  background-color: ${({ theme }) => theme.modalBackground};
  border-radius: 16px;
  padding: 0;
  min-width: 450px;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.modalShadow};
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: hidden;
  border: 2px solid #fecaca;
`;

const DeleteModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #fecaca;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
`;

const DeleteModalTitle = styled.h2`
  color: #dc2626;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteModalBody = styled.div`
  padding: 24px;
  text-align: center;
`;

const WarningIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px auto;
  border: 3px solid #f59e0b;
`;

const DeleteMessage = styled.div`
  margin-bottom: 24px;
`;

const UserName = styled.strong`
  color: #dc2626;
  font-weight: 600;
`;

const WarningText = styled.p`
  margin: 16px 0 0 0;
  font-size: 14px;
  color: #f59e0b;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const DeleteModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

interface Level {
  id: string;
  descricao: string;
  nome?: string;
}

interface User {
  id: string;
  nome: string;
  apelido: string | null;
  id_Usuario_Nivel: string;
  email: string;
  desativadoSN: boolean;
  id_Importacao: number;
  id_Pessoa: string;
  menu_Principal_PersonalizadoSN: boolean;
}

const EditUser: React.FC<EditUserProps> = ({ setThemeMode, themeMode }) => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [idUsuarioNivel, setIdUsuarioNivel] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [editFormLocked, setEditFormLocked] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Listar?Id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user: User = response.data[0];
        setNome(user.nome);
        setApelido(user.apelido || '');
        setIdUsuarioNivel(user.id_Usuario_Nivel);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchLevels = async () => {
      try {
        const response = await axios.get('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario_Nivel/Listar', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Níveis disponíveis:', response.data);
        setLevels(response.data || []);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchUser();
    fetchLevels();
  }, [id]);

  const handleUpdate = async () => {
    // Validações conforme documentação
    if (!nome.trim()) {
      alert('Campo Nome é obrigatório!');
      return;
    }
    if (!idUsuarioNivel || idUsuarioNivel.trim() === '') {
      alert('Campo Nível é obrigatório!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      // Prepare payload exatamente como a chamada que funciona
      const updatePayload = [{
        id: id,
        nome: nome.trim(),
        id_Usuario_Nivel: idUsuarioNivel,
        desativadoSN: false,
        ...(apelido && apelido.trim() !== '' ? { apelido: apelido.trim() } : {})
      }];

      console.log('📦 Payload sendo enviado:', updatePayload);

      await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar', 
        updatePayload, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Usuário atualizado com sucesso!');
      navigate('/users');
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        alert(`Erro ao atualizar usuário: ${error.response.data?.message || 'Erro desconhecido'}`);
      } else {
        alert('Erro ao atualizar usuário. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleMenuToggle = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === menuId ? null : menuId);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      navigate('/');
      return;
    }

    setLoading(true);

    try {
      await axios.delete(`https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Excluir?Id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Usuário excluído com sucesso!');
      navigate('/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response Data:', error.response.data);
        alert(`Erro ao excluir usuário: ${error.response.data?.message || 'Erro desconhecido'}`);
      } else {
        alert('Erro ao excluir usuário. Tente novamente.');
      }
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <Container>
        <ThemeToggle>
          <ToggleLabel>Dark Mode</ToggleLabel>
          <ToggleSwitch isOn={themeMode === 'dark'} onClick={toggleTheme} />
        </ThemeToggle>

        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Editar Usuário</ModalTitle>
              <HeaderActions>
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
                      <MenuItem onClick={(e) => handleDeleteClick(e)}>
                        Excluir
                      </MenuItem>
                    </MenuDropdown>
                  )}
                </MenuContainer>
                <CloseButton onClick={() => navigate('/users')}>×</CloseButton>
              </HeaderActions>
            </ModalHeader>

            <ModalBody>
              <ModalSidebar>
                <ProfileImageContainer title="Clique para alterar foto">
                  <ProfileImagePlaceholder>
                    {getInitials(nome)}
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
                <ProfileName>{nome || 'Nome não disponível'}</ProfileName>
                <ProfileRole>
                  {idUsuarioNivel ? idUsuarioNivel.replace('_', ' ') : 'Nível não definido'}
                </ProfileRole>
              </ModalSidebar>

              <ModalMainContent>
                <FormTitle>Dados do usuário</FormTitle>

                <FormGrid>
                  <FormGroup>
                    <FormLabel>Nome</FormLabel>
                    <FormInput
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      disabled={editFormLocked}
                      placeholder="Digite o nome completo"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Apelido</FormLabel>
                    <FormInput
                      type="text"
                      value={apelido}
                      onChange={(e) => setApelido(e.target.value)}
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
                      disabled={true}
                      placeholder="email@exemplo.com"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Nível da conta</FormLabel>
                    <FormSelect
                      value={idUsuarioNivel}
                      onChange={(e) => setIdUsuarioNivel(e.target.value)}
                      disabled={editFormLocked}
                    >
                      <option value="">Selecione o nível</option>
                      {levels.length > 0 ? (
                        levels.map((level) => (
                          <option key={level.id || level.descricao} value={level.id || level.descricao}>
                            {level.descricao || (level as any).nome || level.id}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Carregando níveis...</option>
                      )}
                    </FormSelect>
                  </FormGroup>
                </FormGrid>

                <ModalActions>
                  <ModalButton onClick={() => navigate('/users')}>
                    Cancelar
                  </ModalButton>
                  <ModalButton 
                    variant="primary" 
                    onClick={handleUpdate}
                    disabled={loading || editFormLocked}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </ModalButton>
                </ModalActions>
              </ModalMainContent>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>

        {/* Modal de Confirmação de Exclusão */}
        {deleteModalOpen && (
          <ModalOverlay onClick={() => setDeleteModalOpen(false)}>
            <DeleteModalContent onClick={(e) => e.stopPropagation()}>
              <DeleteModalHeader>
                <DeleteModalTitle>
                  🗑️ Confirmar Exclusão
                </DeleteModalTitle>
                <CloseButton onClick={() => setDeleteModalOpen(false)}>×</CloseButton>
              </DeleteModalHeader>

              <DeleteModalBody>
                <WarningIcon>
                  ⚠️
                </WarningIcon>
                
                <DeleteMessage>
                  <p style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151', lineHeight: '1.5' }}>
                    Tem certeza que deseja excluir o usuário
                  </p>
                  <UserName>{nome}</UserName>
                  <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: '#374151' }}>
                    ?
                  </p>
                </DeleteMessage>

                <WarningText>
                  🚫 Esta ação não pode ser desfeita
                </WarningText>

                <DeleteModalActions>
                  <ModalButton onClick={() => setDeleteModalOpen(false)}>
                    Cancelar
                  </ModalButton>
                  <ModalButton 
                    variant="danger" 
                    onClick={handleDeleteConfirm}
                    disabled={loading}
                  >
                    {loading ? 'Excluindo...' : '🗑️ Excluir'}
                  </ModalButton>
                </DeleteModalActions>
              </DeleteModalBody>
            </DeleteModalContent>
          </ModalOverlay>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default EditUser;