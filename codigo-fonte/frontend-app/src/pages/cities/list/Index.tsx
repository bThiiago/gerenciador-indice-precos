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
import { CircleButton } from '../../../components/CircleButton';
import { api } from '../../../services/axios';
import { City } from '../../../types/models';
import { Search } from '../../../components/Search';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Card } from '../../../components/Card';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { GenericFrontError } from '../../../errors/GenericFrontError';
import { useLocation } from 'react-router-dom';

const Cities: React.FC = () => {
  const location = useLocation();

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleDelete = async (id: string) => {
    setLoading(true);
    await api
      .delete(`/cities/${id}`)
      .then(() => {
        setSelectedCityId(null);
        setShowDeleteAlert(false);
        setToastMessage('Cidade apagada com sucesso.');
        setShowToast(true);
        loadCities();
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
      .get(`/cities/${e.target.value}`)
      .then((response) => {
        setCities(response.data);
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
      setCities([]);
      loadCities();
      e.detail.complete();
    }, 1000);
  };

  const loadCities = () => {
    setLoading(true);
    api
      .get('/cities')
      .then((response) => {
        setCities(response.data);
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
    loadCities();
  }, []);

  useEffect(() => {
    if (location.pathname === '/cities') loadCities();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Cidades" />
        <Search
          placeholder="Procure uma cidade..."
          onIonInput={handleSearch}
          autoCapitalize="off"
          showClearButton="always"
        />

        {cities.length > 0
          ? cities.map((city) => (
              <Card
                key={city.id}
                style={{
                  margin: '5%',
                }}
              >
                <IonCardHeader>
                  <IonCardSubtitle
                    style={{
                      fontSize: '17px',
                      color: 'var(--ion-color-dark)',
                    }}
                  >
                    {city.name}
                  </IonCardSubtitle>
                  <IonCardSubtitle
                    style={{
                      fontSize: '17px',
                      color: 'var(--ion-color-dark)',
                    }}
                  >
                    {city.state}
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonButton fill="clear" routerDirection="forward" routerLink={`/cities/edit/${city.id}`}>
                  Editar
                </IonButton>

                <IonButton
                  fill="clear"
                  onClick={() => {
                    setSelectedCityId(city.id);
                    setShowDeleteAlert(true);
                  }}
                >
                  Deletar
                </IonButton>
              </Card>
            ))
          : loading && (
              <div style={{ textAlign: 'center' }}>
                <IonSpinner name="dots"></IonSpinner>
              </div>
            )}

        <div style={{ paddingBottom: '65px' }}></div>

        <CircleButton routerDirection="forward" routerLink="/cities/create" shape="round">
          +
        </CircleButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Cuidado!"
          subHeader="Tem certeza que deseja deletar esta cidade?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setSelectedCityId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedCityId !== null) {
                  handleDelete(selectedCityId);
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
          duration={5000}
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

export default Cities;
