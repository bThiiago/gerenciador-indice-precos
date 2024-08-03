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
import "./Index.css";
import CustomHeader from "../../../components/CustomHeader";
import { CardButton } from "../../../components/CardButton";
import { api } from "../../../services/axios";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { arrowBackOutline, checkmarkDoneCircleOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { Select } from "../../../components/Select";
import { City, Market } from "../../../types/models";

const CreateMarket: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [selectCity, setSelectCity] = useState<City | null>(
    null,
  );

  const [marketDetails, setMarketDetails] = useState({
    name: "",
    city: "",
  });

  const [city, setCity] = useState<City | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [createNewMarket, setCreateNewMarket] = useState(false);
  const [selectedMark, setSelectMark] = useState(false);

  const history = useHistory();

  const loadCities = async () => {
    const response = await api.get("/cities");
    setCities(response.data);
  }

  const handleSearch = (marketName: string, city: string) => {
    const existingMarket = markets.find(
      (market) => market.name === marketName && market.city.name === city
    );
  
    if (existingMarket) {
      setMessage("Mercado já cadastrado nesta cidade!");
      setIserror(true);
    } else {
      api
        .get(`/markets?name=${marketName}&city=${city}`)
        .then((response) => {
          if (response.data.length === 0) {
            setMessage("Mercado não cadastrado nesta cidade!");
            setIserror(true);
            setMarketDetails({
              ...marketDetails,
              name: marketName,
              city: city,
            });
          } else {
            setMessage("Mercado já cadastrado nesta cidade!");
            setIserror(true);
            setMarketDetails({
              ...marketDetails,
              name: response.data[0].name,
              city: response.data[0].city,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  
  const loadMarkets = async () => {
    const response = await api.get("/markets");
    setMarkets(response.data);
  }

  useEffect(() => {
    loadCities();
    loadMarkets();
  }, []);

  const handleCitySelection = (city: City) => {
    setSelectCity(city);
    setMarketDetails({
      ...marketDetails,
      city: city.name,
    });
    setCity(city);
  };

  const handleMarketSelection = (market: Market) => {
    setMarketDetails({
      ...marketDetails,
      name: market.name,
      city: market.city.name,
    });
    setCity(market.city);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setMarketDetails({
      ...marketDetails,
      [name]: value,
    });
  };

  const handleCreate = async () => {
    if (!marketDetails.name) {
      setMessage("Nome do mercado não informado. Insira o nome do mercado para continuidade!");
      setIserror(true);
      return;
    }

    const createData = {
      name: marketDetails.name,
      city: city,
    };

    await api
      .post("/markets", createData)
      .then(() => {
        setToastMessage("Mercado cadastrado com sucesso.");
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

  return (
    <IonPage>
      <IonContent fullscreen>
        <CustomHeader title="Cadastrar mercado" href="/markets" />

        {!selectCity && (
          <>
            {cities.length > 0 ? (
              cities.map((city) => (
                <CardButton
                  key={city.id}
                  onClick={() => handleCitySelection(city)}
                >
                  <IonCard
                    key={city.id}
                    style={{ margin: "5%", width: "100%", boxShadow: "none" }}
                  >
                    <IonCardHeader>
                      <IonCardSubtitle
                        style={{
                          fontSize: "15px",
                          color: "var(--ion-color-dark)",
                        }}
                      >
                        {city.name}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </CardButton>
              ))
            ) : (
              <div className="container">
                <span style={{ color: "red", fontWeight: "bold" }}>
                  Nenhuma cidade encontrada
                </span>{" "}
                <br />
              </div>
            )}
          </>
        )}
        {selectCity && (
          <div>
            <Select
              interface="popover"
              placeholder="Selecione o mercado"
              onIonChange={(e) => {
                if (e.detail.value === "new") {
                  setCreateNewMarket(true);
                  setSelectMark(true);
                  setMarketDetails({
                    ...marketDetails,
                    name: "",
                  });
                } else {
                  setCreateNewMarket(false);
                  setSelectMark(true);
                  const selectedMarket = markets.find(
                    (market) => market.id === e.detail.value,
                  );
                  if (selectedMarket) {
                    handleMarketSelection(selectedMarket);
                  }
                }
              }}
            >
              <IonSelectOption value="new">
                Cadastrar novo mercado
              </IonSelectOption>
              {Object.values(
                markets
                  .filter(
                    (market) => market.city.id === selectCity.id,
                  )
                  .reduce(
                    (acc: { [key: string]: Market }, market: Market) => {
                      if (!acc[market.name]) {
                        acc[market.name] = market;
                      }
                      return acc;
                    },
                    {},
                  ),
              ).map((market: Market) => (
                <IonSelectOption key={market.id} value={market.id}>
                  {market.name}
                </IonSelectOption>
              ))}
            </Select>

            <Input
              autocapitalize="sentences"
              type="text"
              label="Nome"
              name="name"
              placeholder="Nome"
              labelPlacement="floating"
              fill="outline"
              onIonInput={handleInputChange}
              value={marketDetails.name}
              disabled={!createNewMarket}
            ></Input>

            <Input
              label="Cidade"
              name="city"
              placeholder="Cidade"
              labelPlacement="floating"
              fill="outline"
              value={marketDetails.city}
              disabled
            />

            <Button expand="block" onClick={handleCreate}>
              Cadastrar
            </Button>
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
        <IonModal isOpen={showModal}>
          <IonHeader
            style={{
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.0)",
              padding: "5%",
            }}
          >
            <IonToolbar
              style={{
                "--background": "rgba(0,0,0,0.0)",
                "--color": "var(--ion-color-dark)",
                "--border-color": "var(--ion-color-dark)",
                "--border-radius": "4px",
                "--box-shadow": "none",
                "--align-items": "center",
                padding: "0px",
              }}
            >
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)} shape="round">
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonButton>
              </IonButtons>

            </IonToolbar>
          </IonHeader>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CreateMarket;
