# HUSL Dashboard V2

This is a repository for HUSL Dashboard V2 (my.husl.xyz)

## Prerequisites

- NodeJS >16
- PNPM as Package Manager

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. Alternatively, you can see the .env.example file

`NEXTAUTH_SECRET`

`APP_URL`

`NEXTAUTH_URL`

`API_URL`

`CRM_API_URL`

`WEBHUSL_API_MASTER_KEY`

`WEBHUSL_API_URL`

## Installation

Clone this repo from gitlab to your local machine:

```bash
  git clone https://gitlab.com/kysliakpavlo/dash-v2.git
```

Install dependencies:

```bash
  pnpm install
```

Run local server:

```bash
  pnpm dev
```

The server will running at port 3000 by default.

## Local Development

To setup this project to running locally, you need to define the project backend url, you can ask colleagues the backend url or you could just run the backend project locally. ([HUSL Backend](https://gitlab.com/husl-nft/backend))

Once you setting up the backend, you will need to gain JWT Token to be able to login using 'user' account, please follow these following steps:

- Go to [Admin dashboard](https://app.husl.xyz/admin)
- Login using admin account, please ask colleagues for access
- In 'Account List' table, there will be a list of users, you can use your created account or a business account, then click on the Login button (2nd icon on the right)
- You will be redirected to my.husl.xyz/auth/token=***, **quickly** copy the token from the address bar
- Change my.husl.xyz to your local server url, eg. localhost:3000/auth/token=***
- You will be logged in using an existing account

Please be **aware** if you choose a business, the data is a production data, changing it might affect business's data, make sure you revert the changes if you want to only test it.

## API Reference

All APIs endpoints, mutations, and types are stored in /src/restapi make sure you add a new backend integration using this folder.

APIs will be handle by backend. You can see see this [Postman Collection](https://api.postman.com/collections/4820221-dfcb53cb-5f24-4983-85eb-8585838dbd22?access_key=PMAT-01H9JTMGRCGD323EGGHXDMG4D9) for more about the API References.
