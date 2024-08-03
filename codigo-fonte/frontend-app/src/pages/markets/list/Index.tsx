import React, { useEffect, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { CircleButton } from '../../../components/CircleButton';
import { api } from '../../../services/axios';
import { Market } from '../../../types/models';
import { Search } from '../../../components/Search';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Card } from '../../../components/Card';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { GenericFrontError } from '../../../errors/GenericFrontError';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../../hooks/auth';

const Markets: React.FC = () => {
  const location = useLocation();

  const { user } = useAuth();

  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleDelete = async (id: string) => {
    await api
      .delete(`/markets/${id}`)
      .then(() => {
        setSelectedMarketId(null);
        setShowDeleteAlert(false);
        setToastMessage('Mercado apagado com sucesso.');
        setShowToast(true);
        if (searchTerm !== '') {
          handleSearch({ target: { value: searchTerm } });
          return;
        }
        setMarkets(markets.filter((market) => market.id !== id));
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
      .get(`/markets/${e.target.value}`)
      .then((response) => {
        setMarkets(response.data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMarkets = () => {
    setLoading(true);
    api
      .get('/markets')
      .then((response) => {
        setMarkets(response.data);
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
      setMarkets([]);
      loadMarkets();
      e.detail.complete();
    }, 1000);
  };

  useEffect(() => {
    if (location.pathname === '/markets') loadMarkets();
  }, []);

  useEffect(() => {
    loadMarkets();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Mercados" />
        <Search
          placeholder="Procure um mercado..."
          onIonInput={handleSearch}
          autocapitalize="off"
          showClearButton="always"
        />
        {markets.length > 0
          ? markets.map((market) => (
              <Card
                key={market.id}
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
                    {market.name}
                  </IonCardSubtitle>
                  <IonCardSubtitle
                    style={{
                      fontSize: '17px',
                    }}
                  >
                    {market.city?.name}/{market.city?.state}
                  </IonCardSubtitle>
                </IonCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IonButton fill="clear" routerDirection="forward" routerLink={`/markets/edit/${market.id}`}>
                    Editar
                  </IonButton>

                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setSelectedMarketId(market.id);
                      setShowDeleteAlert(true);
                    }}
                  >
                    Apagar
                  </IonButton>
                </div>
              </Card>
            ))
          : loading && (
              <div style={{ textAlign: 'center' }}>
                <IonSpinner name="dots"></IonSpinner>
              </div>
            )}

        <div style={{ paddingBottom: '65px' }}></div>

        <CircleButton routerDirection="forward" routerLink="/markets/create" shape="round">
          +
        </CircleButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Cuidado!"
          subHeader="Tem certeza que deseja apagar este mercado?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setSelectedMarketId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedMarketId !== null) {
                  handleDelete(selectedMarketId);
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

export default Markets;
