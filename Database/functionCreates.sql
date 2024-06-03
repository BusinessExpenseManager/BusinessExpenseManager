--changeset ryan:ddl:createFunction:add_new_monetary_flow
CREATE OR REPLACE FUNCTION add_new_monetary_flow(
    cognito_identifier varchar(50),
    goal_id integer,
    category_id integer,
    monetary_value money
)
    RETURNS int AS
$$
DECLARE
    business_id          int;
    new_monetary_flow_id int;
BEGIN
    SELECT id INTO business_id FROM businesses WHERE user_cognito_identifier = cognito_identifier;
    INSERT INTO monetary_flows (business_id, goal_id, category_id, monetary_value)
    VALUES (business_id, goal_id, category_id, monetary_value)
    RETURNING id INTO new_monetary_flow_id;
    RETURN new_monetary_flow_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while adding the monetary flow: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "add_new_monetary_flow";

--changeset ryan:ddl:createFunction:delete_monetary_flow
CREATE OR REPLACE FUNCTION delete_monetary_flow(
    cognito_identifier varchar(50),
    flow_id integer
)
    RETURNS int AS
$$
DECLARE
    user_business_id         int;
    removed_monetary_flow_id int;
BEGIN
    SELECT id INTO user_business_id FROM businesses WHERE user_cognito_identifier = cognito_identifier;
    UPDATE monetary_flows
    SET is_deleted = TRUE
    WHERE business_id = user_business_id
      AND id = flow_id
    RETURNING id INTO removed_monetary_flow_id;

    RETURN removed_monetary_flow_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while removing monetary flow: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "delete_monetary_flow";

--changeset ryan:ddl:createFunction:retrieve_monetary_flows
CREATE OR REPLACE FUNCTION retrieve_monetary_flows(
    cognito_identifier varchar(50),
    page_offset integer)
    RETURNS TABLE
            (
                flow_id          int,
                goal_name        varchar,
                category_name    varchar,
                monetary_value   money,
                created_datetime timestamp
            )
AS
$$
DECLARE
    user_business_id int;
BEGIN
    SELECT id INTO user_business_id FROM businesses WHERE user_cognito_identifier = cognito_identifier;
    RETURN QUERY
        SELECT monetary_flows.id,
               goals.name      AS goal_name,
               categories.name AS category_name,
               monetary_flows.monetary_value,
               monetary_flows.created_datetime
        FROM monetary_flows
                 JOIN goals ON monetary_flows.goal_id = goals.id
                 JOIN categories ON monetary_flows.category_id = categories.id
        WHERE business_id = user_business_id
          AND is_deleted = false
        OFFSET page_offset LIMIT 10;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while retrieving the monetary flows: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "retrieve_monetary_flows";


--changeset ryan:ddl:createFunction:get_or_create_business
CREATE OR REPLACE FUNCTION get_or_create_business(cognito_identifier varchar(50), business_name varchar(50))
    RETURNS int AS
$$
DECLARE
    business_id int;
BEGIN
    SELECT id INTO business_id FROM businesses WHERE user_cognito_identifier = cognito_identifier;
    IF NOT FOUND THEN
        INSERT INTO businesses (user_cognito_identifier, name)
        VALUES (cognito_identifier, business_name)
        RETURNING id INTO business_id;
    END IF;
    RETURN business_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while getting or creating the business: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "get_or_create_business";

--changeset ryan:ddl:createFunction:get_monetary_categories
CREATE OR REPLACE FUNCTION get_monetary_categories(cognito_identifier varchar(50), page_offset int)
    RETURNS TABLE
            (
                name           varchar(50),
                balance        money,
                monthly_budget money
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT c.name, SUM(m.monetary_value) AS balance, b.monthly_budget
        FROM monetary_flows as m
                 INNER JOIN businesses b on b.id = m.business_id
                 INNER JOIN categories c on c.id = m.category_id
                 INNER JOIN category_budgets b on c.id = b.category_id
        WHERE b.user_cognito_identifier = cognito_identifier
          AND m.created_datetime >= NOW() - interval '1 month'
          AND m.created_datetime < NOW()
        GROUP BY m.goal_id, c.name, b.monthly_budget
        OFFSET page_offset LIMIT 10;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while getting goal monetary flows: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
--rollback DROP FUNCTION "get_monetary_categories";

--changeset ryan:ddl:createFunction:get_monetary_goals
CREATE OR REPLACE FUNCTION get_monetary_goals(cognito_identifier varchar(50), page_offset int)
    RETURNS TABLE
            (
                goal_id        integer,
                name           varchar(50),
                monetary_value money,
                goal_value     money
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT g.id, g.name, SUM(m.monetary_value), g.monetary_value
        FROM monetary_flows as m
                 INNER JOIN public.goals g on g.id = m.goal_id
                 INNER JOIN businesses b on b.id = m.business_id
        WHERE b.user_cognito_identifier = cognito_identifier
        GROUP BY m.goal_id, g.name, g.monetary_value, g.id
        OFFSET page_offset LIMIT 10;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'An error occurred while getting goal monetary flows: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

--rollback DROP FUNCTION "get_monetary_goals";


