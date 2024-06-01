--changeset karl:dml:mockData:category_budgets
INSERT INTO category_budgets (business_id, category_id, monthly_budget) VALUES
(1, 1, 5000),
(1, 3, 10000),
(1, 5, 120000),
(1, 7, 400),
(1, 11, 180000);
--rollback DELETE FROM "category_budgets";