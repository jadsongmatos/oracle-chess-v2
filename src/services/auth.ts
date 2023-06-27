import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY ? process.env.SECRET_KEY : 0

export const verify_hash = (plainPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(plainPassword, hashedPassword)
};

export const create_hash = (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, SECRET_KEY)
};

