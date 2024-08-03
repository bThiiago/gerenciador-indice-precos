import React, { useEffect, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { CircleButton } from '../../../components/CircleButton';
import { api } from '../../../services/axios';
import { Research } from '../../../types/models';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Card } from '../../../components/Card';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';

const Researches: React.FC = () => {
  const location = useLocation();

  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedResearchId, setSelectedResearchId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    await api
      .delete(`/researches/${id}`)
      .then(() => {
        setSelectedResearchId(null);
        setShowDeleteAlert(false);
        setToastMessage('Pesquisa apagada com sucesso.');
        setShowToast(true);
        setResearches(researches.filter((research) => research.id !== id));
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
      window.location.reload();
      e.detail.complete();
    }, 1000);
  };

  const loadResearches = () => {
    setLoading(true);
    api
      .get('/researches', { params: { page, perPage } })
      .then((response) => {
        if (response.data.length === 0) {
          setDisableInfiniteScroll(true);
        }
        if (page > 1) setResearches([...researches, ...response.data]);
        else setResearches(response.data);
        setPage(page + 1);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInfiniteScroll = (event: CustomEvent<void>) => {
    const target = event.target as HTMLIonInfiniteScrollElement;
    if (!target) {
      return;
    }
    if (disableInfiniteScroll) {
      target.complete();
      return;
    }
    loadResearches();
    target.complete();
  };

  useEffect(() => {
    loadResearches();
  }, []);

  useEffect(() => {
    setPage(1);
    if (location.pathname === '/researches') loadResearches();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Pesquisas" />

        {researches.length > 0
          ? researches.map((research) => (
              <Card key={research.id}>
                <IonCardHeader class="no-padding" style={{ paddingBottom: 0 }}>
                  <IonCardSubtitle style={{ fontSize: '17px', color: 'var(--ion-color-dark)' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ width: '60%' }}>{research.product.name}</div>
                    </div>
                  </IonCardSubtitle>
                  <IonCardSubtitle style={{ fontSize: '17px' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {research.market.name} - {research.market.city?.name}
                      </div>
                    </div>
                  </IonCardSubtitle>
                  <IonCardSubtitle style={{ fontSize: '17px' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>R${research.price.toFixed(2).replace('.', ',')}</div>
                      <div>{format(new Date(research.created_at), 'dd/MM/yyyy')}</div>
                    </div>
                  </IonCardSubtitle>
                </IonCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IonButton fill="clear" routerDirection="forward" routerLink={`/researches/edit/${research.id}`}>
                    Editar
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setSelectedResearchId(research.id);
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

        <IonInfiniteScroll threshold="100px" onIonInfinite={handleInfiniteScroll} disabled={disableInfiniteScroll}>
          <IonInfiniteScrollContent>
            {loading && (
              <div style={{ textAlign: 'center' }}>
                <IonSpinner name="bubbles"></IonSpinner>
                <h5>Carregando...</h5>
              </div>
            )}
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <CircleButton routerDirection="forward" routerLink="/researches/create" shape="round">
          +
        </CircleButton>

        <CircleButton
          routerDirection="forward"
          routerLink="/researches/listToday"
          shape="round"
          style={{ bottom: '75px', fontSize: '12px' }}
        >
          Baixar
        </CircleButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Cuidado!"
          subHeader="Tem certeza que deseja apagar está pesquisa?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setSelectedResearchId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedResearchId !== null) {
                  handleDelete(selectedResearchId);
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

export default Researches;
