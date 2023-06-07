CREATE TABLE IF NOT EXISTS "user" (
  id INT NOT NULL,
  username VARCHAR(16) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(32) NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP NULL,
  PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS "location" (
  id INT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  city VARCHAR(45) NOT NULL,
  state CHAR(2) NOT NULL,
  nation VARCHAR(45) NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_location_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_location_user1_idx ON "location" (user_id ASC);

CREATE TABLE IF NOT EXISTS "friend" (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  CONSTRAINT fk_friends_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_friends_user2
    FOREIGN KEY (friend_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_friends_user1_idx ON "friend" (user_id ASC);
CREATE INDEX fk_friends_user2_idx ON "friend" (friend_id ASC);

CREATE TABLE IF NOT EXISTS "achievement" (
  id INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  description VARCHAR(45) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT name_unique UNIQUE (name),
  CONSTRAINT description_unique UNIQUE (description)
);

CREATE TABLE IF NOT EXISTS "achievement_user" (
  achievement_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (achievement_id, user_id),
  CONSTRAINT fk_achievement_has_user_achievement1
    FOREIGN KEY (achievement_id)
    REFERENCES "achievement" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_achievement_has_user_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_achievement_has_user_user1_idx ON "achievement_user" (user_id ASC);
CREATE INDEX fk_achievement_has_user_achievement1_idx ON "achievement_user" (achievement_id ASC);

CREATE TABLE IF NOT EXISTS "tree" (
  id INT NOT NULL,
  value INT NOT NULL,
  depth INT NOT NULL,
  gameover BOOLEAN NOT NULL DEFAULT false,
  checkmate BOOLEAN NOT NULL DEFAULT false,
  update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  parent_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_table1_table11
    FOREIGN KEY (parent_id)
    REFERENCES "tree" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_table1_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_table1_table11_idx ON "tree" (parent_id ASC);
CREATE INDEX fk_table1_user1_idx ON "tree" (user_id ASC);

CREATE TABLE IF NOT EXISTS "link" (
  id INT NOT NULL,
  url VARCHAR(45) NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_link_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_link_user1_idx ON "link" (user_id ASC);

CREATE TABLE IF NOT EXISTS "click" (
  idclick VARCHAR(255) NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  others VARCHAR(255) NOT NULL,
  link_id INT NOT NULL,
  PRIMARY KEY (idclick),
  CONSTRAINT fk_click_link1
    FOREIGN KEY (link_id)
    REFERENCES link (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_click_link1_idx ON "click" (link_id ASC);

CREATE TABLE IF NOT EXISTS "coin" (
  id INT NOT NULL,
  currency_origin INT NOT NULL,
  state BOOLEAN NOT NULL DEFAULT true,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_coin_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_coin_user1_idx ON "coin" (user_id ASC);

CREATE TABLE IF NOT EXISTS "item" (
  id INT NOT NULL,
  name VARCHAR(45) NOT NULL,
  description VARCHAR(45) NOT NULL,
  cost INT NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS "buy" (
  id INT NOT NULL,
  price_at_time INT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  item_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_buy_item1
    FOREIGN KEY (item_id)
    REFERENCES item (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_buy_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_buy_item1_idx ON "buy" (item_id ASC);
CREATE INDEX fk_buy_user1_idx ON "buy" (user_id ASC);

CREATE TABLE IF NOT EXISTS "buy_coin" (
  buy_id INT NOT NULL,
  coin_id INT NOT NULL,
  PRIMARY KEY (buy_id, coin_id),
  CONSTRAINT fk_buy_has_coin_buy1
    FOREIGN KEY (buy_id)
    REFERENCES buy (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_buy_has_coin_coin1
    FOREIGN KEY (coin_id)
    REFERENCES coin (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_buy_has_coin_coin1_idx ON "buy_coin" (coin_id ASC);
CREATE INDEX fk_buy_has_coin_buy1_idx ON "buy_coin" (buy_id ASC);

CREATE TABLE IF NOT EXISTS "session" (
  id INT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time_new_session_time INT NULL,
  total_active_time INTERVAL NOT NULL DEFAULT INTERVAL '0' hour,
  user_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_session_session1
    FOREIGN KEY (end_time_new_session_time)
    REFERENCES session (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_session_user1
    FOREIGN KEY (user_id)
    REFERENCES "user" (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_session_session1_idx ON "session" (end_time_new_session_time ASC);
CREATE INDEX fk_session_user1_idx ON "session" (user_id ASC);

CREATE TABLE IF NOT EXISTS "activity" (
  id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS "interaction" (
  id INT NOT NULL,
  create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activity_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_interaction_activity1
    FOREIGN KEY (activity_id)
    REFERENCES activity (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_interaction_activity1_idx ON "interaction" (activity_id ASC);

CREATE TABLE IF NOT EXISTS "interaction_session" (
  interaction_id INT NOT NULL,
  session_id INT NOT NULL,
  PRIMARY KEY (interaction_id, session_id),
  CONSTRAINT fk_interaction_has_session_interaction1
    FOREIGN KEY (interaction_id)
    REFERENCES interaction (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_interaction_has_session_session1
    FOREIGN KEY (session_id)
    REFERENCES session (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE INDEX fk_interaction_has_session_session1_idx ON "interaction_session" (session_id ASC);
CREATE INDEX fk_interaction_has_session_interaction1_idx ON "interaction_session" (interaction_id ASC);
