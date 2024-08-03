import React, { useEffect, useState } from "react";
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { api } from "../../../services/axios";
import { Category, Product } from "../../../types/models";
import { CardButton } from "../../../components/CardButton";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import CustomHeader from "../../../components/CustomHeader";
import "./Index.css";
import { arrowBackOutline, checkmarkDoneCircleOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import { Select } from "../../../components/Select";
import { arrowBack } from 'ionicons/icons';

const CreateProduct: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "",
  });

  const [category, setCategory] = useState<Category | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [createNewProduct, setCreateNewProduct] = useState(false);
  const [selectedProd, setSelectedProd] = useState(false);

  const history = useHistory();

  const loadCategories = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  const loadProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const handleCategorySelection = (category: Category) => {
    setSelectedCategory(category);
    setProductDetails({
      ...productDetails,
      category: category.name,
    });
    setCategory(category);
  };

  const handleProductSelection = (product: Product) => {
    setProductDetails({
      ...productDetails,
      name: product.name,
      category: product.category.name,
    });
    setCategory(product.category);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setProductDetails({
      ...productDetails,
      [name]: value,
    });
  };

  const handleCreate = async () => {
    if (!productDetails.name) {
      setMessage("Nome do produto não informado. Insira o nome do produto para continuidade!");
      setIserror(true);
      return;
    }

    const createData = {
      name: productDetails.name,
      category: category,
    };

    await api
      .post("/products", createData)
      .then(() => {
        setToastMessage("Produto cadastrado com sucesso.");
        setShowToast(true);

        setSelectedCategory(
          null,
        );
        setProductDetails({
          name: "",
          category: "",
        });
        setCategory(null);
        setCreateNewProduct(false);
        setSelectedProd(false);

        setTimeout(() => {
          history.push("/products");
        }, 700);
      })
      .catch((error) => {
        setMessage(error.message);
        setIserror(true);
      });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Cadastrar produto" href="custom">
        <IonButton onClick={
            () => selectedCategory ? setSelectedCategory(null) : history.goBack()
          }>
            <IonIcon icon={arrowBack}></IonIcon>
          </IonButton>
        </CustomHeader>
        {!selectedCategory && (
          <>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CardButton
                  key={category.id}
                  onClick={() => handleCategorySelection(category)}
                >
                  <IonCard
                    key={category.id}
                    style={{ margin: "5%", width: "100%", boxShadow: "none" }}
                  >
                    <IonCardHeader>
                      <IonCardSubtitle
                        style={{
                          fontSize: "15px",
                          color: "var(--ion-color-dark)",
                        }}
                      >
                        {category.name}
                      </IonCardSubtitle>
                      <IonCardSubtitle style={{ fontSize: "15px" }}>
                        {category.barcode ? (
                          <span>Com código de barras</span>
                        ) : (
                          <span>Sem código de barras</span>
                        )}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </CardButton>
              ))
            ) : (
              <div className="container">
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Nenhuma categoria encontrada
                </span>{" "}
                <br />
              </div>
            )}
          </>
        )}
        {selectedCategory && (
          <div>
            <Select
              interface="popover"
              placeholder="Selecione um produto"
              onIonChange={(e) => {
                if (e.detail.value === "new") {
                  setCreateNewProduct(true);
                  setSelectedProd(true);
                  setProductDetails({
                    ...productDetails,
                    name: "",
                  });
                } else {
                  setCreateNewProduct(false);
                  setSelectedProd(true);
                  const selectedProduct = products.find(
                    (product) => product.id === e.detail.value,
                  );
                  if (selectedProduct) {
                    handleProductSelection(selectedProduct);
                  }
                }
              }}
            >
              <IonSelectOption value="new">
                Cadastrar novo produto
              </IonSelectOption>
              {Object.values(
                products
                  .filter(
                    (product) => product.category.id === selectedCategory.id,
                  )
                  .reduce(
                    (acc: { [key: string]: Product }, product: Product) => {
                      if (!acc[product.name]) {
                        acc[product.name] = product;
                      }
                      return acc;
                    },
                    {},
                  ),
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
              onIonInput={handleInputChange}
              value={productDetails.name}
              disabled={!createNewProduct}
            />
            <Input
              label="Categoria"
              name="category"
              placeholder="Categoria"
              labelPlacement="floating"
              fill="outline"
              value={productDetails.category}
              disabled
            />
            <Button onClick={handleCreate}>Cadastrar</Button>
          </div>
        )}
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

export default CreateProduct;
