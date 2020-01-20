import User from '../models/User';

class UserController {
  async findById(req, res) {
    try {
      const user = await User.findById(req.params.user_id);
      console.log('user', user);
      if (!user) throw Error('UserNotFound');
      if (user.id !== req.tokenID) throw Error('TokenDoNotMatch');
      return res.status(200).send(user);
    } catch (error) {
      console.log(error.message);
      switch (error.message) {
        case 'TokenDoNotMatch':
          return res.status(403).send({ message: 'Não autorizado' });
        case 'UserNotFound':
          return res.status(404).send({ message: 'Usuário não existe!' });
        default:
          return res.status(500).send({
            message: 'Encontramos um problema nos servidores, tente novamente',
          });
      }
    }
  }
}
export default new UserController();
