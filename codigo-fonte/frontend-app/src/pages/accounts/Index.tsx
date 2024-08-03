import React, { useState } from 'react';
import { IonContent, IonPage, ToggleCustomEvent } from '@ionic/react';
import { useAuth } from '../../hooks/auth';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import CustomHeader from '../../components/CustomHeader';
import { Toggle } from '../../components/Toggle';
import { api } from '../../services/axios';
import { saveAs } from 'file-saver';
import { Browser } from '@capacitor/browser';

const baseURL = process.env.REACT_APP_API_URL;

const Account: React.FC = () => {
  const { user, signOut } = useAuth();

  const levelToString = (level: any): string => {
    switch (level) {
      case 1:
        return 'Membro da equipe';
      case 9:
        return 'Administrador';
      default:
        return '';
    }
  };

  const handleCreateBackup = async () => {
    await Browser.open({ url: `${baseURL}/backup` });
  };

  const [themeToggle, setThemeToggle] = useState<boolean>(localStorage.getItem('@ipjr:darkMode') === 'true' ?? false);

  const toggleChange = (ev: ToggleCustomEvent) => {
    const newDarkMode = !themeToggle;
    setThemeToggle(newDarkMode);

    localStorage.setItem('@ipjr:darkMode', newDarkMode.toString());
    toggleDarkTheme(ev.detail.checked);
  };

  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Conta" />

        <Toggle checked={themeToggle} onIonChange={toggleChange}>
          Tema escuro
        </Toggle>

        <Input
          autocapitalize="sentences"
          type="text"
          label="Usuário"
          labelPlacement="floating"
          fill="outline"
          value={user?.name.toUpperCase()}
          readonly
        ></Input>

        <Input
          type="text"
          label="Nível"
          labelPlacement="floating"
          fill="outline"
          value={levelToString(user?.level)}
          readonly
        ></Input>
        {user?.level === 9 ? (
          <>
            <Button style={{ width: '40%', left: '0' }} routerDirection="forward" routerLink="/account/manage">
              Gerenciar
            </Button>
            <Button style={{ width: '40%', right: '0' }} routerDirection="back" onClick={signOut}>
              Sair
            </Button>
            <Button style={{ width: '88.5%', left: '0' }} onClick={handleCreateBackup}>
              Baixar backup
            </Button>
          </>
        ) : (
          <Button routerDirection="back" onClick={signOut}>
            Sair
          </Button>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Account;
