import React, { useEffect, useRef, useState } from 'react';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonRow,
  IonSearchbar,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { api } from '../../../services/axios';
import { Category, Market, Product, Research } from '../../../types/models';
import { CardButton } from '../../../components/CardButton';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Select } from '../../../components/Select';
import CustomHeader from '../../../components/CustomHeader';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { arrowBackOutline, checkmarkDoneCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import './Index.css';
import { arrowBack } from 'ionicons/icons';
import { set } from 'date-fns';

const CreateResearch: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [scannedCode, setScannedCode] = useState<boolean>(false);
  const [barcode, setBarcode] = useState<Barcode>();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [createproducterror, setCreateProductError] = useState(false);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [selectedMarket, setSelectedMarket] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [researchStatus, setResearchStatus] = useState('not');
  const [researchDetails, setResearchDetails] = useState({
    market: '',
    product: '',
  });

  const [price, setPrice] = useState<string>();

  const [productDetails, setProductDetails] = useState({
    name: '',
    category: '',
    barcode: 'Sem código de barras',
  });

  const [market, setMarket] = useState<Market | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [handWrittenBarcode, setHandWrittenBarcode] = useState('');

  const [createNewProduct, setCreateNewProduct] = useState(false);

  const [productsResearchList, setProductsResearchList] = useState<Research[]>([]);

  const history = useHistory();

  const handleHandWrittenBarcode = () => {
    if (!handWrittenBarcode) {
      setMessage(
        `Código de barras não inserido (${JSON.stringify(handWrittenBarcode)}). Insira o código de barras para dar continuidade!`
      );
      setIserror(true);
      return;
    } else if (!/^\d+$/.test(handWrittenBarcode)) {
      setMessage(
        `Código de barras inválido (${JSON.stringify(handWrittenBarcode)}). Insira apenas números para dar continuidade!`
      );
      setIserror(true);
      return;
    } else if (handWrittenBarcode.length < 13 || handWrittenBarcode.length > 13) {
      setMessage(
        `Código de barras inválido (${JSON.stringify(handWrittenBarcode)}). Insira um código de barras com 13 dígitos para dar continuidade!`
      );
      setIserror(true);
      return;
    }

    let sum = 0;
    for (let i = 0; i < 12; i += 2) {
      sum += parseInt(handWrittenBarcode[i]);
    }
    for (let i = 1; i < 12; i += 2) {
      sum += parseInt(handWrittenBarcode[i]) * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;

    if (parseInt(handWrittenBarcode[12]) !== checksum) {
      setMessage(
        `Código de barras inexiste ou inválido (${JSON.stringify(handWrittenBarcode)}). Insira um código de barras válido para dar continuidade!`
      );
      setIserror(true);
      return;
    }

    handleSearch({ displayValue: handWrittenBarcode } as Barcode);
  };

  const isValidEAN13 = (barcode: string): boolean => {
    let sum = 0;
    for (let i = 0; i < 12; i += 2) {
      sum += parseInt(barcode[i]);
    }
    for (let i = 1; i < 12; i += 2) {
      sum += parseInt(barcode[i]) * 3;
    }
    const checksum = (10 - (sum % 10)) % 10;
    return parseInt(barcode[12]) === checksum;
  };

  const scanBarcode = async () => {
    try {
      await BarcodeScanner.requestPermissions();
      const result = await BarcodeScanner.scan();

      if (!isValidEAN13(result.barcodes[0].displayValue)) {
        setMessage(
          `Código de barras inexiste ou inválido (${result.barcodes[0].displayValue}). Insira um código de barras válido para dar continuidade!`
        );
        setIserror(true);
        return;
      } else {
        setBarcode(result.barcodes[0]);
        handleSearch(result.barcodes[0]);
      }
    } catch (error: any) {
      setMessage(error.message);
      setIserror(true);
    }
  };

  const handleSearch = (barcode: Barcode) => {
    api
      .get(`/barcodes/code/${barcode.displayValue}`)
      .then((response) => {
        if (response.data.message === 'Código de barras não encontrado') {
          setIserror(true);
          setScannedCode(false);
          setHandWrittenBarcode('');

          productDetails.name = '';
          setCreateNewProduct(false);

          setMessage('O produto escolhido não foi encontrado. Cadastre o produto para dar continuidade!');

          setCreateProductError(true);
          setProductDetails({
            ...productDetails,
            barcode: barcode.displayValue,
          });
        } else if (response.data.product?.category !== null && response.data.product?.category.name != category?.name) {
          setIserror(true);
          setScannedCode(false);
          setHandWrittenBarcode('');
          setMessage(
            `O produto escolhido não pertence à categoria "${category?.name}". Selecione um produto da mesma categoria da pesquisa para dar continuidade!`
          );
        } else {
          setResearchStatus('old');
          setScannedCode(true);
          setProduct(response.data.product);
          setResearchDetails({
            ...researchDetails,
            product: response.data.product,
          });
          setPrice(response.data.price);
          setCategory(response.data.product.category);
          setShowModal(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadCategories = async () => {
    const response = await api.get('/categories').then((response) => setCategories(response.data));
  };

  const loadMarkets = async () => {
    const response = await api.get('/markets').then((response) => setMarkets(response.data));
  };

  useEffect(() => {
    loadCategories();
    loadMarkets();

    BarcodeScanner.isSupported();
    BarcodeScanner.checkPermissions();
    BarcodeScanner.installGoogleBarcodeScannerModule();
  }, []);

  const handleCategorySelection = (category: Category) => {
    setSelectedCategory(category);
    setResearchStatus(category.barcode ? 'old' : 'new');
    setCategory(category);
    api
      .get(`/products?category=${category.id}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleProductSelection = (product: Product) => {
    setProductDetails({
      ...productDetails,
      name: product.name,
      category: product.category.name,
    });
    setCategory(product.category);
  };

  const handleCreate = async () => {
    if (!product) {
      setMessage('Produto não selecionado. Escolha um produto para dar continuidade!');
      setIserror(true);
      return;
    }

    if (!price) {
      setMessage('Preço não informado. Informe o preço do produto para dar continuidade!');
      setIserror(true);
      return;
    }

    if (!market) {
      setMessage('Mercado não selecionado. Escolha um mercado para dar continuidade!');
      setIserror(true);
      return;
    }

    const filteredPrice = price.replace('R$', '');

    const createData = {
      price: filteredPrice,
      market: market,
      product: product,
    };

    await api
      .post('/researches', createData)
      .then(() => {
        setToastMessage('Pesquisa cadastrada com sucesso.');
        setShowToast(true);

        setTimeout(() => {
          loadResearchsData();
          setProduct(null);
          setPrice('');
          if (category) {
            handleCategorySelection(category);
          }
          setHandWrittenBarcode('');
          setScannedCode(false);
        }, 1000);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const handleCreateProduct = async () => {
    if (!productDetails.name) {
      setMessage('Nome do produto não informado. Informe o nome do produto para dar continuidade!');
      setIserror(true);
      return;
    }

    const createData = {
      name: productDetails.name,
      category: category,
    };

    if (!products.find((product) => product.name === productDetails.name)) {
      await api
        .post('/products', createData)
        .then(() => {
          setToastMessage('Produto cadastrado com sucesso.');
          setShowToast(true);

          setCreateProductError(false);

          setHandWrittenBarcode(productDetails.barcode);
        })
        .catch((error) => {
          setMessage(error.message);
          setIserror(true);
        });

      await new Promise((resolve) => setTimeout(resolve, 500));

      await api
        .get(`/products?category=${category?.id}`, { headers: { 'Cache-Control': 'no-cache' } })
        .then((response) => {
          setProducts(response.data);
          handleCreateBarcode(
            response.data.find((product: Product) => product.name === productDetails.name) as Product
          );
        });
    } else {
      setToastMessage('Produto cadastrado com sucesso.');
      setShowToast(true);

      setCreateProductError(false);

      setHandWrittenBarcode(productDetails.barcode);

      await api.get(`/products?category=${category?.id}`).then((response) => {
        setProducts(response.data);
        handleCreateBarcode(response.data.find((product: Product) => product.name === productDetails.name) as Product);
      });
    }
  };

  const handleCreateBarcode = async (response: Product) => {
    const createData = {
      code: productDetails.barcode,
      product: response,
    };

    await api
      .post('/barcodes', createData)
      .then(() => {})
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const loadResearchsData = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;
    const dia = data.getDate();

    const dataFormatada = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

    api
      .get(`/researches/data/${dataFormatada}`)
      .then((response) => {
        setProductsResearchList(response.data.filter((research: any) => research.market.id === market?.id));
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  useEffect(() => {
    loadResearchsData();
  }, []);

  useEffect(() => {
    loadResearchsData();
  }, [market]);

  useEffect(() => {
    if (location.pathname === 'researches/create') {
      loadResearchsData();
    }
  }, [location.pathname]);

  let productResearchCount = productsResearchList.reduce((acc: { [key: string]: number }, { product }) => {
    acc[product.id] = (acc[product.id] || 0) + 1;
    return acc;
  }, {});

  const modal = useRef<HTMLIonModalElement>(null);

  const handleFormatPrice = (e: any) => {
    let inputPrice = e.target.value.replace('.', '');

    if (inputPrice.length === 1 || inputPrice.length === 2) inputPrice = `.${inputPrice}`;
    else if (inputPrice.length > 2) {
      const priceArray = inputPrice.split('');

      priceArray.splice(inputPrice.length - 2, 0, '.');
      inputPrice = priceArray.join('');
    }

    setPrice(inputPrice);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Cadastrar pesquisa" href="custom">
          <IonButton
            onClick={() => {
              if (selectedCategory) {
                setScannedCode(false);
                setSelectedCategory(null);
                setProduct(null);
                setPrice('');
                setResearchStatus('not');
                setHandWrittenBarcode('');
              } else if (selectedMarket) {
                setSelectedMarket(false);
              } else {
                history.goBack();
              }
            }}
          >
            <IonIcon icon={arrowBack}></IonIcon>
          </IonButton>
        </CustomHeader>

        {!selectedCategory && (
          <>
            {!selectedMarket &&
              markets.length > 0 &&
              markets.map((market) => (
                <CardButton
                  key={market.id}
                  onClick={() => {
                    setMarket(market);
                    setSelectedMarket(true);
                  }}
                >
                  <IonCard key={market.id} style={{ margin: '5%', width: '100%', boxShadow: 'none' }}>
                    <IonCardHeader>
                      <IonCardSubtitle
                        style={{
                          fontSize: '15px',
                          color: 'var(--ion-color-dark)',
                        }}
                      >
                        {market.name}
                      </IonCardSubtitle>
                      <IonCardSubtitle
                        style={{
                          fontSize: '11px',
                        }}
                      >
                        {market.city?.name} - {market.city?.state}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </CardButton>
              ))}
            {!selectedMarket && markets.length <= 0 && (
              <div className="container">
                <span style={{ color: 'red', fontWeight: 'bold' }}>Nenhum mercado encontrado</span> <br />
              </div>
            )}
            {selectedMarket && categories.length > 0
              ? categories.map((category) => (
                  <CardButton key={category.id} onClick={() => handleCategorySelection(category)}>
                    <IonCard key={category.id} style={{ margin: '5%', width: '100%', boxShadow: 'none' }}>
                      <IonCardHeader>
                        <IonCardSubtitle
                          style={{
                            fontSize: '15px',
                            color: 'var(--ion-color-dark)',
                          }}
                        >
                          {category.name}
                        </IonCardSubtitle>
                        <IonCardSubtitle style={{ fontSize: '15px' }}>
                          {category.barcode ? <span>Com código de barras</span> : <span>Sem código de barras</span>}
                        </IonCardSubtitle>
                      </IonCardHeader>
                    </IonCard>
                  </CardButton>
                ))
              : categories.length < 0 && (
                  <div className="container">
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Nenhuma categoria encontrada</span> <br />
                  </div>
                )}
          </>
        )}
        {selectedMarket && selectedCategory && (
          <div>
            <Input
              label="Mercado"
              name="market"
              labelPlacement="floating"
              fill="outline"
              value={market?.name}
              disabled
            />
            <Input
              label="Categoria"
              name="category"
              placeholder="Categoria"
              labelPlacement="floating"
              fill="outline"
              value={category?.name}
              disabled
            />
            {selectedCategory.barcode && researchStatus === 'old' && scannedCode ? (
              <Input
                label="Nome"
                name="name"
                placeholder="Nome"
                labelPlacement="floating"
                fill="outline"
                value={product?.name}
                disabled
              />
            ) : (
              <Select
                label="Nome"
                name="name"
                interface="popover"
                value={product}
                onIonChange={(e) => setProduct(e.detail.value!)}
                labelPlacement="floating"
                disabled={researchStatus === 'old'}
              >
                {products.map((product) => (
                  <IonSelectOption key={product.id} value={product}>
                    {product.name}
                  </IonSelectOption>
                ))}
              </Select>
            )}
            <Input
              type="number"
              inputMode="decimal"
              label="Preço"
              step="0.01"
              name="price"
              placeholder="Preço"
              labelPlacement="floating"
              fill="outline"
              value={price}
              onInput={(e) => handleFormatPrice(e)}
              disabled={researchStatus === 'old' && !scannedCode}
            />
            {selectedCategory.barcode && researchStatus === 'old' && !scannedCode ? (
              <>
                <Button onClick={scanBarcode}>Escanear Código de Barras</Button>
                <Button onClick={() => setShowModal(true)}>Digitar Código de Barras</Button>
              </>
            ) : (
              <Button onClick={handleCreate}>Cadastrar</Button>
            )}
            {!selectedCategory.barcode && scannedCode && <Button onClick={handleCreate}>Cadastrar</Button>}

            {/* Contador de produtos cadastrados */}
            <div>
              <IonButton id="open-modal" expand="full" fill="solid" size="small" color="medium">
                Produtos pesquisados
              </IonButton>
              <IonModal ref={modal} trigger="open-modal" initialBreakpoint={0.75} breakpoints={[0, 0.75, 1]}>
                <IonContent className="ion-padding">
                  <IonHeader>
                    <IonToolbar>
                      <IonButtons slot="start">
                        <IonButton onClick={() => modal.current?.dismiss()}>
                          <IonIcon icon={arrowBackOutline}></IonIcon>
                        </IonButton>
                      </IonButtons>
                      <IonTitle>Produtos pesquisados</IonTitle>
                    </IonToolbar>
                  </IonHeader>
                  <IonList>
                    <IonGrid>
                      {products
                        .sort((a, b) => (productResearchCount[a.id] || 0) - (productResearchCount[b.id] || 0))
                        .map(({ id, name }) => (
                          <IonItem key={id} lines="none">
                            <IonGrid>
                              <IonRow className="ion-align-items-center">
                                <IonCol size="11" className="ion-text-start">
                                  <IonLabel>{name}</IonLabel>
                                </IonCol>
                                <IonCol size="1" className="ion-text-end">
                                  <IonLabel>{productResearchCount[id] || 0}</IonLabel>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonItem>
                        ))}
                    </IonGrid>
                  </IonList>
                </IonContent>
              </IonModal>
            </div>
          </div>
        )}

        <IonModal isOpen={createproducterror}>
          <IonHeader
            style={{
              boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.0)',
              padding: '5%',
            }}
          >
            <IonToolbar
              style={{
                '--background': 'rgba(0,0,0,0.0)',
                '--color': 'var(--ion-color-dark)',
                '--border-color': 'var(--ion-color-dark)',
                '--border-radius': '4px',
                '--box-shadow': 'none',
                '--align-items': 'center',
                padding: '0px',
              }}
            >
              <IonButtons slot="start">
                <IonButton onClick={() => setCreateProductError(false)} shape="round">
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle
                style={{
                  color: 'var(--ion-color-dark)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  padding: '0px 0px',
                }}
              >
                {message}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedCategory && (
              <div>
                <Select
                  interface="popover"
                  placeholder="Selecione um produto"
                  onIonChange={(e) => {
                    if (e.detail.value === 'new') {
                      setCreateNewProduct(true);
                      setScannedCode(false);
                      setProductDetails({
                        ...productDetails,
                        name: '',
                      });
                    } else {
                      setCreateNewProduct(false);
                      setScannedCode(false);
                      const selectedProduct = products.find((product) => product.id === e.detail.value);
                      if (selectedProduct) {
                        handleProductSelection(selectedProduct);
                      }
                    }
                  }}
                >
                  <IonSelectOption value="new">Cadastrar novo produto</IonSelectOption>
                  {Object.values(
                    products
                      .filter((product) => product.category.id === selectedCategory.id)
                      .reduce((acc: { [key: string]: Product }, product: Product) => {
                        if (!acc[product.name]) {
                          acc[product.name] = product;
                        }
                        return acc;
                      }, {})
                  ).map((product: Product) => (
                    <IonSelectOption key={product.id} value={product.id}>
                      {product.name}
                    </IonSelectOption>
                  ))}
                </Select>
                <Input
                  label="Nome"
                  name="name"
                  placeholder="Nome"
                  labelPlacement="floating"
                  fill="outline"
                  onIonInput={(e) =>
                    setProductDetails({
                      ...productDetails,
                      name: e.detail.value!,
                    })
                  }
                  value={productDetails.name}
                  disabled={!createNewProduct}
                />
                <Input
                  label="Categoria"
                  name="category"
                  placeholder="Categoria"
                  labelPlacement="floating"
                  fill="outline"
                  value={productDetails.category || selectedCategory.name}
                  disabled
                />
                <Input
                  label="Código de Barras"
                  name="barcode"
                  placeholder="Código de Barras"
                  labelPlacement="floating"
                  fill="outline"
                  value={productDetails.barcode}
                  disabled
                />
                {selectedCategory.barcode && (
                  <>
                    <Button onClick={handleCreateProduct}>Cadastrar</Button>
                  </>
                )}
                {!selectedCategory.barcode && !scannedCode && <Button onClick={handleCreateProduct}>Cadastrar</Button>}
              </div>
            )}
          </IonContent>
        </IonModal>

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

        <IonModal isOpen={showModal}>
          <IonHeader
            style={{
              boxShadow: '0px 0px 0px 0px rgba(0,0,0,0.0)',
              padding: '5%',
            }}
          >
            <IonToolbar
              style={{
                '--background': 'rgba(0,0,0,0.0)',
                '--color': 'var(--ion-color-dark)',
                '--border-color': 'var(--ion-color-dark)',
                '--border-radius': '4px',
                '--box-shadow': 'none',
                '--align-items': 'center',
                padding: '0px',
              }}
            >
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)} shape="round">
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonButton>
              </IonButtons>
              <IonTitle
                style={{
                  color: 'var(--ion-color-dark)',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  padding: '0px 0px',
                }}
              >
                Código de barras manual
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="container" style={{ textAlign: 'left' }}>
              <Input
                label="Código de Barras"
                placeholder="Código de Barras"
                labelPlacement="floating"
                fill="outline"
                name="handWrittenBarcode"
                value={handWrittenBarcode}
                onIonInput={(e) => setHandWrittenBarcode(e.detail.value!)}
              />
              <Button onClick={() => handleHandWrittenBarcode()}>Enviar</Button>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CreateResearch;
