import React, { useEffect, useState } from 'react';
import { IonAlert, IonCardHeader, IonCardSubtitle, IonContent, IonPage, IonSpinner, IonToast } from '@ionic/react';
import { api } from '../../../services/axios';
import { Research } from '../../../types/models';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { format, set } from 'date-fns';
import { saveAs } from 'file-saver';
import { utils, writeFile } from 'xlsx';
import { da } from 'date-fns/locale';
import { Card } from '../../../components/Card';
import { Browser } from '@capacitor/browser';

const baseURL = process.env.REACT_APP_API_URL;

const ListToday: React.FC = () => {
  const [researches, setResearches] = useState<Research[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const [day, setDay] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const [downloadIs, setDownloadIs] = useState<boolean>(false);

  const loadResearches = () => {
    setLoading(true);
    api
      .get(`/researches/data/${day}`)
      .then((response) => {
        setResearches(response.data);
        if (response.data.length === 0) {
          setMessage('Nenhuma pesquisa realizada na data informada.');
          setIserror(true);
          setDownloadIs(false);
        } else {
          setDownloadIs(true);
          setToastMessage(`${response.data.length} pesquisas encontradas.`);
          setShowToast(true);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExportToExcel = async () => {
    await Browser.open({ url: `${baseURL}/researches/data-excel/${day}` });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Relatório de pesquisa" href="/products" />

        <Input
          autocapitalize="sentences"
          type="date"
          label="Data da pesquisa"
          labelPlacement="floating"
          fill="outline"
          value={day}
          onIonInput={(e) => {
            setDownloadIs(false);
            setResearches([]);
            setDay(String(e.target.value!));
          }}
        ></Input>

        <Button expand="block" routerDirection="back" onClick={loadResearches}>
          Buscar pesquisas
        </Button>

        <Button expand="block" routerDirection="back" disabled={!downloadIs} onClick={handleExportToExcel}>
          Baixar relatório
        </Button>

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
              </Card>
            ))
          : loading && (
              <div style={{ textAlign: 'center' }}>
                <IonSpinner name="dots"></IonSpinner>
              </div>
            )}

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

export default ListToday;
