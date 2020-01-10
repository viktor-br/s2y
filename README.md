# s2y

## Intro
Messenger for one person -- socializing for an introvert. App consists of two parts: client (React) and server (Apollo GraphQL server). Google Signin is used for authentication.

## Development
* Run dev env:
  ```bash
  docker-compose up -d
  ```
* Upload structure to docker container from ./db/dump.sql
* and go to http://localhost/login

GraphQL playground is available on http://localhost/graphql

### Kubernetes in minikube
All commands needs to be moved to a build tool.

#### Build client (nginx with react) docker image
* Run from client folder
  ```bash
  REACT_APP_SEND2YOURSELF_WS_URI=... REACT_APP_SEND2YOURSELF_URI=... REACT_APP_GOOGLE_SIGNIN_CLIENT_ID=... npm run build
  ```
* Run from project root folder:
  ```bash
  docker build \
    --build-arg S2Y_CLIENT_BUILD_FOLDER=client/build/ \
    --build-arg S2Y_CLIENT_VERSION=v2 \
    --build-arg S2Y_CLIENT_NGINX_CONF=infrastructure/docker/prod/client/nginx/conf.d/ \
    -t goon/s2y-client:v2 \
    -f infrastructure/docker/prod/client/Dockerfile .
  ```

#### Build server docker image
* Copy files to build folder:
  ```bash
  rm -rf server/build/*
  cp -R server/src server/build/src
  cp server/package.json server/build/package.json
  cp server/package-lock.json server/build/package-lock.json
  ```
* Run from project root folder:
  ```bash
  docker build \
    --build-arg S2Y_SERVER_BUILD_FOLDER=server/build \
    --build-arg S2Y_SERVER_VERSION=v2 \
    -t goon/s2y-server:v2 \
    -f infrastructure/docker/prod/server/Dockerfile .
  ```

#### Deployment
* create secret
  ```bash
  kubectl create secret generic s2y-server-secrets \
    --from-literal=db-username=... \
    --from-literal=db-password=... \
    --from-literal=google-signin-client-id=... \
    --from-literal=session-secret=... 
  ```
* create configmap for client config
  ```bash
  kubectl create configmap s2y-client-config-configmap --from-file infrastructure/k8s/dev/default.conf
  ```
* Run volume creation commands:
  ```bash
  kubectl create -f infrastructure/k8s/dev/s2y-db-volume-dev.yml
  kubectl create -f infrastructure/k8s/dev/s2y-db-volume-claim-dev.yml
  kubectl create -f infrastructure/k8s/dev/s2y-kv-volume-dev.yml
  kubectl create -f infrastructure/k8s/dev/s2y-kv-volume-claim-dev.yml
  ```
* Run create commands:
  ```bash
  kubectl create -f infrastructure/k8s/dev/s2y-db.yml
  kubectl create -f infrastructure/k8s/dev/s2y-db-service.yml
  kubectl create -f infrastructure/k8s/dev/s2y-kv.yml
  kubectl create -f infrastructure/k8s/dev/s2y-kv-service.yml
  kubectl create -f infrastructure/k8s/dev/s2y-server-configmap.yml
  kubectl create -f infrastructure/k8s/dev/s2y-server-deployment.yml
  kubectl create -f infrastructure/k8s/dev/s2y-server-service.yml
  kubectl create -f infrastructure/k8s/dev/s2y-client-deployment.yml
  kubectl create -f infrastructure/k8s/dev/s2y-client-service.yml
  ```
  
* create db:
  ```bash
  kubectl exec -it s2y-db-... bash
  ```
  
* forward port to be able to access app on localhost (sudo is required by limitation to expose ports 80, 443)
  ```bash
  sudo kubectl port-forward svc/s2y-client-service 80
  ```