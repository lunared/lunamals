CREATE OR UPDATE FUNCTION lunamals_economy.write_transaction(
    from_user varchar,
    to_user varchar,
    product varchar,
    paid_amount int,
    exchange_product varchar
)
DECLARE
    from_user_possessed int%rowtype
    inventory_user_size int%rowtype
BEGIN
    SELECT held INTO from_user_possessed
    FROM lunamals_economy.shop_balance
    WHERE from_user = account 
      AND product_id = product;

    SELECT lunamals_economy.inventory_size(to_user) INTO inventory_user_size
    
    IF from_user_possessed - amount < 1 THEN
        RAISE 'from_user does not have enough of product to transfer to to_user'
    END IF;

    IF inventory_user_size >= 50 THEN
        RAISE "to_user's inventory is already full"
    END IF;

    INSERT INTO lunamals_economy.transactions (
        from_user,
        to_user,
        product_id,
        exchanged,
        current_state
    ) VALUES (
        from_user,
        to_user,
        product_id,
        amount,
        TRANSACTION_STATE.COMMITTED,
    );

    -- give the shop til the amount paid for the exchange
    UPDATE lunamals_economy.shop_til
        SET held = held + paid_amount
        WHERE user_id = from_user
          AND product_id = exchange_product;
    -- deduct from the shop balance
    UPDATE lunamals_economy.shop_balance
        SET held = held - amount
        WHERE user_id = from_user
          AND product_id = product;
    -- add the items into the user's inventory
    INSERT INTO lunamals_economy.inventory_balance (
        user_id,
        product_id,
    ) VALUES (
        to_user,
        product
    )
    UPDATE lunamals_economy.inventory_balance
        SET held = held + amount
        WHERE user_id = to_user
          AND product_id = product;

    IF NOT FOUND THEN
        INSERT INTO lunamals_economy.balances (user_id, product_id, held)
          VALUES (to_user, product_id, amount);
    END IF;
END;
$$ LANGUAGE 'plpgsql';
