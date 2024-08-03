import styled from "styled-components";
import { IonButton } from "@ionic/react";

export const CardButton = styled(IonButton)`
  position: relative;
  margin: 5%;
  height: 100px;
  border-radius: 30px;
  --border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  --background: var(--ion-card-background);
  --background-focused: var(--ion-card-background);
  --background-hover: var(--ion-card-background);
  --background-activated: var(--ion-card-background);
`;
