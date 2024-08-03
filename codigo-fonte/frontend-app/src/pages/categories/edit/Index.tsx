import { IonContent, IonPage, IonRadioGroup, IonSelectOption, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { IonAlert } from "@ionic/react";
import "./Index.css";
import CustomHeader from "../../../components/CustomHeader";
import { api } from "../../../services/axios";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Radio } from "../../../components/Radio";
import { useHistory, useParams } from "react-router";
import { checkmarkDoneCircleOutline } from "ionicons/icons";
import { Select } from "../../../components/Select";

interface ParamTypes {
  categoryId: string;
}

const EditCategory: React.FC = () => {
  const { categoryId } = useParams<ParamTypes>();
  const [name, setName] = useState<string>("");
  const [barcode, setBarcode] = useState<boolean>(true);
  const [color, setColor] = useState<string>("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const chartColors = {
    100: "#1f77b4",
    101: "#ff7f0e",
    102: "#2ca02c",
    103: "#d62728",
    104: "#9467bd",
    105: "#8c564b",
    106: "#e377c2",
    107: "#7f7f7f",
    108: "#bcbd22",
    109: "#17becf",
  }

  const history = useHistory();

  const handleUpdate = async () => {
    if (!name) {
      setMessage("Nome da categoria não informado. Insira o nome da categoria para continuidade!");
      setIserror(true);
      return;
    }

    if (!color) {
      setMessage("Cor da categoria não selecionada. Selecione a cor da categoria para continuidade!");
      setIserror(true);
      return;
    }

    const updateData = {
      name: name,
      barcode: barcode,
      color: color,
    };

    await api
      .put(`/categories/${categoryId}`, updateData)
      .then(() => {
        setToastMessage("Categoria atualizada com sucesso.");
        setShowToast(true);

        setTimeout(() => {
          history.goBack();
        }, 700);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const loadCategories = () => {
    api
      .get(`/categories/id/${categoryId}`)
      .then((response) => {
        setName(response.data.name);
        setBarcode(response.data.barcode);
        setColor(response.data.color);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Editar categoria" href="/categories" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="Nome da categoria"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome da categoria"
          value={name}
          onIonInput={(e) => setName(e.detail.value!)}
        ></Input>

        <IonRadioGroup
          value={barcode}
          onIonChange={(e) => setBarcode(e.detail.value!)}
        >
          <Radio value={true}>A categoria tem código de barras</Radio>

          <Radio value={false}>A categoria não tem código de barras</Radio>
        </IonRadioGroup>

        <Select
          label="Cor da categoria"
          name="color"
          interface="popover"
          value={color}
          onIonChange={(e) => setColor(e.detail.value!)}
          labelPlacement="floating"
          style={{ backgroundColor: `${(chartColors as { [key: string]: string })[color]}` }}
        >
          {Object.entries(chartColors).map(([key, value]) => (
            <IonSelectOption key={key} value={key} className={`color-option color-option-${key}`}>
              {value}
            </IonSelectOption>
          ))}
        </Select>

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

export default EditCategory;
