# Tech Money

O *Tech Money* é uma aplicação web desenvolvida para auxiliar no controle e gerenciamento financeiro, oferecendo uma interface moderna e intuitiva para acompanhamento de despesas, receitas e análises financeiras.

## Tecnologias Utilizadas

* *Next.js 14*: Framework React moderno para desenvolvimento web
* *TypeScript*: Linguagem de programação tipada baseada em JavaScript
* *Prisma*: ORM para manipulação e interação com o banco de dados
* *Docker*: Containerização para ambiente de desenvolvimento consistente
* *PrimeReact*: Biblioteca de componentes UI rica e responsiva
* *Chart.js*: Biblioteca para criação de gráficos e visualizações de dados
* *Styled Components*: Biblioteca para estilização de componentes
* *JWT*: Autenticação e autorização de usuários

## Como Iniciar o Projeto

1. Clone o repositório:
bash
git clone [URL_DO_REPOSITÓRIO]
cd tech-money


2. Instale as dependências:
bash
npm install


3. Inicie o container Docker:
bash
docker-compose up -d


4. Execute as migrações do Prisma:
bash
npx prisma migrate dev


5. Inicie o servidor de desenvolvimento:
bash
npm run dev


6. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

* npm run dev: Inicia o servidor de desenvolvimento
* npm run build: Cria a versão de produção
* npm run start: Inicia o servidor de produção
* npm run lint: Executa a verificação de código
* npm run seed: Popula o banco de dados com dados iniciais

## Funcionalidades Principais

* *Gestão de Finanças*: Controle completo de receitas e despesas
* *Dashboards*: Visualizações gráficas e análises financeiras
* *Relatórios*: Geração de relatórios em PDF e Excel
* *Autenticação*: Sistema seguro de login e autenticação
* *Interface Responsiva*: Design adaptável para diferentes dispositivos

## Estrutura do Projeto

* /src: Código fonte principal
* /prisma: Schemas e migrações do banco de dados
* /public: Arquivos estáticos
* /components: Componentes React reutilizáveis
* /pages: Rotas e páginas da aplicação

## Requisitos do Sistema

* Node.js 18+
* Docker e Docker Compose
* NPM ou Yarn

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)
3. Commit suas mudanças (git commit -m 'Add some AmazingFeature')
4. Push para a branch (git push origin feature/AmazingFeature)
5. Abra um Pull Request

## Deploy

O projeto pode ser facilmente implantado na [Vercel](https://vercel.com), plataforma otimizada para aplicações Next.js. Para outras opções de deploy, consulte a [documentação oficial do Next.js](https://nextjs.org/docs/deployment).

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.