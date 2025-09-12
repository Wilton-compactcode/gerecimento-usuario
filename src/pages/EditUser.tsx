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
  padding: 3rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  position: relative;
`;

// Toggle de tema (copiado do Login)
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

// Title
const Title = styled.h4`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1rem;
`;

// Styled Button
const StyledButton = styled.button<{ disabled?: boolean }>`
  background: ${({ theme, disabled }) => disabled ? 'grey' : theme.buttonBackground};
  color: ${({ theme }) => theme.buttonText};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  margin: 0.5rem;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

// Field Container
const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

// Styled Input
const StyledInput = styled.input<{ disabled: boolean }>`
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1rem;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const EditUser: React.FC<EditUserProps> = ({ setThemeMode, themeMode }) => {
  const { id } = useParams<{ id: string }>();
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [idUsuarioNivel, setIdUsuarioNivel] = useState('');
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [confirmaEmail, setConfirmaEmail] = useState('');
  const [locked, setLocked] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Listar?Id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = response.data[0];
        setNome(user.nome);
        setApelido(user.apelido || '');
        setIdUsuarioNivel(user.id_Usuario_Nivel);
        setEmail(user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar', [{
        id,
        nome,
        apelido,
        id_Usuario_Nivel: idUsuarioNivel,
      }], {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Bonus: Update email if changed
      if (novoEmail && novoEmail === confirmaEmail && senhaAtual) {
        await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar/Email', {
          id_Usuario: id,
          senha_Atual: senhaAtual,
          email_Atual: email,
          novo_Email: novoEmail,
          confirma_Email: confirmaEmail,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Bonus: Update senha if changed
      if (novaSenha && novaSenha === confirmaSenha && senhaAtual) {
        await axios.put('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Atualizar/Senha', {
          id_Usuario: id,
          senha_Atual: senhaAtual,
          nova_Senha: novaSenha,
          confirma_Senha: confirmaSenha,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <Container>
        <ThemeToggle>
          <ToggleLabel>Dark Mode</ToggleLabel>
          <ToggleSwitch isOn={themeMode === 'dark'} onClick={toggleTheme} />
        </ThemeToggle>
        <Title>Edição de Usuário</Title>
        <StyledButton onClick={() => setLocked(false)}>Liberar Edição</StyledButton>
        <FieldContainer>
          <FieldLabel>Nome</FieldLabel>
          <StyledInput type="text" value={nome} onChange={(e) => setNome(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Apelido</FieldLabel>
          <StyledInput type="text" value={apelido} onChange={(e) => setApelido(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Nível (ID)</FieldLabel>
          <StyledInput type="text" value={idUsuarioNivel} onChange={(e) => setIdUsuarioNivel(e.target.value)} disabled={locked} />
        </FieldContainer>
        {/* Bonus fields */}
        <FieldContainer>
          <FieldLabel>Senha Atual</FieldLabel>
          <StyledInput type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Novo Email</FieldLabel>
          <StyledInput type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Confirma Email</FieldLabel>
          <StyledInput type="email" value={confirmaEmail} onChange={(e) => setConfirmaEmail(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Nova Senha</FieldLabel>
          <StyledInput type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} disabled={locked} />
        </FieldContainer>
        <FieldContainer>
          <FieldLabel>Confirma Senha</FieldLabel>
          <StyledInput type="password" value={confirmaSenha} onChange={(e) => setConfirmaSenha(e.target.value)} disabled={locked} />
        </FieldContainer>
        <StyledButton onClick={handleUpdate} disabled={locked}>Salvar</StyledButton>
        <StyledButton onClick={() => navigate('/users')}>Cancelar</StyledButton>
      </Container>
    </ThemeProvider>
  );
};

export default EditUser;