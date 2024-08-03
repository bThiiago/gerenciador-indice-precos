import { IonContent, IonPage, IonRadioGroup, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { IonAlert } from "@ionic/react";
import "./Index.css";
import CustomHeader from "../../../components/CustomHeader";
import { api } from "../../../services/axios";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useHistory, useParams } from "react-router";
import { checkmarkDoneCircleOutline } from "ionicons/icons";
import { City } from "../../../types/models";

interface ParamTypes {
  marketId: string;
}

const EditMarket: React.FC = () => {
  const { marketId } = useParams<ParamTypes>();

  const [marketDetails, setMarketDetails] = useState({
    name: "",
    city: {} as City,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const handleUpdate = async () => {
    if (!marketDetails.name) {
      setMessage("Nome do mercado não informado. Insira o nome do mercado para continuidade!");
      setIserror(true);
      return;
    }

    const updateData = {
      name: marketDetails.name,
    };

    await api
      .put(`/markets/${marketId}`, updateData)
      .then(() => {
        setToastMessage("Mercado atualizado com sucesso.");
        setShowToast(true);

        setTimeout(() => {
          history.push("/markets");
        }, 700);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const loadMarkets = () => {
    api
      .get(`/markets/id/${marketId}`)
      .then((response) => {
        setMarketDetails(response.data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  useEffect(() => {
    loadMarkets();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Editar mercado" href="/markets" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="Nome do mercado"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome do mercado"
          value={marketDetails.name}
          onIonInput={(e) =>
            setMarketDetails({ ...marketDetails, name: e.detail.value! })
          }
        ></Input>

<Input 
          autoCapitalize="sentences"
          type="text"
          label="Cidade"
          labelPlacement="floating"
          fill="outline"
          value={marketDetails.city.name}
          disabled
          ></Input>

        <Button expand="block" routerDirection="back" onClick={handleUpdate}>
          Atualizar
        </Button>

        <IonAlert
          isOpen={iserror}
          onDidDismiss={() => setIserror(false)}
          cssClass="my-custom-class"
          header={"Oops!"}
          message={message}
          buttons={["Fechar"]}
        />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
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

export default EditMarket;
