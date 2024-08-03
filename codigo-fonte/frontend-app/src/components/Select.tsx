import styled from "styled-components";
import { IonSelect } from "@ionic/react";

export const Select = styled(IonSelect)`
  width: 92%;
  margin: 4%;
  border-radius: 30px;
  border-width: 0px;
  border: 1px solid rgba(2, 52, 54, 0.08);
  overflow: hidden;
  height: 64px;
  display: flex;
  padding: 0 16px;
  bottom: 0;
  background-color: var(--ion-color-light);
  --border-radius: 30px;
  --border-width: 0px;
  --box-shadow: none;
  --color: var(--ion-color-dark);
  --border-color: var(--ion-color-dark);
  --placeholder-color: var(--ion-color-dark);
  --border-style: none;
`;
