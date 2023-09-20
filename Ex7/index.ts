import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";
import sinon from 'sinon'
//pesquiasr, como instalar e usar o Jest, no meu PC
//npm i --save dev ts-jest
//analise de cobertura, diz quais teste foi feitos e quais nao foram feitos
//bom para fazer para nao deixar o usuario fazer esses testes, o proprio jester ja faz essa cobertura
//criar um arquivo de teste para cada arquivo de produção
//Ex: app.spec.ts    arquivo teste
//testes de unidades usam .specs, testes de integração
//coisas assincronas, no caso o de codificar a senha
//escreve o teste antes do codigo, se chama tdd
//vai criar o app, vai criar o user, e vai tentar mover a bike sem ter criado a bike para dar erro
//jest expect to throw é a resposta, pesquisar no google
//bara baixar todos as extensoes que o professor possui, pegar os codigos dele e usar apenas o npm install que instala todas as extensãoes que ele usou ou está no package.jso

async function main() {
    const clock = sinon.useFakeTimers();
    const app = new App()
    const user1 = new User('Jose', 'jose@mail.com', '1234')
    await app.registerUser(user1)
    const bike = new Bike('caloi mountainbike', 'mountain bike',
        1234, 1234, 100.0, 'My bike', 5, [])
    app.registerBike(bike)
    console.log('Bike disponível: ', bike.available)
    app.rentBike(bike.id, user1.email)
    console.log('Bike disponível: ', bike.available)
    clock.tick(1000 * 60 * 65)
    console.log(app.returnBike(bike.id, user1.email))
    console.log('Bike disponível: ', bike.available)
}

main()