--changeset karl:dml:mockData:categories
INSERT INTO categories (name) VALUES
('Transport'),
('Interest'),
('Savings'),
('Investments'),
('Stock'),
('Salaries'),
('Food'),
('Insurance'),
('Utilities'),
('Training'),
('Sales'),
('Sundry');
--rollback DELETE FROM "categories";