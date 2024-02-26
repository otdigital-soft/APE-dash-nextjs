# Dashboard V2

This is a repository for Dashboard V2 

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

## Installation

Clone this repo from gitlab to your local machine:

```bash
  git clone https://github.com/otdigital-soft/APE-dash-nextjs
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



## API Reference

All APIs endpoints, mutations, and types are stored in /src/restapi make sure you add a new backend integration using this folder.

