CREATE TABLE IF DOES NOT EXIST users (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    username VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(225) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
CREATE TABLE IFDOES NOT EXIST products (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    TITLE VARCHAR(225) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL,
    image_url TEXT,
    catergosy VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
)
CREATE TABLE IF DOES NOT EXIST orders (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    user_id UUID REFERENCES users(id),
    total_price NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
)
CREATE TABLE IF TABLE DOES NOT EXIST order_items(
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
)