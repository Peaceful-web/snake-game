const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d') //acessa o context do canvas
const h1 = document.querySelector('h1')
const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')

const audio = new Audio('../Assets/assets_audio.mp3') 

//ctx.fillStyle = 'red' //cor do preenchimento do context

//ctx.fillRect(300, 300, 50, 50) //desenha um retângulo param(eixo x, y, width, heigth)

const size = 30

let snake = [

    { x: 270, y: 240 },
    { x: 300, y: 240} //as cordenadas iniciais precisam ser múltiplos de 30 para encaixar perfeitamente na tela

] //nossa cobrinha será um array

const incrementScore = () => {
    score.innerText = parseInt(score.innerText) + 10 //corrige o problema da concatenação do valor 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => { //gera as coordenadas da posição do food
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {//vai retornar uma templateString contendo os valores rgb()
    const red = randomNumber(0, 255) //gera um número aleatório(min, max)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)
    return `rgb(${red}, ${green}, ${blue})`

}


const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawSnake = () => {
    ctx.fillStyle = '#ddd'

    snake.forEach((position, index) => {

        if (index == snake.length - 1) //verifica se o index é igual ao último elemento do array 
        {
            ctx.fillStyle = 'white'
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {

    if (!direction) return //verifica se não há nenhum valor dentro do direction

    const head = snake[snake.length - 1] //at(-1) //indexa o último elemento do array

    

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y }) //acrescenta um novo elemento ao array com as mesmas propriedades da head acrescentadas com o size dependendo da direção
    }

    if (direction == 'left') {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == 'down') {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == 'up') {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift() // remove o primeiro elemento do array
}

const gameLoop = () => {

    clearInterval(loopId)// limpa o intervalo de tempo, loopId precisa ser declarada antes

    ctx.clearRect(0, 0, 600, 600) //Limpa o retângulo dentro da área correspondente aos parâmetros
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() =>{ //chama o gameLoop a cada 300ms
        gameLoop()
    }, 100)
}


//setInterval(() => { 

//}, 300) //loop executado a cada 300ms que limpa o retângulo, desenha um novo e o move


//document.addEventListener("keydown", (event) => {
    //console.log(event.key) //event.key é a tecla que o usuário pressiona
//})

const drawGrid = () => { //função para criar linhas 
    ctx.lineWidth = 1 //largura da linha
    ctx.strokeStyle = '#191919' //cor da linha

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath() //desenha uma linha de cada vez, reinicia o desenho
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)

        ctx.stroke()

        ctx.beginPath() // inicia um novo desenho, dessa vez na horizontal
        ctx.lineTo(0, i) 
        ctx.lineTo(600, i)
        ctx.stroke()
    }

    //ctx.lineTo(300, 0) //onde inicia a linha param(eixo x, eixo y)
    //ctx.lineTo(300, 600)//onde termina a linha

    //ctx.stroke() // desenha as linhas com base nas predefinições acima
}

const drawFood = () => {

    const { x, y, color } = food //desestrutura as propriedades do food (não precisa mais digitar food.x, food.y, food.color etc.)

    ctx.shadowColor = color //define a cor da sombra
    ctx.shadowBlur = 6 //vai pegar um blur(sombra) em todos os elementos
    ctx.fillStyle = color //define a cor do preenchimento
    ctx.fillRect(x,y, size, size)
    ctx.shadowBlur = 0 //reinicia o blur depois de desenhar o food
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head) //acrescenta um novo elemento ao array da cobrinha
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        //snake.find
        while(snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x 
        food.y = y
        food.color = randomColor()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const neckIndex = snake.length - 2 //pega todos os elementos do array menos a cabeça
    const canvasSize = canvas.width - size 
    const wallColision = head.x < 0 || head.x > canvasSize || head.y < 0 || head.y > canvasSize

    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallColision || selfColision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = 'flex'
    finalScore.innerText = score.innerText
    canvas.style.filter = 'blur(2px)'
}

gameLoop()

document.addEventListener("keydown", ({ key }) => { //{ key } é a tecla que o usuário clica

    if (key == "ArrowRight" && direction != 'left') { //se pressionar a tecla direita 
        direction = 'right'
    }

    if (key == "ArrowLeft" && direction != 'right') {
        direction = 'left'
    }

    if (key == 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }

    if (key == 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }

})

buttonPlay.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    snake = 
        [{ x: 270, y: 240 },
        { x: 300, y: 240}] //as cordenadas iniciais precisam ser múltiplos de 30 para encaixar perfeitamente na tela
    
    
})