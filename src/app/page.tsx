import DiceGame from '@/components/DiceGame';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        AI Dice Game
      </h1>
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
        <DiceGame />
      </div>
    </div>
  );
}
