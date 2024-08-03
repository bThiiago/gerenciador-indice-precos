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
import { Category } from '../../../types/models';
import { Search } from '../../../components/Search';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Card } from '../../../components/Card';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { GenericFrontError } from '../../../errors/GenericFrontError';
import { useLocation } from 'react-router-dom';

const Categories: React.FC = () => {
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const chartColors = {
    100: '#1f77b4',
    101: '#ff7f0e',
    102: '#2ca02c',
    103: '#d62728',
    104: '#9467bd',
    105: '#8c564b',
    106: '#e377c2',
    107: '#7f7f7f',
    108: '#bcbd22',
    109: '#17becf',
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await api
      .delete(`/categories/${id}`)
      .then(() => {
        setSelectedCategoryId(null);
        setShowDeleteAlert(false);
        setToastMessage('Categoria apagada com sucesso.');
        setShowToast(true);
        loadCategories();
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
      .get(`/categories/${e.target.value}`)
      .then((response) => {
        setCategories(response.data);
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
      setCategories([]);
      loadCategories();
      e.detail.complete();
    }, 1000);
  };

  const loadCategories = () => {
    setLoading(true);
    api
      .get('/categories')
      .then((response) => {
        setCategories(response.data);
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
    loadCategories();
  }, []);

  useEffect(() => {
    if (location.pathname === '/categories') loadCategories();
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Categorias" />
        <Search
          placeholder="Procure uma categoria..."
          onIonInput={handleSearch}
          autocapitalize="off"
          showClearButton="always"
        />
        {categories.length > 0
          ? categories.map((category) => (
              <Card key={category.id} style={{ margin: '5%' }}>
                <IonCardHeader>
                  <IonCardSubtitle
                    style={{ fontSize: '17px', color: chartColors[category.color as keyof typeof chartColors] }}
                  >
                    {category.name}
                  </IonCardSubtitle>
                  <IonCardSubtitle style={{ fontSize: '17px' }}>
                    {category.barcode ? <span>Com código de barras</span> : <span>Sem código de barras</span>}
                  </IonCardSubtitle>
                </IonCardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IonButton fill="clear" routerDirection="forward" routerLink={`/categories/edit/${category.id}`}>
                    Editar
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setSelectedCategoryId(category.id);
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

        <CircleButton routerDirection="forward" routerLink="/categories/create" shape="round">
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
                setSelectedCategoryId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedCategoryId !== null) {
                  handleDelete(selectedCategoryId);
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

export default Categories;
