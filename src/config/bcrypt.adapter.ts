import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

export const bcryptAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    return compareSync(password, hash);
  }  
}