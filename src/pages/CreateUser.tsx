import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";

interface CreateUserProps {
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
  background-color: ${({ theme }) => theme.inputBackground};
  border: 2px dashed ${({ theme }) => theme.inputBorder};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    background-color: ${({ theme }) => theme.border};
  }
`;

const AddPhotoIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.secondaryText};
  margin-bottom: 8px;
`;

const AddPhotoText = styled.span`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 12px;
  font-weight: 500;
  text-align: center;
`;

const PhotoTitle = styled.h3`
  color: ${({ theme }) => theme.text};
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const PhotoHelp = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
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

  option {
    background-color: ${({ theme }) => theme.cardBackground};
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ theme }) => theme.secondaryText};
  cursor: pointer;
  font-size: 16px;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.secondaryText};
  font-size: 12px;
  margin: 4px 0 0 0;
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

const CreateUser: React.FC<CreateUserProps> = ({ setThemeMode, themeMode }) => {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [idUsuarioNivel, setIdUsuarioNivel] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [pessoaVinculada, setPessoaVinculada] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [levels, setLevels] = useState<Array<{id: string; descricao: string; nome?: string}>>([]);
  const navigate = useNavigate();

  // Buscar níveis disponíveis
  useEffect(() => {
    const fetchLevels = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

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

    fetchLevels();
  }, []);

  const handleCreate = async () => {
    // Validações dos campos obrigatórios conforme especificação
    if (!nome || nome.trim() === '') {
      alert('Campo Nome é obrigatório!');
      return;
    }

    if (!email || email.trim() === '') {
      alert('Campo E-mail é obrigatório!');
      return;
    }

    if (!idUsuarioNivel || idUsuarioNivel.trim() === '') {
      alert('Campo Nível é obrigatório!');
      return;
    }

    if (!senha || senha.trim() === '') {
      alert('Campo Senha é obrigatório!');
      return;
    }

    // Validações adicionais
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido!');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Token de autenticação não encontrado. Faça login novamente.');
      navigate('/');
      return;
    }

    console.log('✅ Validações passaram');

    // Verificar estado ANTES da criação
    console.log('📊 VERIFICANDO ESTADO ANTES DA CRIAÇÃO...');
    try {
      const responseBefore = await axios.get('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Listar', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📈 Usuários ANTES da criação:', responseBefore.data?.length || 0);
      const emailsBefore = responseBefore.data?.map((u: any) => u.email) || [];
      console.log('📧 Emails ANTES:', emailsBefore);
    } catch (error: any) {
      console.error('❌ Erro ao verificar estado antes:', error.response?.data);
    }

    // Payload como array de usuários conforme API v2 espera (ICollection)
    const payload = [{
      nome: nome.trim(),
      email: email.trim(),
      id_Usuario_Nivel: idUsuarioNivel,
      senha: senha,
      ...(apelido && apelido.trim() !== '' ? { apelido: apelido.trim() } : {})
    }];

    console.log('📦 Payload preparado:', payload);

    console.log('=== DEBUG CRIAÇÃO DE USUÁRIO ===');
    console.log('Payload como array de usuários:', payload);
    console.log('Estrutura do payload:', JSON.stringify(payload, null, 2));
    console.log('Token:', token);

    // Verificar estrutura do usuário
    if (Array.isArray(payload) && payload.length > 0) {
      const user = payload[0];
      console.log('Primeiro usuário do payload:', {
        nome: user.nome,
        email: user.email,
        id_Usuario_Nivel: user.id_Usuario_Nivel,
        senha: user.senha ? '[PRESENTE]' : '[AUSENTE]'
      });
    }

    // Decodificar o token para verificar o contexto
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('Contexto do token - idSistema:', tokenPayload.idSistema);
      console.log('Contexto do token - idCliente:', tokenPayload.idCliente);
      console.log('Contexto do token - connection_Key:', tokenPayload.connection_Key);
      console.log('Token expira em:', new Date(tokenPayload.exp * 1000).toLocaleString());
    } catch (e) {
      console.log('Não foi possível decodificar o token para debug');
    }

    console.log('=== FIM DEBUG CRIAÇÃO ===');

    try {
      const response = await axios.post(
        'https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/criar',
        payload,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      console.log('=== RESPOSTA DA API ===');
      console.log('Status HTTP:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers da resposta:', response.headers);
      console.log('Dados da resposta:', response.data);
      console.log('Tipo de resposta:', typeof response.data);

      // Verificar se é um erro disfarçado de sucesso
      if (response.data && typeof response.data === 'object') {
        if (response.data.status_Code || response.data.internal_Code) {
          console.log('⚠️  POSSÍVEL ERRO DISFARÇADO:');
          console.log('  - status_Code:', response.data.status_Code);
          console.log('  - internal_Code:', response.data.internal_Code);
          console.log('  - message:', response.data.message);
          console.log('  - type:', response.data.type);
          console.log('  - details:', response.data.details);
        }
      }

      console.log('=== FIM RESPOSTA DA API ===');
      
      // Verificar se o usuário foi realmente criado
      if (response.status === 200 || response.status === 201) {
        console.log('✅ Status HTTP OK, verificando se usuário foi criado...');

        // Verificar estado APÓS da criação
        console.log('📊 VERIFICANDO ESTADO APÓS DA CRIAÇÃO...');
        try {
          const responseAfter = await axios.get('https://gerentemax-dev2.azurewebsites.net/api/v2/Account/Usuario/Listar', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('📈 Usuários APÓS da criação:', responseAfter.data?.length || 0);
          const emailsAfter = responseAfter.data?.map((u: any) => u.email) || [];
          console.log('📧 Emails APÓS:', emailsAfter);

          // Verificar se o email foi adicionado
          const userCreated = emailsAfter.includes(email.trim());
          console.log('🎯 Usuário criado encontrado na lista:', userCreated);

          if (userCreated) {
            alert('✅ Usuário criado com sucesso e confirmado na lista!');
          } else {
            alert('⚠️ API retornou sucesso, mas usuário não foi encontrado na lista. Verifique os logs.');
          }
        } catch (error: any) {
          console.error('❌ Erro ao verificar estado após:', error.response?.data);
          alert('Usuário pode ter sido criado, mas houve erro na verificação.');
        }

        // Navegar e forçar refresh da listagem
        navigate('/users', { state: { refresh: true } });
      } else {
        console.warn('❌ Status HTTP inesperado:', response.status);
        alert('Usuário NÃO foi criado. Status HTTP: ' + response.status);
        navigate('/users', { state: { refresh: true } });
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      
      let errorMessage = 'Erro ao criar usuário. Tente novamente.';
      
      if (error.response) {
        // Primeiro verificar se é erro específico da API v2 (formato {message, status_Code})
        if (error.response.data?.message && error.response.data?.status_Code) {
          console.error('Erro da API v2:', error.response.data.message);
          errorMessage = error.response.data.message;
          
          // Tratar códigos específicos
          if (error.response.data.internal_Code === 207) {
            errorMessage = `❌ E-mail já cadastrado: ${error.response.data.details || error.response.data.message}\n\n💡 SOLUÇÃO: Use um email completamente novo que nunca foi usado antes.\n💡 Exemplo: teste${Date.now()}@email.com\n\n⚠️ Vá para a página de listagem e clique no botão "🔍 DEBUG" para verificar se o usuário aparece na busca sem filtros.`;
          } else if (error.response.data.internal_Code === 214) {
            errorMessage = `❌ Usuário já existe: ${error.response.data.details || error.response.data.message}\n\n💡 SOLUÇÃO: Use um email completamente diferente que não exista em nenhum sistema.`;
          }
        }
        // Capturar erros de validação específicos (formato antigo)
        else if (error.response.status === 400 && error.response.data?.errors) {
          console.error('Erros de validação:', error.response.data.errors);
          console.error('Detalhes completos dos erros:', JSON.stringify(error.response.data.errors, null, 2));
          
          // Construir mensagem com todos os erros
          const validationErrors = error.response.data.errors;
          const errorMessages = [];
          
          for (const field in validationErrors) {
            const fieldErrors = validationErrors[field];
            console.log(`Campo ${field}:`, fieldErrors);
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(`${field}: ${fieldErrors.join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${fieldErrors}`);
            }
          }
          
          if (errorMessages.length > 0) {
            errorMessage = `Erros de validação:\n${errorMessages.join('\n')}`;
          } else {
            errorMessage = `Erro de validação: ${error.response.data.title || 'Dados inválidos'}`;
          }
        } else {
          // Outros erros de resposta da API
          switch (error.response.status) {
            case 400:
              errorMessage = 'Dados inválidos. Verifique os campos preenchidos.';
              break;
            case 401:
              errorMessage = 'Token expirado. Faça login novamente.';
              navigate('/');
              break;
            case 403:
              errorMessage = 'Sem permissão para criar usuários.';
              break;
            case 409:
              errorMessage = 'Email já está em uso por outro usuário.';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor.';
              break;
            default:
              if (error.response.data?.message) {
                errorMessage = error.response.data.message;
              }
          }
        }
      } else if (error.request) {
        // Erro de rede
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      alert(errorMessage);
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

        <ModalContent>
          <ModalHeader>
            <ModalTitle>Perfil</ModalTitle>
          </ModalHeader>
          
          <ModalBody>
            <ModalSidebar>
              <ProfileImageContainer>
                <AddPhotoIcon>📷</AddPhotoIcon>
                <AddPhotoText>Adicionar foto</AddPhotoText>
              </ProfileImageContainer>
              <PhotoTitle>Foto de perfil</PhotoTitle>
              <PhotoHelp>JPG ou PNG. Tamanho máximo de 5MB</PhotoHelp>
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
                    placeholder="Nome do usuário"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Apelido (opcional)</FormLabel>
                  <FormInput
                  type="text"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  placeholder="Ex: Fazendeiro"
                />
                </FormGroup>
              </FormGrid>

              <FormGrid>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Nível da conta</FormLabel>
                  <FormSelect
                  value={idUsuarioNivel}
                  onChange={(e) => setIdUsuarioNivel(e.target.value)}
                >
                    <option value="">Selecione o nível da conta</option>
                    {levels.map((level) => (
                      <option key={level.id || level.descricao} value={level.id || level.descricao}>
                        {level.descricao || level.nome || level.id}
                      </option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </FormGrid>

              <FormGrid>
                <FormGroup>
                  <FormLabel>Senha</FormLabel>
                  <PasswordContainer>
                    <FormInput
                      type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                      placeholder="Digite uma senha"
                    />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </PasswordToggle>
                  </PasswordContainer>
                <HelpText>A senha deve ter pelo menos 6 caracteres.</HelpText>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Confirmação de senha</FormLabel>
                  <PasswordContainer>
                    <FormInput
                      type={showConfirmPassword ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme a senha"
                />
                    <PasswordToggle
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </PasswordToggle>
                  </PasswordContainer>
                <HelpText>Insira a mesma senha do campo anterior.</HelpText>
                </FormGroup>
              </FormGrid>

              <FormGroup>
                <FormLabel>Pessoa vinculada</FormLabel>
                <FormSelect
                  value={pessoaVinculada}
                  onChange={(e) => setPessoaVinculada(e.target.value)}
                >
                  <option value="">Busque pelo nome da pessoa</option>
                  <option value="pessoa1">Pessoa 1</option>
                  <option value="pessoa2">Pessoa 2</option>
                </FormSelect>
              </FormGroup>

              <ModalActions>
                <ModalButton onClick={() => navigate("/users")}>
                Cancelar
                </ModalButton>
                <ModalButton variant="primary" onClick={handleCreate}>
                Salvar
                </ModalButton>
              </ModalActions>
            </ModalMainContent>
          </ModalBody>
        </ModalContent>
      </Container>
    </ThemeProvider>
  );
};

export default CreateUser;