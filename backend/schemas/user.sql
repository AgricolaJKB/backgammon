create table user (
  user_id text primary key,
  user_name text not null unique,
  user_pwd_hash text not null,
  user_mail text
);