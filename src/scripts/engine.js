const state = {
    score:{
        playerScore:0 ,
        computerScore:0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides:{
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX:document.querySelector('#computer-cards')
    },
    
    actions:{
        button:document.getElementById('next-duel'),
    },

}

const pathImages = './src/assets/icons/'

/*enumerar = definir/listar/dar sentido a algo */

const cardData = [
    {
        id:0,
        name:'Faísca',
        type:'Fogo',
        img:`${pathImages}cardFairy.jpeg`,
        WinOf:[1],
        LoseOf:[3],
    },
    {
        id:1,
        name:'Gota',
        type:'Agua',
        img:`${pathImages}cardGota.jpeg`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:'Terra',
        type:'Terra',
        img:`${pathImages}cardTerra.jpeg`,
        WinOf:[3],
        LoseOf:[1],
    },
    {
        id:3,
        name:'Ar',
        type:'Ar',
        img:`${pathImages}cardAir.jpeg`,
        WinOf:[0],
        LoseOf:[2],
    },

]

async function getRandomCardId(){

    /*math gera um numero aleatorio 
    floor o numero precisa ser inteiro 
    depois do * é o ate aquele numero q ele ira gerar 
    
    */
    const randomIndex = Math.floor(Math.random()*cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px')
    cardImage.setAttribute('src', './src/assets/icons/cardback.jpeg')
    cardImage.setAttribute('data-id', IdCard)
    cardImage.classList.add('card')

    if(fieldSide === state.playerSides.player1){

        cardImage.addEventListener('mouseover', ()=>{
            drawSelectCard(IdCard)
        })

        cardImage.addEventListener('click',()=>{
            setCardsField(cardImage.getAttribute('data-id'))
        })
    }

   

    return cardImage
}

async function  setCardsField(cardId){

    await removeAllCardsImage()


    let computerCardId = await getRandomCardId()

    await showHiddenCardFieldsImage(true)

    await hiddenCardDetails()
  
    await drawCardInfield(cardId, computerCardId)

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()

    await drawButton(duelResults)
}

async function drawCardInfield(cardId, computerCardId){

    state.fieldCards.player.src = cardData[cardId].img
    state.fieldCards.computer.src = cardData[computerCardId].img

}

//Esconde e mostra as cartas selecionadas 

async function showHiddenCardFieldsImage(value){
    if(value === true){

        state.fieldCards.player.style.display = 'block'
        state.fieldCards.computer.style.display = 'block'
    }else{
        state.fieldCards.player.style.display = 'none'
        state.fieldCards.computer.style.display='none'
    }

}

async function hiddenCardDetails(){
    state.cardSprites.name.innerText = ''
    state.cardSprites.type.innerText= ''

    state.cardSprites.avatar.src = ''

}

async function updateScore(){
    state.score.scoreBox.innerText =`Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId , computerCardId){

    let duelResults = 'Draw'
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = 'Win'
        state.score.playerScore++
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = 'Lose'
        state.score.computerScore++
    }

    await playAudio(duelResults)

    return duelResults
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = 'block'

}

async function removeAllCardsImage(){
    let {computerBOX, player1BOX}= state.playerSides
    let imgElements = computerBOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())

    imgElements = player1BOX.querySelectorAll('img')
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = 'atribute:' + cardData[index].type
}

async function drawCards(cardNumber, fieldSide){
    for(let i = 0; i <cardNumber; i++){
        const randomIdCard = await getRandomCardId()
        /*gera um id */

        const cardImage = await createCardImage
        (randomIdCard,fieldSide)
        /*vai gerar a foto das cartas */

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src=''
    state.actions.button.style.display = 'none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    init()
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)

    try{
        audio.play()
        
    }catch{}
    

}

function init(){
    showHiddenCardFieldsImage(false)
    drawCards(5, state.playerSides.player1)
    drawCards(5, state.playerSides.computer)

    const bgm = document.getElementById('bgm')
    bgm.play()


}

init()