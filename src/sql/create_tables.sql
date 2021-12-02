DROP TABLE IF EXISTS transacoes;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  cpf CHAR(11),
  telefone VARCHAR(16) 
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf CHAR(11) NOT NULL,
  telefone VARCHAR(16) NOT NULL,
  cep CHAR(8),
  endereco TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id)
);

CREATE TABLE transacoes(
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  valor INTEGER,
  data_vencimento TIMESTAMPTZ,
  data_registro TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id),
  FOREIGN KEY (id_cliente) REFERENCES clientes (id)
);

--- MUDANÇAS 2ª SPRINT

--- OPÇÃO A

ALTER TABLE clientes DROP COLUMN estado;
ALTER TABLE clientes ADD COLUMN estado CHAR(2);

--- OPÇÃO B

ALTER TABLE clientes
ALTER COLUMN estado TYPE CHAR(2);


DROP TABLE transacoes;

CREATE TABLE cobrancas(
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER NOT NULL,
  valor INTEGER NOT NULL,
  data_vencimento TIMESTAMPTZ NOT NULL,
  data_registro TIMESTAMPTZ DEFAULT NOW(),
  descricao TEXT NOT NULL,
  status BOOLEAN DEFAULT FALSE NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes (id)
);
