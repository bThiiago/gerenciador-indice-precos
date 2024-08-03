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
import { Barcode, Product } from '../../../types/models';
import { Search } from '../../../components/Search';
import CustomHeader from '../../../components/CustomHeader';
import './Index.css';
import { Card } from '../../../components/Card';
import { checkmarkDoneCircleOutline, pencil, trash } from 'ionicons/icons';
import { useAuth } from '../../../hooks/auth';
import { useHistory, useLocation } from 'react-router-dom';

const Products: React.FC = () => {
  const location = useLocation();

  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBarcodeId, setSelectedBarcodeId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [produtoMostrarCodigoBarras, setProdutoMostrarCodigoBarras] = useState<string>();

  const history = useHistory();

  const handleDelete = async (id: string) => {
    await api
      .delete(`/products/${id}`)
      .then(() => {
        setSelectedProductId(null);
        setShowDeleteAlert(false);
        setToastMessage('Produto apagado com sucesso.');
        setShowToast(true);
        if (searchTerm !== '') {
          handleSearch({ target: { value: searchTerm } });
          return;
        }
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteBarcode = async (id: string) => {
    await api
      .delete(`/barcodes/${id}`)
      .then(() => {
        setSelectedProductId(null);
        setShowDeleteAlert(false);
        setToastMessage('Código de barras apagado com sucesso.');
        setShowToast(true);
        if (searchTerm !== '') {
          handleSearch({ target: { value: searchTerm } });
          return;
        }
        setProducts(
          products.map((product) => ({
            ...product,
            barcode: product.barcode.filter((barcode) => barcode.id !== id),
          }))
        );
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    setLoading(true);
    setPage(1);
    setDisableInfiniteScroll(false);
    setProducts([]);
    api
      .get(`/products/${e.target.value}`, { params: { page, perPage } })
      .then((response) => {
        setProducts(response.data);
        if (searchTerm === '') {
          loadProducts();
          setDisableInfiniteScroll(false);
        } else {
          setDisableInfiniteScroll(true);
        }
      })
      .catch((error) => {
        console.error(error);
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

  const loadProducts = () => {
    setLoading(true);
    api
      .get('/products', { params: { page, perPage } })
      .then((response) => {
        if (response.data.length === 0) {
          setDisableInfiniteScroll(true);
        }
        if (page > 1) setProducts([...products, ...response.data]);
        else setProducts(response.data);
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
    loadProducts();
    target.complete();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setPage(1);
    if (location.pathname === '/products') {
      loadProducts();
    }
  }, [location.pathname]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <CustomHeader title="Produtos" />
        <Search
          placeholder="Procure um produto..."
          debounce={500}
          onIonInput={handleSearch}
          autocapitalize="off"
          showClearButton="always"
        />

        {products.length > 0
          ? products.map((product) => (
              <Card key={product.id}>
                <IonCardHeader class="no-padding" style={{ paddingBottom: 0 }}>
                  <IonCardSubtitle class="no-padding" style={{ fontSize: '17px', color: 'var(--ion-color-dark)' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>{product.name}</div>
                    </div>
                  </IonCardSubtitle>
                  <IonCardSubtitle class="no-padding" style={{ fontSize: '17px' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>{product.category?.name}</div>
                    </div>
                  </IonCardSubtitle>
                  <IonCardSubtitle class="no-padding" style={{ fontSize: '17px' }}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '4px',
                        justifyContent: 'space-between',
                      }}
                    ></div>
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent class="no-padding" style={{ fontSize: '17px', padding: 0 }}>
                  {produtoMostrarCodigoBarras && produtoMostrarCodigoBarras === product.name && (
                    <div>
                      <IonList>
                        {Array.isArray(product.barcode) &&
                          product.barcode.map((barcode: Barcode, index: any) => (
                            <IonItem key={index}>
                              <IonLabel>{barcode.code}</IonLabel>
                              <IonButton
                                onClick={() => {
                                  if (product.barcode.length == 1) setProdutoMostrarCodigoBarras('');
                                  handleDeleteBarcode(barcode.id);
                                }}
                              >
                                <IonIcon icon={trash} />
                              </IonButton>
                            </IonItem>
                          ))}
                      </IonList>
                    </div>
                  )}
                </IonCardContent>

                {user && user.level === 9 && product.barcode?.length > 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <IonButton
                      fill="clear"
                      onClick={() => {
                        setProdutoMostrarCodigoBarras(produtoMostrarCodigoBarras === product.name ? '' : product.name);
                      }}
                    >
                      {produtoMostrarCodigoBarras === product.name
                        ? 'Ocultar código(s) de barras'
                        : 'Mostrar código(s) de barras'}
                    </IonButton>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {user && user.level === 9 && (
                    <IonButton fill="clear" onClick={() => history.push(`/products/edit/${product.id}`)}>
                      Editar
                    </IonButton>
                  )}
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setShowDeleteAlert(true);
                    }}
                  >
                    Deletar
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

        <CircleButton routerDirection="forward" routerLink="/products/create" shape="round">
          +
        </CircleButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Cuidado!"
          subHeader="Tem certeza que deseja apagar este produto?"
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                setSelectedProductId(null);
              },
            },
            {
              text: 'OK',
              role: 'confirm',
              handler: () => {
                if (selectedProductId !== null) {
                  handleDelete(selectedProductId);
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

export default Products;
