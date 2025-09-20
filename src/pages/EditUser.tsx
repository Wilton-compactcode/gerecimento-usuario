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
    frameBorder: '5px solid #ef4444',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    buttonBackground: '#3b82f6',
    buttonText: '#ffffff',
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
    buttonBackground: '#3b82f6',
    buttonText: '#ffffff',
  },
};

// Container
const Container = styled.div`
  background-color: ${({ theme }) => theme.background};
  min-height: 100vh;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  position: relative;
`;

// Header
const Header = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

// Toggle de tema
const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleLabel = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  font-weight: 500;
`;

const ToggleSwitch = styled.div<{ isOn: boolean }>`
  width: 50px;
  height: 26px;
  background-color: ${({ theme, isOn }) => isOn ? theme.buttonBackground : '#374151'};
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

// Modal Components
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
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 0;
  min-width: 600px;
  max-width: 700px;
  box-shadow: ${({ theme }) => theme.shadow};
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
    background-color: ${({ theme }) => theme.border};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
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
})<{ variant?: 'primary' | 'secondary' }>`
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

interface Level {
  id: string;
  descricao: string;
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

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <Container>
        <Header>
          <HeaderTitle>Editar Usuário</HeaderTitle>
          <HeaderButtons>
            <ThemeToggle>
              <ToggleLabel>Dark Mode</ToggleLabel>
              <ToggleSwitch isOn={themeMode === 'dark'} onClick={toggleTheme} />
            </ThemeToggle>
          </HeaderButtons>
        </Header>

        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Editar Usuário</ModalTitle>
              <CloseButton onClick={() => navigate('/users')}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <FormLabel>Nome *</FormLabel>
                <FormInput
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome completo"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Apelido</FormLabel>
                <FormInput
                  type="text"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  placeholder="Ex: Fazendeiro"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Nível *</FormLabel>
                <FormSelect
                  value={idUsuarioNivel}
                  onChange={(e) => setIdUsuarioNivel(e.target.value)}
                >
                  <option value="">Selecione o nível</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.descricao}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>

              <ModalActions>
                <ModalButton onClick={() => navigate('/users')}>
                  Cancelar
                </ModalButton>
                <ModalButton 
                  variant="primary" 
                  onClick={handleUpdate}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </ModalButton>
              </ModalActions>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Container>
    </ThemeProvider>
  );
};

export default EditUser;