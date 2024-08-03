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

interface ParamTypes {
    cityId: string;
}

const EditCity: React.FC = () => {
    const { cityId } = useParams<ParamTypes>();
    const [name, setName] = useState<string>("");
    const [state, setState] = useState<string>("");

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [isError, setIsError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const history = useHistory();

    const handleUpdate = async () => {
        if (!name) {
            setMessage("Por favor, insira um nome válido");
            setIsError(true);
            return;
        }

        const updateData = {
            name: name,
            state: state,
        };

        await api
            .put(`/cities/${cityId}`, updateData)
            .then(() => {
                setToastMessage("Cidade atualizada com sucesso!");
                setShowToast(true);

                setTimeout(() => {
                    document.location.reload();
                }, 1000);

                setTimeout(() => {
                    history.push("/cities");
                }, 700);
            })
            .catch((error) => {
                setMessage(error.message);
                setIsError(true);
            });
    };

    const loadCity = () => {
        api
            .get(`/cities/id/${cityId}`)
            .then((response) => {
                setName(response.data.name);
                setState(response.data.state);
            })
            .catch((error) => {
                setMessage(error.message);
                setIsError(true);
            });
    };

    useEffect(() => {
        loadCity();
    }, []);

    return (
        <IonPage>
            <IonContent fullscreen>
                <CustomHeader
                    title="Editar cidade" href="/cities" />

                <Input
                    autocapitalize="sentences"
                    type="text"
                    label="Cidade"
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
                    value={state}
                    onIonChange={(e) => setState(e.detail.value)}
                >
                    <IonSelectOption value="AC">Acre</IonSelectOption>
                    <IonSelectOption value="AL">Alagoas</IonSelectOption>
                    <IonSelectOption value="AP">Amapá</IonSelectOption>
                    <IonSelectOption value="AM">Amazonas</IonSelectOption>
                    <IonSelectOption value="BA">Bahia</IonSelectOption>
                    <IonSelectOption value="CE">Ceará</IonSelectOption>
                    <IonSelectOption value="DF">Distrito Federal</IonSelectOption>
                    <IonSelectOption value="ES">Espírito Santo</IonSelectOption>
                    <IonSelectOption value="GO">Goiás</IonSelectOption>
                    <IonSelectOption value="MA">Maranhão</IonSelectOption>
                    <IonSelectOption value="MT">Mato Grosso</IonSelectOption>
                    <IonSelectOption value="MS">Mato Grosso do Sul</IonSelectOption>
                    <IonSelectOption value="MG">Minas Gerais</IonSelectOption>
                    <IonSelectOption value="PA">Pará</IonSelectOption>
                    <IonSelectOption value="PB">Paraíba</IonSelectOption>
                    <IonSelectOption value="PR">Paraná</IonSelectOption>
                    <IonSelectOption value="PE">Pernambuco</IonSelectOption>
                    <IonSelectOption value="PI">Piauí</IonSelectOption>
                    <IonSelectOption value="RJ">Rio de Janeiro</IonSelectOption>
                    <IonSelectOption value="RN">Rio Grande do Norte</IonSelectOption>
                    <IonSelectOption value="RS">Rio Grande do Sul</IonSelectOption>
                    <IonSelectOption value="RO">Rondônia</IonSelectOption>
                    <IonSelectOption value="RR">Roraima</IonSelectOption>
                    <IonSelectOption value="SC">Santa Catarina</IonSelectOption>
                    <IonSelectOption value="SP">São Paulo</IonSelectOption>
                    <IonSelectOption value="SE">Sergipe</IonSelectOption>
                    <IonSelectOption value="TO">Tocantins</IonSelectOption>
                </Select>

                <Button expand="block" routerDirection="back" onClick={handleUpdate}>
                    Atualizar
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

export default EditCity;