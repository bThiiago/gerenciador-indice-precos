import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { useAuth } from './hooks/auth';
import { IonReactRouter } from '@ionic/react-router';
import {
  albumsOutline,
  bagHandleOutline,
  businessOutline,
  cartOutline,
  personCircleOutline,
  searchOutline,
} from 'ionicons/icons';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import './theme/variables.css';
import './theme/tabbar.css';

import Categories from './pages/categories/list/Index';
import CreateCategory from './pages/categories/create/Index';
import EditCategory from './pages/categories/edit/Index';

import Cities from './pages/cities/list/Index';
import CreateCities from './pages/cities/create/Index';
import EditCity from './pages/cities/edit/Index';

import Markets from './pages/markets/list/Index';
import CreateMarket from './pages/markets/create/Index';
import EditMarket from './pages/markets/edit/Index';

import Products from './pages/products/list/Index';
import CreateProduct from './pages/products/create/Index';
import EditProduct from './pages/products/edit/Index';

import Login from './pages/login/Index';
import Account from './pages/accounts/Index';
import CreateAccount from './pages/accounts/create/Index';
import ManageAccount from './pages/accounts/manage/Index';
import EditAccount from './pages/accounts/edit/Index';

import Researches from './pages/researches/list/Index';
import CreateResearch from './pages/researches/create/Index';
import EditResearch from './pages/researches/edit/Index';
import ListToday from './pages/researches/listToday/Index';

setupIonicReact();

const App: React.FC = () => {
  const { user } = useAuth();

  // eslint-disable-next-line
  const [themeToggle, setThemeToggle] = useState<boolean>(localStorage.getItem('@ipjr:darkMode') === 'false');

  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);
  };

  const initializeDarkTheme = () => {
    const isDark = localStorage.getItem('@ipjr:darkMode') === 'true' ? true : false;
    setThemeToggle(isDark);
    toggleDarkTheme(isDark);
  };

  useEffect(() => {
    initializeDarkTheme();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route
          exact
          path="/login"
          render={() => {
            if (user) {
              return <Redirect to="/researches" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        <Route
          exact
          path="/"
          render={() => {
            if (user) {
              return <Redirect to="/researches" />;
            }
            return <Redirect to="/login" />;
          }}
        />
        {user ? (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/researches">
                <Researches />
              </Route>
              <Route exact path="/researches/create">
                <CreateResearch />
              </Route>
              <Route exact path="/researches/edit/:researchId">
                <EditResearch />
              </Route>
              <Route exact path="/researches/listToday">
                <ListToday />
              </Route>
              <Route exact path="/account">
                <Account />
              </Route>
              <Route exact path="/account/manage">
                <ManageAccount />
              </Route>
              <Route exact path="/account/manage/create">
                <CreateAccount />
              </Route>
              <Route exact path="/account/manage/edit/:userId">
                <EditAccount />
              </Route>
              <Route exact path="/products">
                <Products />
              </Route>
              <Route exact path="/products/create">
                <CreateProduct />
              </Route>
              <Route exact path="/products/edit/:productId">
                <EditProduct />
              </Route>
              <Route exact path="/categories">
                <Categories />
              </Route>
              <Route exact path="/categories/create">
                <CreateCategory />
              </Route>
              <Route exact path="/categories/edit/:categoryId">
                <EditCategory />
              </Route>
              <Route exact path="/markets">
                <Markets />
              </Route>
              <Route exact path="/markets/create">
                <CreateMarket />
              </Route>
              <Route exact path="/markets/edit/:marketId">
                <EditMarket />
              </Route>
              <Route exact path="/cities">
                <Cities />
              </Route>
              <Route exact path="/cities/create">
                <CreateCities />
              </Route>
              <Route exact path="/cities/edit/:cityId">
                <EditCity />
              </Route>
            </IonRouterOutlet>
            {user.level === 9 ? (
              <IonTabBar slot="bottom">
                <IonTabButton tab="research" href="/researches">
                  <IonIcon aria-hidden="true" icon={searchOutline} />
                  <IonLabel>Pesquisa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="products" href="/products">
                  <IonIcon aria-hidden="true" icon={bagHandleOutline} />
                  <IonLabel>Produtos</IonLabel>
                </IonTabButton>
                <IonTabButton tab="categories" href="/categories">
                  <IonIcon aria-hidden="true" icon={albumsOutline} />
                  <IonLabel>Categorias</IonLabel>
                </IonTabButton>
                <IonTabButton tab="markets" href="/markets">
                  <IonIcon aria-hidden="true" icon={cartOutline} />
                  <IonLabel>Mercados</IonLabel>
                </IonTabButton>
                <IonTabButton tab="cities" href="/cities">
                  <IonIcon aria-hidden="true" icon={businessOutline} />
                  <IonLabel>Cidades</IonLabel>
                </IonTabButton>
                <IonTabButton tab="account" href="/account">
                  <IonIcon aria-hidden="true" icon={personCircleOutline} />
                  <IonLabel>Conta</IonLabel>
                </IonTabButton>
              </IonTabBar>
            ) : (
              user.level === 1 && (
                <IonTabBar slot="bottom">
                  <IonTabButton tab="research" href="/researches">
                    <IonIcon aria-hidden="true" icon={searchOutline} />
                    <IonLabel>Pesquisa</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="account" href="/account">
                    <IonIcon aria-hidden="true" icon={personCircleOutline} />
                    <IonLabel>Conta</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              )
            )}
          </IonTabs>
        ) : (
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
            </Route>
            <Redirect to="/login" />
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
