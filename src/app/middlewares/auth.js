import JWT from 'jsonwebtoken';
import { promisify } from 'util';
import config from '../../config';
import User from '../models/User';

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw Error('MissingHeader');

    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');

    const decoded = await promisify(JWT.verify)(token, config.secret);
    const user = await User.findById({ _id: decoded.id });

    if (user.token !== token) throw Error('InvalidSession');
    if (!user) throw Error('UserNotFound');

    const ultimoLogin = new Date(user.ultimo_login);
    if (!(new Date(ultimoLogin.getTime() + 30 * 60000) >= new Date()))
      throw Error('InvalidSession');
    req.tokenID = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(403).send({ message: 'Sessão inválida' });
    switch (error.message) {
      case 'MissingHeader':
        return res.status(401).send({ message: 'Não autorizado' });
      case 'InvalidSession':
        return res.status(403).send({ message: 'Não autorizado' });
      case 'UserNotFound':
        return res.status(404).send({ message: 'Usuário não existe!' });
      default:
        return res.status(500).send({
          message: 'Encontramos um problema nos servidores, tente novamente',
        });
    }
  }
};
