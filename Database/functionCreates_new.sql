DROP FUNCTION IF EXISTS get_monetary_categories;

--changeset ryan:ddl:createFunction:get_monetary_categories
CREATE OR REPLACE FUNCTION get_monetary_categories(cognito_identifier varchar(50), page_offset int)
    RETURNS TABLE
            (
                category_id    integer,
                name           varchar(50),
                balance        money,
                monthly_budget money
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT c.id, c.name, SUM(m.monetary_value) AS balance, b.monthly_budget
        FROM monetary_flows as m
                 INNER JOIN businesses bus on bus.id = m.business_id
                 INNER JOIN categories c on c.id = m.category_id
                 INNER JOIN category_budgets b on c.id = b.category_id
        WHERE bus.user_cognito_identifier = cognito_identifier
          AND m.created_datetime >= NOW() - interval '1 month'
          AND m.created_datetime < NOW()
        GROUP BY m.goal_id, c.name, b.monthly_budget, c.id
        OFFSET page_offset LIMIT 10;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while getting goal monetary flows: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "get_monetary_categories";