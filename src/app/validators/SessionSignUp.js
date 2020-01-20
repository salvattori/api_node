import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
      telefones: Yup.array().of(
        Yup.object().shape({
          ddd: Yup.string()
            .min(2)
            .max(2)
            .required(),
          numero: Yup.string()
            .min(8)
            .max(9)
            .required(),
        })
      ),
    });
    await schema.validate(req.body, { abortEarly: false });
    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Campos fora de padrão', flieds: error.inner });
  }
};
