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
