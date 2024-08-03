import { IonContent, IonPage, IonSelectOption, IonToast } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { IonAlert } from "@ionic/react";
import "./Index.css";
import CustomHeader from "../../../components/CustomHeader";
import { api } from "../../../services/axios";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { useHistory, useParams } from "react-router";
import { checkmarkDoneCircleOutline } from "ionicons/icons";
import { Select } from "../../../components/Select";
import { Category, Market } from "../../../types/models";

interface ParamTypes {
  productId: string;
}

const EditProduct: React.FC = () => {
  const { productId } = useParams<ParamTypes>();

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: {} as Category,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const handleUpdate = async () => {
    if (!productDetails.name) {
      setMessage("Nome do produto. Insira o nome do produto para continuidade!");
      setIserror(true);
      return;
    }

    const updateData = {
      name: productDetails.name,
    };

    await api
      .put(`/products/${productId}`, updateData)
      .then(() => {
        setToastMessage("Produto atualizado com sucesso.");
        setShowToast(true);

        setTimeout(() => {
          history.push("/products");
        }, 700);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  const loadProducts = () => {
    api
      .get(`/products/id/${productId}`)
      .then((response) => {
        setProductDetails(response.data);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Editar produto" href="/products" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="Nome do produto"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome do produto"
          value={productDetails.name}
          onIonInput={(e) =>
            setProductDetails({ ...productDetails, name: e.detail.value! })
          }
        ></Input>

        <Input
          autocapitalize="sentences"
          type="text"
          label="Categoria"
          labelPlacement="floating"
          fill="outline"
          value={productDetails.category.name}
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

export default EditProduct;
