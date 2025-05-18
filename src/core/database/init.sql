--------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_enum') THEN
        CREATE TYPE service_enum AS ENUM ('cold_water', 'hot_water', 'gas', 'electricity');
    END IF;
END $$;
--------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  phone VARCHAR NOT NULL,
  balance NUMERIC DEFAULT 0,
  address TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS company (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  service service_enum NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS subscribe (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  client_id INTEGER REFERENCES clients(id),
  service_id INTEGER REFERENCES company(id),
  last_meter_value VARCHAR DEFAULT 0,
  payment_date DATE DEFAULT CURRENT_DATE,
  debt NUMERIC DEFAULT 0
);
