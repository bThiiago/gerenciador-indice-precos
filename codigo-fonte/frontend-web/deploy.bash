rm -r build/

if [ ! -d "/usr/share/nginx/html/IndicePreco" ]; then
  echo "Pasta: /usr/share/nginx/html/IndicePreco nao existe. Criando."
  sudo mkdir /usr/share/nginx/html/IndicePreco
fi

if [ ! -d "node_modules" ]; then
   echo "Node Modules nao existe, gerando.."
   sudo yarn
fi

NODE_ENV=production yarn build

sudo rm -r /usr/share/nginx/html/IndicePreco/*

sudo cp -r build/* /usr/share/nginx/html/IndicePreco/
