import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { ThemeProvider, keyframes } from 'styled-components';

interface LoginProps {
  setThemeMode: (mode: 'light' | 'dark') => void;
  themeMode: 'light' | 'dark';
}

// Define the theme object
const theme = {
  light: {
    background: '#ffffff',
    gradientStart: '#e0e7ff',
    gradientEnd: '#c7d2fe',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    text: '#1f2937',
    secondaryText: '#4b5563',
    border: 'rgba(0, 0, 0, 0.1)',
    primary: '#3b82f6',
    accent: '#f59e0b',
    shadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
    placeholder: '#9ca3af',
  },
  dark: {
    background: '#1a1f2e',
    gradientStart: '#1a202c',
    gradientEnd: '#2b3d56',
    cardBackground: 'rgba(26, 31, 46, 0.9)',
    text: '#f9fafb',
    secondaryText: '#a0a4ab',
    border: 'rgba(255, 255, 255, 0.2)',
    primary: '#3b82f6',
    accent: '#4ade80',
    shadow: '0 25px 45px rgba(0, 0, 0, 0.3)',
    placeholder: '#d1d5db',
  },
};

// Animações
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Container principal com fundo gradiente animado
const LoginContainer = styled.div<{ themeMode: 'light' | 'dark' }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, ${({ theme }) => theme.gradientStart}, ${({ theme }) => theme.gradientEnd}, ${({ theme }) => theme.background}, ${({ theme }) => theme.gradientEnd});
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: ${gradient} 20s ease infinite;
  }
`;

// Toggle de tema no canto superior direito
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
  background-color: ${({ theme, isOn }) => isOn ? theme.primary : '#374151'};
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

// Card principal do login com efeito glassmorphism
const LoginCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 1;
`;

// Seção da marca/logo
const Brand = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.text};
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 16px;
  margin: 0;
  font-weight: 400;
`;

// Formulário
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border};
  }
`;

const StyledSelect = styled.select`
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    background: rgba(255, 255, 255, 0.15);
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.border};
  }

  option {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const Button = styled.button<{ isLoading?: boolean }>`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: ${({ isLoading }) => (isLoading ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: ${({ isLoading }) => (isLoading ? 0.7 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;



const Footer = styled.div`
  margin-top: 32px;
  text-align: center;
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 14px;
  margin: 0;
`;

const Login: React.FC<LoginProps> = ({ setThemeMode, themeMode }) => {
  const [email, setEmail] = useState('usuario@email.com');
  const [password, setPassword] = useState('senha@123');
  const [systems, setSystems] = useState<any[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleGetSystems = async () => {
    try {
      const response = await axios.post('https://gerentemax-dev2.azurewebsites.net/api/v2/Auth/Sistema', {
        email,
        senha: password,
      });
      setSystems(response.data);
      setStep(2);
    } catch (error) {
      console.error('Error getting systems:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://gerentemax-dev2.azurewebsites.net/api/v2/Auth/Login', {
        email,
        senha: password,
        id_Sistema: selectedSystem,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/users');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme[themeMode]}>
      <LoginContainer themeMode={themeMode}>
        <ThemeToggle>
          <ToggleLabel>Dark Mode</ToggleLabel>
          <ToggleSwitch isOn={themeMode === 'dark'} onClick={toggleTheme} />
        </ThemeToggle>

        <LoginCard>
          <Brand>
            <Logo>GM</Logo>
            <Title>GerenteMax</Title>
            <Subtitle>Sistema de Gerenciamento</Subtitle>            
          </Brand>

          {step === 1 ? (
            <Form onSubmit={(e) => { e.preventDefault(); handleGetSystems(); }}>
              <InputGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>

              <Button type="submit">Obter Sistemas</Button>
            </Form>
          ) : (
            <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <InputGroup>
                <Label htmlFor="system">Selecione o Sistema</Label>
                <StyledSelect
                  id="system"
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                >
                  <option value="">Selecione Sistema</option>
                  {systems.map((sys) => (
                    <option key={sys.id} value={sys.id}>{sys.desc_Sistema}</option>
                  ))}
                </StyledSelect>
              </InputGroup>

              <Button type="submit">Login</Button>

              <Button 
                type="button" 
                onClick={() => setStep(1)}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  marginTop: '8px'
                }}
              >
                Voltar
              </Button>
            </Form>
          )}

          <Footer>
            <FooterText>
              {step === 1 
                ? 'Digite suas credenciais para acessar o sistema' 
                : 'Selecione o sistema que deseja acessar'
              }
            </FooterText>
          </Footer>
        </LoginCard>
      </LoginContainer>
    </ThemeProvider>
  );
};

export default Login;