CREATE OR UPDATE FUNCTION lunamals_economy.transaction_history(account varchar)
BEGIN
    SELECT *
    FROM lunamals_economy.transactions
    WHERE from_user = account;
END;