--changeset karl:dml:mockData:goals
INSERT INTO goals (name, description, monetary_value, due_datetime, created_datetime) VALUES
('Dishwaser', 'Save time and will to live', 10000.69, '2024-10-05 10:00:00.0', '2024-06-01 10:00:00.0'),
('Stuff', 'Reasons', 200, '2027-01-01 01:00:00.0', '2024-05-01 10:00:00.0');
--rollback DELETE FROM "goals";