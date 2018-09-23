-- Reads all item balances of a user
CREATE OR UPDATE FUNCTION lunamals_economy.read_inventory(userid varchar)
BEGIN
    SELECT *
    FROM lunamals_economy.balances b
    JOIN lunamals_economy.products p ON p.id == b.product_id
    WHERE b.user_id = userid
      AND b.held > 0
      AND p.is_currency = false
END;

-- Reads all currency balances of a user
CREATE OR UPDATE FUNCTION lunamals_economy.read_balances(userid varchar)
BEGIN
    SELECT *
    FROM lunamals_economy.balances b
    JOIN lunamals_economy.products p ON p.id == b.product_id
    WHERE b.user_id = userid
      AND p.is_currency = true
END;

-- get the count of items in a user's inventory
CREATE OR UPDATE FUNCTION lunamals_economy.inventory_size(userid varchar)
BEGIN
    SELECT COUNT(*)
    FROM lunamals_economy.inventory_balance
    WHERE user_id = userid
END;
