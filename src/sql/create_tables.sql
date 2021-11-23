CREATE DATABASE desafio_05;

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