import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonPage, IonRow } from '@ionic/react';
import React, { useRef, useState } from 'react';
import { useAuth } from '../../hooks/auth';
import { IonAlert } from '@ionic/react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import './Index.css';
import { api } from '../../services/axios';
import { eye, eyeOffOutline, eyeOutline, lockClosed } from 'ionicons/icons';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const userRef = useRef(null);

  const handleLogin = async () => {
    if (!name) {
      setMessage('Usuário não informado! Insira um usuário para continuidade!');
      setIserror(true);
      return;
    }

    if (!password) {
      setMessage('Senha não informada! Insira uma senha para continuidade!');
      setIserror(true);
      return;
    }

    const loginData = {
      name: name,
      password: password,
    };

    try {
      await signIn({ name: loginData.name, password: loginData.password });
    } catch (err: any) {
      if (err.status === 400) {
        setMessage('Usuário ou senha incorretos.');
        setIserror(true);
        return;
      } else {
        setMessage(err.message);
        setIserror(true);
        return;
      }
    }
  };

  const handleKeyDownUser = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && userRef?.current) {
      (userRef.current as HTMLIonInputElement).setFocus();
    }
  };

  const handleKeyDownPassword = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="container">
          <IonGrid>
            <IonRow>
              <IonCol style={{ display: 'flex', justifyContent: 'center' }}>
                <IonImg src="./logo.png" alt="Logo índice de preços joia ribeirinha" style={{ width: '200px' }} />
              </IonCol>
            </IonRow>
          </IonGrid>

          <Input
            type="text"
            label="Usuário"
            labelPlacement="floating"
            fill="outline"
            placeholder="Digite seu usuário"
            style={{ textAlign: 'left' }}
            value={name}
            onIonInput={(e) => setName(e.detail.value!)}
            onKeyDown={handleKeyDownUser}
          ></Input>

          <div className="password-input-container">
            <Input
              ref={userRef}
              type={showPassword ? 'text' : 'password'}
              label="Senha"
              labelPlacement="floating"
              fill="outline"
              placeholder="Digite sua senha"
              style={{ textAlign: 'left' }}
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
              onKeyDown={handleKeyDownPassword}
            ></Input>
            <IonButton fill="clear" className="toggle-password-button" onClick={() => setShowPassword(!showPassword)}>
              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
            </IonButton>
          </div>
        </div>

        <Button routerDirection="forward" onClick={handleLogin} style={{ position: 'fixed' }}>
          Login
        </Button>

        <IonAlert
          isOpen={iserror}
          onDidDismiss={() => setIserror(false)}
          cssClass="my-custom-class"
          header={'Oops!'}
          message={message}
          buttons={['Fechar']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
