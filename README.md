
## 🚀 Inicialização do Projeto

Siga os passos abaixo para configurar e iniciar o projeto:


1. **🔧 Configurar variáveis de ambiente**
  - Na pasta raiz do projeto, copie o arquivo de exemplo para criar seu `.env`:
    ```bash
    cp .env.example .env
    ```
  - Para a API, copie o arquivo de exemplo para a pasta correspondente:
    ```bash
    cp api/.env.example api/.env
    ```

2. **🐳 Iniciar os serviços com Docker Compose**
  ```bash
  docker compose up -d
  ```

✅ Pronto! Os serviços serão inicializados automaticamente nos containers.

Se você não alterou nada nos arquivos `.env`, os serviços estarão disponíveis nas seguintes URLs:

- **API:** [http://localhost:3333/api](http://localhost:3333/api)
- **Front-end:** [http://localhost:4200/](http://localhost:4200/)
