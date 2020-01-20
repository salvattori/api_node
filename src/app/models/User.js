import mongoose, { Schema } from 'mongoose';
import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

import config from '../../config';

require('mongoose-uuid2')(mongoose);

const saltRounds = 10;
const UserSchema = new Schema({
  _id: { type: String, default: uuid },
  nome: String,
  email: { type: String, unique: true },
  senha: { type: String, required: true },
  telefones: [{ numero: String, ddd: String }],
  data_criacao: { type: Date, default: Date.now },
  data_atualizacao: { type: Date, default: Date.now },
  ultimo_login: { type: Date, default: Date.now },
  token: String,
});

UserSchema.pre('save', function(next) {
  this.token = JWT.sign({ id: this._id }, config.secret, {
    expiresIn: config.expiration,
  });
  this.senha = bcrypt.hashSync(this.senha, saltRounds);
  next();
});

export default mongoose.model('User', UserSchema);
