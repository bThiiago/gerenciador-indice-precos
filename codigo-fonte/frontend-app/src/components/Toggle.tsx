import styled from "styled-components";
import { IonToggle } from "@ionic/react";

export const Toggle = styled(IonToggle)`
  margin: 4%;
  padding: 0 16px;
  height: 64px;
  border-radius: 30px;
  border-width: 0px;
  background-color: var(--ion-color-light);
  display: flex;
  --border-radius: 30px;
  --border-width: 0px;
  --box-shadow: none;
  --color: var(--ion-color-dark);
  --border-color: var(--ion-color-dark);
  --placeholder-color: var(--ion-color-dark);
  --border-style: none;
`;
