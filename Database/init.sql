DROP TABLE IF EXISTS Businesses;
DROP TABLE IF EXISTS Goals;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS CategoryBudgets;
DROP TABLE IF EXISTS MonetaryFlows;

CREATE TABLE IF NOT EXISTS BusinessUser
(
    id                SERIAL PRIMARY KEY,
    uuid_from_cognito VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS Businesses
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(50),
    created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS Goals
(
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(15)  NOT NULL,
    description         VARCHAR(150) NOT NULL,
    goal_monetary_value MONEY        NOT NULL,
    goal_due_datetime   TIMESTAMP    NOT NULL,
    created_datetime    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS Categories
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL
    );

CREATE TABLE IF NOT EXISTS CategoryBudgets
(
    id             SERIAL PRIMARY KEY,
    business_id    INTEGER NOT NULL REFERENCES Businesses (id),
    category_id    INTEGER NOT NULL REFERENCES Categories (id),
    monthly_budget INTEGER NOT NULL
    );

CREATE TABLE IF NOT EXISTS MonetaryFlows
(
    id               SERIAL PRIMARY KEY,
    business_id      INTEGER   NOT NULL REFERENCES Businesses (id),
    goal_id          INTEGER   NOT NULL REFERENCES Goals (id),
    category_id      INTEGER   NOT NULL REFERENCES Categories (id),
    monetary_value   MONEY     NOT NULL,
    created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );


