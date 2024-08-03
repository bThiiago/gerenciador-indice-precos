import styled from "styled-components";
import { IonSearchbar } from "@ionic/react";

export const Search = styled(IonSearchbar)`
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  padding: 0 5%;
  --height: 40px;
  --background: var(--ion-color-light);
  --color: var(--ion-color-dark);
  --border-color: var(--ion-color-dark);
  --border-radius: 30px;
  --box-shadow: none;
  --placeholder-color: var(--ion-color-dark);
`;
