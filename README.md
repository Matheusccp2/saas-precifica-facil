# PrecificaFácil - SaaS de Precificação Inteligente

O **PrecificaFácil** é uma plataforma SaaS (Software as a Service) desenvolvida para ajudar lojistas e empreendedores a calcularem o preço de venda ideal para seus produtos, garantindo uma margem de lucro saudável.

🔗 **Status do Projeto**: Em desenvolvimento

---

## 🚀 Funcionalidades Principais

- **Calculadora de Precificação Inteligente**: Calcule o preço de venda final levando em consideração custo do produto, impostos, taxas da maquininha de cartão e outras despesas variáveis.
- **Painel Administrativo (Dashboard)**: Acompanhe as principais métricas do negócio e obtenha uma visão clara (Curva ABC) dos produtos mais lucrativos.
- **Autenticação Segura**: Login e Cadastro gerenciados pelo **Firebase Authentication**, garantindo proteção e envio automático de e-mail de verificação.
- **Gestão de Perfil**: Os lojistas não ativados inicialmente são encaminhados para a tela de "Aguardando Ativação", onde aguardam liberação via o Dashboard.
- **Design Responsivo e Moderno**: Interface construída com **Tailwind CSS** para máxima flexibilidade em todas as telas (Celulares, Tablets e Desktops).

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza ferramentas modernas do ecossistema React:

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server e Client Components)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/) (Acessibilidade) + [Lucide React](https://lucide.dev/) (Ícones)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Gerenciamento de Formulários**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validação de schemas)
- **Backend & Banco de Dados**: [Firebase](https://firebase.google.com/) (Authentication, Firestore Database e Hosting/Functions aplicáveis)
- **Avisos UI**: [Sonner](https://sonner.emilkowal.ski/) (Toasts elegantes)

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para testar a plataforma no seu ambiente de desenvolvimento.

### 1. Clonar o repositório

```bash
git clone https://github.com/Matheusccp2/saas-precifica-facil.git
cd saas-precifica-facil
```

### 2. Instalar as dependências

Você pode usar o gerenciador de pacotes de sua preferência (`npm`, `yarn`, `pnpm`, ou `bun`):

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` ou `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase (ver `lib/firebase.ts` se aplicável):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a Landing Page e testar a aplicação.

---

## 🔒 Regras de Negócio e Lógica de Auth

1. **Visitantes** caem na página inicial (Landing Page), onde percebem o valor da calculadora inteligente.
2. Ao clicar em **Criar Conta / Adquirir Plano**, registram-se e a conta é submetida ao Firebase.
3. Um e-mail de verificação é enviado automaticamente. Mesmo se falhar, o cadastro no Firestore não é interrompido.
4. Após criar a conta, o usuário é redirecionado para a tela `/aguardando-ativacao` e só ganha acesso integral ao Dashboard quando a propriedade `isActive` em seu Firestore doc for definida como `true`.

---

## 🤝 Contribuições

Este repositório é restrito, mas caso tenha recebido acesso, sinta-se à vontade para documentar issues, relatar bugs ou abrir [Pull Requests](https://github.com/Matheusccp2/saas-precifica-facil) na respectiva branch.
