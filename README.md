# BusinessExpenseManager

Stuff

# Setup Guide

## Introduction

This guide provides step-by-step instructions for downloading and running a MonoRepo using Docker Compose from the main
folder. Follow these instructions to set up your development environment quickly and efficiently.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/prebuilt-installer) - latest LTS ed. with OS.
- Angular CLI globally by default ( ```npm install -g @angular/cli```)

## Cloning the Repository

First, clone the MonoRepo to your local machine. Open a terminal and execute the following command:

```sh
git clone https://github.com/BusinessExpenseManager/BusinessExpenseManager
```

## Navigating to the Main Folder

Once the repository is cloned, navigate to the main folder:

```sh
cd BusinessExpenseManager
```

## Running the frontend Angular application

To start the frontend locally, navigate to ./Frontend/business-expense-manager and run

```npm start```

This is similar to running

```ng serve```

## 

## Running the Application with Docker Compose

To start the application using Docker Compose, run the following command:

```sh
docker-compose up
```

### Running in Detached Mode
If you prefer to run the containers in detached mode (in the background), use the -d flag:
```sh
docker-compose up -d
```
### Stopping the Application
To stop the running containers, use the following command:

```sh 
docker-compose down
```

