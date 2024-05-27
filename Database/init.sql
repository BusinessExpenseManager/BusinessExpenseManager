CREATE TABLE "Businesses"
(
    "id"               integer PRIMARY KEY,
    "name"             nvarchar(50),
    "created_datetime" datetime
);

CREATE TABLE "Goals"
(
    "id"                  integer PRIMARY KEY,
    "name"                nvarchar(15),
    "description"         nvarchar(150),
    "goal_monetary_value" money,
    "goal_due_datetime"   datetime,
    "created_datetime"    datetime
);

CREATE TABLE "MonetaryFlows"
(
    "id"               integer PRIMARY KEY,
    "business_id"      integer,
    "goal_id"          integer,
    "category_id"      integer,
    "monetary_value"   money,
    "created_datetime" datetime
);

CREATE TABLE "Categories"
(
    "id"   integer PRIMARY KEY,
    "name" nvarchar(15)
);

CREATE TABLE "CategoryBudgets"
(
    "id"             integer PRIMARY KEY,
    "business_id"    integer,
    "category_id"    integer,
    "monthly_budget" integer
);

ALTER TABLE "MonetaryFlows"
    ADD FOREIGN KEY ("business_id") REFERENCES "Businesses" ("id");

ALTER TABLE "MonetaryFlows"
    ADD FOREIGN KEY ("goal_id") REFERENCES "Goals" ("id");

ALTER TABLE "MonetaryFlows"
    ADD FOREIGN KEY ("category_id") REFERENCES "Categories" ("id");

ALTER TABLE "CategoryBudgets"
    ADD FOREIGN KEY ("business_id") REFERENCES "Businesses" ("id");

ALTER TABLE "CategoryBudgets"
    ADD FOREIGN KEY ("category_id") REFERENCES "Categories" ("id");
