--changeset karl:dml:mockData:monetary_flows
INSERT INTO monetary_flows (business_id, goal_id, category_id, monetary_value, created_datetime) VALUES
(1, 1, 3, 2000, '2024-04-06 15:23:54.918922'),
(1, 1, 3, -1000, '2024-04-07 15:23:54.918922'),
(1, NULL, 7, 1000, '2024-04-07 15:23:54.918922'),
(1, 2, 4, 300, '2024-05-07 15:23:54.918922');
--rollback DELETE FROM "monetary_flows";