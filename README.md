# BusinessExpenseManager

# Setup Guide

## Introduction

This guide provides step-by-step instructions for downloading and running a MonoRepo using Docker Compose from the main
folder. Follow these instructions to set up your development environment quickly and efficiently.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Cloning the Repository

First, clone the MonoRepo to your local machine. Open a terminal and execute the following command:

```sh
git clone https://github.com/BusinessExpenseManager/BusinessExpenseManager
```

## Environment variables

The following values need to be set for local dev:
 - /Frontend/business-expense-manager/environment.ts
```
apiUrl: 'http://localhost:5000'
authorizationUrl: 'https://business-expense-manager.auth.eu-west-1.amazoncognito.com/oauth2/authorize?client_id=7g2q9pb8e9ro0bb1hpp8vc0i4n&response_type=token&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost:4200'
```
 - /Backend/Program.cs
```
// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("OurCors", builder =>
    {
        builder.WithOrigins(["http://localhost:4200"])
            .WithHeaders(["Content-Type", "Authorization"])
            .WithMethods([HttpMethods.Get, HttpMethods.Post, HttpMethods.Delete, HttpMethods.Options]).Build();
    });
});
```
 - /Frontend/business-expense-manager/src/index.html
```
connect-src 'self' http://localhost:5000 https://fonts.googleapis.com/ https://fonts.gstatic.com/"
```

## Running docker-compose
If you prefer to run the containers in detached mode (in the background), use the -d flag:
```sh
docker-compose up -d
```
This should run the DB, perform a DB migration, run the backend, and run the frontend. The frontend is run on localhost:4200 with the backend on localhost:5000. The DB runs on port 5432 with
```
POSTGRES_DB: bem
POSTGRES_USER: admin
POSTGRES_PASSWORD: pass
```

If the frontend container does not run, navigate to /Frontend/business-expense-manager and run 
```sh
npm start
```

### Stopping the Application
To stop the running containers, use the following command:

```sh 
docker-compose down
```

