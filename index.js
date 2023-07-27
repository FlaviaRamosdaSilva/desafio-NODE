const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())  // avisar que vamos usar o body com Json

const orders = []

const checkOrderId = (request, response, next) => {
    const {id} = request.params // precisamos da informação do ID que queremos atualizar (ou deletar) primeiramente
    //ele vai pegar o ID lá na url do insomnia, que vai ta aparecendo no params;
    const index = orders.findIndex(user => user.id === id)  //achar a posição onde está o ID dentro do array com
    //findIndex pra isso dizemos que queremos o ID que eu digitar na barra de url do insomnia das routes
    if (index < 0){
        return response.status(404).json({error: "user not found"})
    } // aqui é pra dar a mensagem caso o ID esteja errado, pq no findIndex ele retorna -1 quando não acha algo
    request.orderId = id
    request.orderIndex = index
    next()
}

const checkReq = (request, response, next) => {
    console.log(request.method + " - " + request.url)
    next()
}

app.get('/order', checkReq, (request, response) => {
    return response.json(orders) //retorna todos meus pedidos
   
})

app.get('/order/:id', checkOrderId, checkReq,  (request, response) => {
    const id = request.orderId
    const findOrder = orders.find(user => user.id === id)  
    if (findOrder == undefined){
        return response.status(404).json({error: "user not found"})
    } 
    return response.json(findOrder)
})

app.post('/order', checkReq, (request, response) => {
    const { order, clientName, price } = request.body // pega o que eu coloquei no Body
    const pedido = { id:uuid.v4(), order, clientName, price, status:"em processamento" } // cria um ID para os dados do body e armazena todos no ORDER
    orders.push(pedido) // pega a variável Order que tava com o array vazio e adiciona (push) o que eu criei na linha de cima

    return response.status(201).json(pedido) // retorna o usuário que criamos apenas e coloca o status lá de cima com 201
})

//você volta na aba GET do insomnia e clica SEND e ele vai trazer
//todos os usuarios criados, ou seja o array Order

app.put('/order/:id', checkOrderId, checkReq, (request, response) => {
    const id = request.orderId
    const { order, clientName, price} = request.body 
    const updateOrder = { id, order, clientName, price, status:"em processamento"} //estou reformulando os dados do meu usuário, criando o usuário atualizado;
    // o ID que já existe, vamos pegar da verificação anterior (orderId), o novo name e novo age que vieram do body pela const name, age.
    const index = request.orderIndex // ele puxa do IF do checkUserId
    orders[index] = updateOrder //aqui ele vai procurar o array USERS e vai dizer que o index tal (posição)
    //deve ser  o que resultar do updateUser (substituindo os dados)
   
    return response.json(updateOrder)
})

app.delete('/order/:id', checkOrderId, checkReq, (request, response) => {
    const index = request.orderIndex // ele puxa do IF do checkUserId pelo ID que colocamos na URL
   
    orders.splice(index, 1) // aqui eu puxo a posição x do index e deleto só 1, ou seja, só ele

    return response.status(204).json() 
})

app.patch('/order/:id', checkOrderId, checkReq, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const findOrder = orders[index]
    findOrder.status = "Pronto"

    return response.json(findOrder)
})


app.listen(port, () => {
    console.log (`🚀 Server Started on port ${port}`)
})