--changeset karl:ddl:createTable:businesses
CREATE TABLE businesses
(
    id                      SERIAL PRIMARY KEY,
    name                    VARCHAR(50),
    created_datetime        TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_cognito_identifier VARCHAR(50) NOT NULL
);
--rollback DROP TABLE "businesses";

--changeset karl:ddl:createTable:goals
CREATE TABLE goals
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(15)  NOT NULL,
    description      VARCHAR(150) NOT NULL,
    monetary_value   MONEY        NOT NULL,
    due_datetime     TIMESTAMP    NOT NULL,
    completed        BOOLEAN      NOT NULL DEFAULT FALSE,
    created_datetime TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--rollback DROP TABLE "goals";

--changeset karl:ddl:createTable:categories
CREATE TABLE categories
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL
);
--rollback DROP TABLE "categories";

--changeset karl:ddl:createTable:category_budgets
CREATE TABLE category_budgets
(
    id             SERIAL PRIMARY KEY,
    business_id    INTEGER NOT NULL REFERENCES businesses (id),
    category_id    INTEGER NOT NULL REFERENCES categories (id),
    monthly_budget MONEY   NOT NULL
);
--rollback DROP TABLE "category_budgets";

--changeset karl:ddl:createTable:monetary_flows
CREATE TABLE monetary_flows
(
    id               SERIAL PRIMARY KEY,
    business_id      INTEGER   NOT NULL REFERENCES businesses (id),
    goal_id          INTEGER REFERENCES goals (id),
    category_id      INTEGER   NOT NULL REFERENCES categories (id),
    monetary_value   MONEY     NOT NULL,
    created_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted       BOOLEAN   NOT NULL DEFAULT FALSE
);
--rollback DROP TABLE "monetary_flows";
