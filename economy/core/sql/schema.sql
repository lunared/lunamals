CREATE SCHEMA lunamals_economy;

CREATE TABLE lunamals_economy.currency (
    id varchar(128) primary key,
    name varchar(128) not null
)

CREATE TABLE lunamals_economy.products (
    id varchar(128) primary key,
    name varchar(128) not null,
    description text,
    -- currencies should not be available for sale in shops and do not take up "inventory" space
    is_currency boolean default false
    -- exchange product for a currency product
    exchange_product varchar(128),
    exchange_price int
)

CREATE TABLE lunamals_economy.inventory_balance (
    id int primary key,
    user_id varchar(128),
    product_id varchar(128),
    -- freeze funds when transactions are pending
    frozen_funds boolean
)

CREATE TABLE lunamals_economy.storage_balance (
    id int primary key,
    user_id varchar(128),
    product_id varchar(128),
    held int
)

-- collected amount of currency in shop til
CREATE TABLE lunamals_economy.shop_balance (
    id int primary key,
    user_id varchar(128),
    product_id varchar(128),
    held int,
    exchange_price int,
    exchange_product varchar(128)
)

CREATE TABLE lunamals_economy.shop_til (
    id int primary key,
    user_id varchar(128),
    product_id varchar(128),
    held int,
)

CREATE TABLE lunamals_economy.transaction_exchanges (
    transaction_id varchar primary key,
    product_id varchar(128),
    
)

CREATE TABLE lunamals_economy.transactions (
    id varchar(128),
    from_user varchar(128),
    to_user varchar(128),
    current_state TRANSACTION_STATE,
    created_at datetime,
    updated_at datetime
);

CREATE INDEX lunamals_economy.index_by_update on lunamals_economy.transactions (
    updated_at
);

CREATE ENUM TRANSACTION_STATE (
    PENDING,
    COMMITTED,
    CANCELLED
)
