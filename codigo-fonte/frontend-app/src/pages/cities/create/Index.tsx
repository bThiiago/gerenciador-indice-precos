import { IonContent, IonPage, IonToast, IonAlert, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useState } from 'react';
import './Index.css';
import CustomHeader from '../../../components/CustomHeader';
import { api } from "../../../services/axios";
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { checkmarkDoneCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Select } from '../../../components/Select';
import { City } from '../../../types/models';

const CreateCities: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [selectedState, setSelectedState] = useState<{ label: string; value: string }>({ label: 'Selecione um Estado', value: '' });
  const [states, setStates] = useState<{ label: string; value: string }[]>([
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' },
  ]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isError, setIsError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const handleCreate = async () => {
    if (!name) {
      setMessage("Por favor, insira um nome válido");
      setIsError(true);
      return;
    }


    if (selectedState.label === 'Selecione um Estado') {
      setMessage("Por favor, selecione um estado.");
      setIsError(true);
      return;
    }

    try {
      const response = await api.get<City[]>(`/cities?name=${name}&state=${selectedState.value}`);
      if (response.data.some(city => city.name.toLowerCase() === name.toLowerCase() && city.state === selectedState.value)) {
        setMessage("Esta cidade já foi cadastrada para o estado selecionado.");
        setIsError(true);
        return;
      }

      const createData = {
        name: name,
        state: selectedState.value,
      };

      await api.post('/cities', createData);

      setToastMessage('Cidade cadastrada com sucesso!');
      setShowToast(true);

      setTimeout(() => {
        document.location.reload();
      }, 1000);

      setTimeout(() => {
        history.push('/cities/create');
      }, 700);

    } catch (error) {
      setMessage('Ocorreu um erro ao cadastrar a cidade. Por favor, tente novamente.');
      setIsError(true);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader
          title="Cadastrar cidade" href="/cities" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="cidade"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome da cidade"
          value={name}
          onIonInput={(e) => setName(e.detail.value!)}
        ></Input>

        <Select
          label="Estado"
          name="state"
          placeholder="Selecione um Estado"
          labelPlacement="floating"
          fill="outline"
          value={selectedState}
          onIonChange={(e) => setSelectedState(e.detail.value)}
        >
          {states.map((state) => (
            <IonSelectOption key={state.value} value={state}>
              {state.label}
            </IonSelectOption>
          ))}
        </Select>

        <Button expand="block" onClick={handleCreate}>
          Cadastrar
        </Button>

        <IonAlert
          isOpen={isError}
          onDidDismiss={() => setIsError(false)}
          cssClass="my-custom-class"
          header={"Oops!"}
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
            textAlign: "center",
            "--border-radius": "30px",
          }}
          position="top"
          icon={checkmarkDoneCircleOutline}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateCities;