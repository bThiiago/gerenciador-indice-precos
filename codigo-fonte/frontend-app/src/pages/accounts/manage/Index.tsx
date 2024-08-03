import React, { useEffect, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import CustomHeader from '../../../components/CustomHeader';
import { User } from '../../../types/models';
import { Card } from '../../../components/Card';
import { api } from '../../../services/axios';
import { GenericFrontError } from '../../../errors/GenericFrontError';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { Search } from '../../../components/Search';
import { CircleButton } from '../../../components/CircleButton';
import { useAuth } from '../../../hooks/auth';
import { useLocation } from 'react-router-dom';

const ManageAccount: React.FC = () => {
  const location = useLocation();

  const { user } = useAuth();

  const levelToString = (level: number): string => {
    switch (level) {
      case 1:
        return 'Membro da equipe';
      case 9:
        return 'Administrador';
      default:
        return '';
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleDelete = async (id: string) => {
    setLoading(true);
    await api
      .delete(`/users/${id}`)
      .then(() => {
        setSelectedUserId(null);
        setShowDeleteAlert(false);
        setToastMessage('Usuário apagado com sucesso.');
        setShowToast(true);
        loadUsers();
      })
      .catch((error) => {
        if (error instanceof GenericFrontError) {
          setMessage(error.message);
          setIserror(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e: any) => {
    setLoading(true);
    api
      .get(`/users/${e.target.value}`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRefresh = (e: any) => {
    setTimeout(() => {
      setUsers([]);
      loadUsers();
      e.detail.complete();
    }, 1000);
  };

  const loadUsers = () => {
    setLoading(true);
    api
      .get('/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (location.pathname === '/categories') loadUsers();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Gerenciar contas" href="/account" />
        <Search
          placeholder="Procure uma conta..."
          onIonInput={handleSearch}
          autocapitalize="off"
          showClearButton="always"
        />
        {users.length > 0
          ? users.map((teamUser) => (
              <Card key={teamUser.id} style={{ margin: '5%' }}>
                <IonCardHeader>
                  <IonCardSubtitle style={{ fontSize: '17px', color: 'var(--ion-color-dark)' }}>
                    {teamUser.name}
                  </IonCardSubtitle>
                  <IonCardSubtitle style={{ fontSize: '17px' }}>{levelToString(teamUser.level)}</IonCardSubtitle>
                </IonCardHeader>

                <IonButton fill="clear" routerDirection="forward" routerLink={`/account/manage/edit/${teamUser.id}`}>
                  Editar
                </IonButton>

                <IonButton
                  fill="clear"
                  disabled={teamUser.level === 9}
                  onClick={() => {
                    setSelectedUserId(teamUser.id);
                    setShowDeleteAlert(true);
                  }}
                >
                  Apagar
                </IonButton>
              </Card>
            ))
          : loading && (
              <div style={{ textAlign: 'center' }}>
                <IonSpinner name="dots"></IonSpinner>
              </div>
            )}

        <div style={{ paddingBottom: '65px' }}></div>

        <CircleButton routerDirection="forward" routerLink="/account/manage/create" shape="round">
          +
        </CircleButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Cuidado!"
          subHeader="Tem certeza que deseja apagar está categoria?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setSelectedUserId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedUserId !== null) {
                  handleDelete(selectedUserId);
                }
              },
            },
          ]}
        ></IonAlert>

        <IonAlert
          isOpen={iserror}
          onDidDismiss={() => setIserror(false)}
          cssClass="my-custom-class"
          header={'Oops!'}
          message={message}
          buttons={['Fechar']}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          color="success"
          style={{
            textAlign: 'center',
            '--border-radius': '30px',
          }}
          position="top"
          icon={checkmarkDoneCircleOutline}
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageAccount;
