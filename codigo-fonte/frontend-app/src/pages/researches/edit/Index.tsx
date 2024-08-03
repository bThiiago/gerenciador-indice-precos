import { IonContent, IonPage, IonSelectOption, IonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { IonAlert } from '@ionic/react';
import './Index.css';
import CustomHeader from '../../../components/CustomHeader';
import { api } from '../../../services/axios';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useHistory, useParams } from 'react-router';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
// import { Select } from "../../../components/Select";
import { Market, Product } from '../../../types/models';

interface ParamTypes {
  researchId: string;
}

const EditResearch: React.FC = () => {
  const { researchId } = useParams<ParamTypes>();

  const [researchDetails, setresearchDetails] = useState({
    market: {} as Market,
    product: {} as Product,
    price: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const history = useHistory();

  const handleUpdate = async () => {
    if (!researchDetails.product) {
      setMessage('Produto não selecionado. Escolha um produto para dar continuidade!');
      setIserror(true);
      return;
    }

    if (!researchDetails.market) {
      setMessage('Mercado não selecionado. Escolha um mercado para dar continuidade!');
      setIserror(true);
      return;
    }

    if (!researchDetails.price) {
      setMessage('Preço não informado. Informe o preço do produto para dar continuidade!');
      setIserror(true);
      return;
    }

    const updateData = {
      product: researchDetails.product,
      market: researchDetails.market,
      price: researchDetails.price,
    };

    await api
      .put(`/researches/${researchId}`, updateData)
      .then(() => {
        setToastMessage('Pesquisa atualizada com sucesso.');
        setShowToast(true);

        setTimeout(() => {
          history.push('/researches');
        }, 700);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const loadResearches = () => {
    api
      .get(`/researches/id/${researchId}`)
      .then((response) => {
        const newPriceFormat = response.data.price.toString().includes('.')
          ? response.data.price
          : `${response.data.price}.00`;
        setresearchDetails({ ...response.data, price: newPriceFormat });
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  useEffect(() => {
    loadResearches();
  }, []);

  const handleFormatPrice = (e: any) => {
    let inputPrice = e.target.value.replace('.', '');

    if (inputPrice.length === 1 || inputPrice.length === 2) inputPrice = `.${inputPrice}`;
    else if (inputPrice.length > 2) {
      const priceArray = inputPrice.split('');

      priceArray.splice(inputPrice.length - 2, 0, '.');
      inputPrice = priceArray.join('');
    }

    setresearchDetails({ ...researchDetails, price: inputPrice });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Editar pesquisa" href="/researches" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="Nome do produto"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome do produto"
          value={researchDetails.product.name}
          disabled
        ></Input>

        <Input
          type="number"
          inputMode="decimal"
          label="Preço do produto"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o preço do produto"
          step="0.01"
          value={researchDetails.price}
          onInput={(e) => handleFormatPrice(e)}
        ></Input>

        <Input
          autocapitalize="sentences"
          type="text"
          label="Mercado"
          labelPlacement="floating"
          fill="outline"
          value={researchDetails.market.name}
          disabled
        ></Input>

        <Button expand="block" routerDirection="back" onClick={handleUpdate}>
          Atualizar
        </Button>

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

export default EditResearch;
