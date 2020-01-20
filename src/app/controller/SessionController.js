import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../config';
import User from '../models/User';

class SessionController {
  async signup(req, res) {
    try {
      if (await User.exists({ email: req.body.email }))
        return res.status(400).json({ message: 'E-mail já existe' });
      const user = await User.create(req.body);
      return res.status(201).send(user);
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Falha no cadastro, tente novamente!' });
    }
  }

  async signin(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res
          .status(404)
          .send({ message: 'Usuário e/ou senha inválidos' });

      const passwordIsValid = bcrypt.compareSync(req.body.senha, user.senha);

      if (!passwordIsValid)
        return res
          .status(401)
          .send({ message: 'Usuário e/ou senha inválidos' });
      const token = JWT.sign({ id: user._id }, config.secret, {
        expiresIn: config.expiration,
      });
      user.token = token;
      user.ultimo_login = Date.now();
      await User.update(
        { _id: user._id },
        {
          token,
          ultimo_login: Date.now(),
        }
      );
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({
        message:
          'Encontramos um problema nos servidores, tente logar novamente',
      });
    }
  }
}

export default new SessionController();
