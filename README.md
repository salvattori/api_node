# ApiNode
https://sky-challenge.herokuapp.com/
## Firsts steps
 frist create an `.env` file and set
 - MONGO_DB_CONNECTION
 - JWT_SECRET

### test ApiNode
 run `yarn test`

### Run server
 run `yarn dev`



## How to use THE API
### SignUp [/signup]
```javascript
  nome: String,
  email: String,
  senha: String,
  telefones: [{ numero: String, ddd: String }],
  ```
  it will return an User object

### SignIn [/signin]
```json
email: "teste@teste.com",
senha: "senhasecreta"
```
It will return an User object

### FindUser [/users/:user_id]
You must provide and authorization header `Bearer <token>` from the response of SIGNIN
it will return an User object
