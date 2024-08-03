import { IonContent, IonPage, IonSelectOption, IonToast } from "@ionic/react";
import React, { useState } from "react";
import { IonAlert } from "@ionic/react";
import "./Index.css";
import CustomHeader from "../../../components/CustomHeader";
import { api } from "../../../services/axios";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { checkmarkDoneCircleOutline } from "ionicons/icons";
import { Select } from "../../../components/Select";
import { useHistory } from "react-router";

const CreateAccount: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [level, setLevel] = useState<number>(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const history = useHistory();

  const handleCreate = async () => {
    if (!name) {
      setMessage("Nome do usuário não informado. Insira o nome do usuário para continuidade!");
      setIserror(true);
      return;
    }

    const createData = {
      name: name,
      password: password,
      level: level,
    };

    await api
      .post("/users", createData)
      .then(() => {
        setToastMessage("Usuário cadastrado com sucesso.");
        setShowToast(true);

        setTimeout(() => {
          history.push("/account/manage");
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
        <CustomHeader title="Cadastrar usuário" href="/account/manage" />

        <Input
          autocapitalize="sentences"
          type="text"
          label="Nome do usuário"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite o nome do usuário"
          value={name}
          onIonInput={(e) => setName(e.detail.value!)}
        ></Input>

        <Input
          type="password"
          label="Nova senha"
          labelPlacement="floating"
          fill="outline"
          placeholder="Digite a nova senha do usuário"
          value={password}
          onIonInput={(e) => setPassword(e.detail.value!)}
        ></Input>

        <Select
          label="Nivel de acesso"
          name="level"
          value={level}
          onIonChange={(e) => setLevel(e.detail.value!)}
          labelPlacement="floating"
        >
          <IonSelectOption value={1}>Membro da equipe</IonSelectOption>
          <IonSelectOption value={9}>Administrador</IonSelectOption>
        </Select>

        <Button expand="block" onClick={handleCreate}>
          Cadastrar
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

export default CreateAccount;
