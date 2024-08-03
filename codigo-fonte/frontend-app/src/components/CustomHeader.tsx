import {
  IonHeader,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

interface HeaderProps {
  title: string;
  href?: string;
  children?: React.ReactNode;
  date?: Date;
  backButton?: boolean;
  onBackButtonClick?: () => void;
  marketName?: string;
}

const CustomHeader: React.FC<HeaderProps> = ({ 
  title,
  href,
  children,
  date,
  backButton = false,
  onBackButtonClick,
  marketName,
}) => {
  return (
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
        {href == "custom" && (
          <IonButtons slot="start">
            {children}
          </IonButtons>
        )}
        {href != "custom" && href && (
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref={href} ></IonBackButton>
          </IonButtons>
        )}
        <IonTitle
          style={{
            color: "var(--ion-color-dark)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            padding: "0px 0px",
          }}
        >
          {title}
          {marketName && (
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.8rem",
                color: "var(--ion-color-dark)",
              }}
            >
              {marketName}
            </div>
          )}
          {date && (
            <div
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.8rem",
                color: "var(--ion-color-medium)",
              }}
            >
              {date.toLocaleDateString()}
            </div>
          )}
        </IonTitle>

        {backButton && (
          <IonButton slot="start" onClick={onBackButtonClick} className="custom-back-button">
            <IonIcon icon={arrowBackOutline}></IonIcon>
          </IonButton>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default CustomHeader;
