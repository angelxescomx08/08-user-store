import * as jwt from 'jsonwebtoken';
import { envs } from './envs';

const SEED = envs.JWT_SEED;

export class JwtAdapter {

  static generateToken = async (payload: any, duration: string = '2h') => {
    return new Promise((resolve) => {
      jwt.sign(payload, SEED, { expiresIn: duration }, (err, token) => {
        if(err) return resolve(null);
        resolve(token);
      });
    });
  }

  static validateToken = (token: string) => {
    
  }
}