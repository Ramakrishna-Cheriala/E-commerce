import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const hashPass = await bcrypt.hash(password, 10);
    return hashPass;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};
