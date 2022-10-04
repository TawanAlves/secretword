import './StartScreen.css';

const StartScreen = ({startGame}) => {
  return (
    <div className="start">
      <h1>Palavra Secreta</h1>
      <p>Clique no botão abaixo para começar a Jogar</p>
      <button onClick={startGame}>Começar o Jogo</button>
    </div>
  )
}

export default StartScreen