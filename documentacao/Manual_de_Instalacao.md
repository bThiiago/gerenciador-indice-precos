# Manual de instalação

Neste manual, é necessário possuir acesso às permissões de gerenciamento do repositório Git onde o código-fonte está armazenado. Isso se deve ao fato de que as restrições relacionadas ao acesso de repositórios no Github são realizados apenas via SSH.

## Acesso ao código fonte

No momento da escrita deste manual de instalação (09/11/2023), o repositório com o código fonte do sistema pode ser acessado pela URL https://github.com/Fabrica-de-Software-Academica-IFSP-PEP/gerenciador-indice-precos caso seu usuário do Github possui as devidas permissões a organização/repositório.

Observação: Não copie o $, ele só indica que é um comando a ser digitado no terminal.

1. Logado no sistema, devemos primeiramente garantir que algumas coisas estão instaladas, para isso é possível utilizar o segundo comando caso esteja utilizando o sistema operacional Ubuntu.

```sh
$ sudo apt install git
> Saída do processo de instalação
[Pressionar Y e enter para confirmar a instalação]
```

2. Gerar uma chave ssh

   ```bash
   $ ssh-keygen -t ed25519 -C "{email}"
   > Generating public/private algorithm key pair.
   > Enter a file in which to save the key (/home/you/.ssh/algorithm): [Pressionar enter]
   > Enter passphrase (empty for no passphrase): [Digite uma senha]
   > Enter same passphrase again: [Digite uma senha]
   ```

   - Ao requerer um local para inserir o arquivo, deve apenas apertar enter
   - Então caso deseje, pode digitar uma senha e confirmala ou apenas apertar enter para deixar sem nenhuma senha

3. Iniciar o `ssh-agent` em segundo plano

   ```bash
   $ eval "$(ssh-agent -s)"
   > Agent pid 59566
   ```

4. Adicionar a chave SSH privada, em casos de ter criado com um nome diferente, deve substituir `IPJR` no comando com o nome da chave.

   ```bash
   $ ssh-add ~/.ssh/IPJR
   ```

5. Copiar a chave pública localizada em `~/.ssh/IPJR.pub`. (Pode ser feito usando um `cat ~/.ssh/IPJR.pub` e copiando a saida do comando)

   - **LEMBRE DE COPIAR A CHAVE PÚBLICA (ARQUIVO QUE TERMINA COM `.PUB`)**

   <div style="page-break-after: always;"></div>

6. Com a chave SSH gerada, deve-se realizar o seu cadastro no Github, para isso siga a sequencia de passos demonstrada na imagem a seguir:

   ![deploy_key](./Imagens/deploy_key.png)

7. Nesta segunda página, deve se preenchar as informações da seguinte maneira:

   ![add_new_key](./Imagens/add_new_key.png)

8. Após preencher as informações, a chave ssh pode ser adicionada apenas ao clicar no botão verte `Add key`, ou em português `Adicionar chave`

<div style="page-break-after: always;"></div>

Apartir deste momento, já deve ser possível realizar o clone do projeto no servidor através do comando abaixo

```bash
$ git clone git@github.com:Fabrica-de-Software-Academica-IFSP-PEP/gerenciador-indice-precos.git
ou
$ git clone {urlSSH}
> Cloning into 'gerenciador-indice-precos'...
> The authenticity of host 'github.com (20.201.28.151)' can't be established.
> ECDSA key fingerprint is SHA256:p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM.
> Are you sure you want to continue connecting (yes/no/[fingerprint])? [Digitar yes]
Warning: Permanently added 'github.com,20.201.28.151' (ECDSA) to the list of known hosts.
> remote: Enumerating objects: 12245, done.
> emote: Counting objects: 100% (5847/5847), done.
> remote: Compressing objects: 100% (2737/2737), done.
> remote: Total 12245 (delta 3671), reused 4641 (delta 2678), pack-reused 6398
> Receiving objects: 100% (12245/12245), 9.40 MiB | 4.42 MiB/s, done.
> Resolving deltas: 100% (7578/7578), done.
```

### Node.js

No momento de escrita deste manual (17/09/2023), estamos utilizando o Node.js na sua versão LTS (_Long Term Support_) que é a `18.17.1 LTS`.
O único problema é que o servidor do IFSP está desatualizado, então qualquer pacote do yarn que precise do Node.js acima da versão 16 não irá funcionar.
Observação: É possível colar todos os comandos de uma vez no terminal.

1. Download e importação da Nodesource GPG key

```sh
$ sudo apt-get update
$ sudo apt-get install -y ca-certificates curl gnupg
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
```

2. Criar o repositório deb

```sh
$ echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg arch=amd64] https://deb.nodesource.com/node_18.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
```

3. Execute Update e Install

```sh
$ sudo apt-get update
$ sudo apt-get install nodejs -y
$ sudo npm i -g @ionic/cli yarn
```

4. Instalação das dependencias (Não use npm)

```sh
$ cd ~/gerenciador-indice-precos/codigo-fonte
$ ls
> backend/  frontend-app/  frontend-web/
$ cd backend/
$ yarn
> yarn install v1.22.19
$ cd ../frontend-app
$ yarn
> yarn install v1.22.19
$ cd ../frontend-web
$ yarn
> yarn install v1.22.19
```

### Docker e PostgreSQL

#### Instalação do Docker

```sh
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
$ echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
$ sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
$ sudo usermod -aG docker "$(whoami)"
```

#### Instalação do PostgreSQL

1. Crie o arquivo yml docker-compose.yaml na raiz do diretorio backend

```sh
version: "3.7"

services:
  database_ipjr:
    image: postgres
    container_name: database-ipjr
    restart: always
    ports:
      - 5431:5432
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=database_ipjr
    volumes:
      - pgdata:/data/postgres

volumes:
  pgdata:
    driver: local
```

2. Execute o docker-compose no diretorio raiz do backend

```sh
$ docker-compose up
```

3. Saida no terminal

```sh
[+] Building 0.0s (0/0)                                                                            docker:default
[+] Running 1/0
 ✔ Container database-ipjr  Created                                                                          0.1s
Attaching to database-ipjr
database-ipjr  | The files belonging to this database system will be owned by user "postgres".
database-ipjr  | This user must also own the server process.
....
database-ipjr  | PostgreSQL init process complete; ready for start up.
database-ipjr  |
database-ipjr  | 2023-11-09 15:49:58.009 UTC [1] LOG:  starting PostgreSQL 16.0 (Debian 16.0-1.pgdg120+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 12.2.0-14) 12.2.0, 64-bit
database-ipjr  | 2023-11-09 15:49:58.009 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
database-ipjr  | 2023-11-09 15:49:58.009 UTC [1] LOG:  listening on IPv6 address "::", port 5432
database-ipjr  | 2023-11-09 15:49:58.014 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
database-ipjr  | 2023-11-09 15:49:58.020 UTC [64] LOG:  database system was shut down at 2023-11-09 15:49:57 UTC
database-ipjr  | 2023-11-09 15:49:58.025 UTC [1] LOG:  database system is ready to accept connections
^CGracefully stopping... (press Ctrl+C again to force)
Aborting on container exit...
[+] Stopping 1/1
 ✔ Container database-ipjr  Stopped                                                                          0.2s
canceled
```

Apos rodar o comando docker-compose, será exibido uma mensagem "database system is ready to accept connections". após isso pressione Ctrl+C para sair do log

3. Execute o seguinte comando para iniciar o container.

```sh
$ docker start database-ipjr
```

Alguns utilitarios

```sh
$ docker ps # Lista os containers em execução
$ docker ps --all # Lista todos os containers existentes
$ docker start database-ipjr # Inicia o PostgresSQL
$ docker stop database-ipjr # Para a execução do PostgresSQL
```

### Configuração do Sistema

#### Backend

Variáveis de ambiente que esta em uso atualmente para conexão no banco:

```sh
$ nano backend/.env
```

```sh
DATABASE_URL=postgres://docker:docker@localhost:5431/database_ipjr

NODE_ENV=development
SYNCHRONIZE_DB=true
DATABASE_USERNAME=docker
DATABASE_PASSWORD=docker
DATABASE_PORT=5431

JWT=02cd8a64aec17289151adef169db16bd

ROOTPATH=/api/
```

#### Frontend (Web e App)

Variáveis de ambiente para o react:

```sh
$ nano frontend/.env
```

```sh
PUBLIC_URL=http://ipjr.pep2.ifsp.edu.br
REACT_APP_API_URL=http://ipjr.pep2.ifsp.edu.br/api

# rodar localmente
REACT_APP_API_LOCAL_URL='http://localhost:3339/api'
```

#### Aplicativo

Para instalar a ultima versão disponivel do aplicativo é só acessar a documentação do projeto.
AVISO: PODE SER QUE SEU CELULAR BLOQUEIE A INSTALAÇÃO POR CAUSA DO PLAY PROTECT OU PELA VERSÃO DO ANDROID SER MENOR DO QUE 10.
CASO O MOTIVO SEJA O PLAY PROTECT, NORMALMENTE TEM UM BOTÃO ESCRITO "MAIS INFORMAÇÕES" OU "SAIBA MAIS", E ENTÃO VAI APARECER "INSTALAR MESMO ASSIM":

![aplicativo](Arquivos/IPJR-2023.apk)


Caso o aplicativo precise ser modificado, é ABSOLUTAMENTE NECESSÁRIO seguir esses passos:

Após a atualização do código fonte, rode esses comandos:

```sh
$ npx cap add android
$ npx cap sync
$ ionic capacitor build android --prod
$ yarn build
```

modifique o arquivo:

android/app/src/main/AndroidManifest.xml

```
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:tools="http://schemas.android.com/tools"
    xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true"
        tools:targetApi="m">

        <meta-data android:name="com.google.mlkit.vision.DEPENDENCIES" android:value="barcode_ui"/>

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>

    <!-- Permissions -->

    <uses-permission android:name="android.permission.INTERNET"
        tools:ignore="ManifestOrder" />

    <uses-permission android:name="android.permission.CAMERA"
        tools:ignore="PermissionImpliesUnsupportedChromeOsHardware" />

    <uses-permission android:name="android.permission.FLASHLIGHT"/>
</manifest>

```

#### Servidor do IFSP

Senha para dar git pull: ProjetoIntegrado2023

##### Backend

Entrar na pasta do backend e rodar:

```sh
$ yarn createdb
```

```sh
$ yarn seed
```

```sh
$ yarn dev
```

Para rodar o backend no servidor:
```sh
$ yarn pm2 restart 0
```

##### Frontend-web

Entrar na pasta do frontend-web e rodar:

```sh
$ sudo ./deploy.bash
```
