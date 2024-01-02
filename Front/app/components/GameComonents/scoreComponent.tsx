interface ScoreProps{
    avatar:string;
    name: string;
    score: number;
}


const Score : React.FC<ScoreProps> = ({ avatar, name, score }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img src={avatar} alt={name} className="medium:w-16 medium:h-16 h-10 w-10  rounded-full border border-[#AF6915] mb-2" />
      <div className="text-white text-sm xMedium:text-2xl">{name}</div>
      <div className="text-white text-sm xMedium:text-2xl">Score: {score}</div>
    </div>
  );
};

export default Score;