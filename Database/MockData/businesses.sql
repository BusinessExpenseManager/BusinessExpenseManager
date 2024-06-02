--changeset karl:dml:mockData:businesses
INSERT INTO businesses (name, created_datetime, user_cognito_identifier) VALUES
('StuffNThings', '2001-10-05 10:00:47.710213', 'karl.etsebeth@bbd.co.za');
--rollback DELETE FROM "businesses";