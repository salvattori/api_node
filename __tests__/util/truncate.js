import User from '../../src/app/models/User';

export default async function truncate(id) {
  await User.findByIdAndRemove({ _id: id });
}
