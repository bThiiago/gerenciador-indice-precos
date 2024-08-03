import styled from "styled-components";
import { IonInput } from "@ionic/react";
import "./Input.css";

export const Input = styled(IonInput)`
  width: 92%;
  margin: 4%;
  height: 64px;
  border-radius: 30px;
  border-width: 0px;
  background-color: var(--ion-color-light);
  --border-radius: 30px;
  --border-width: 0px;
  --box-shadow: none;
  --color: var(--ion-color-dark);
  --border-color: var(--ion-color-dark);
  --placeholder-color: var(--ion-color-dark);
  --border-style: none;
`;
