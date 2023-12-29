interface ScoreProps{
    avatar:string;
    name: string;
    score: number;
}


const Score : React.FC<ScoreProps> = ({ avatar, name, score }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <img src={avatar} alt={name} className="w-16 h-16 rounded-full border border-[#AF6915] mb-2" />
      <div className="text-white">{name}</div>
      <div className="text-white">Score: {score}</div>
    </div>
  );
};

export default Score;