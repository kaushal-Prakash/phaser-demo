import BartenderGame from "@/component/GameCanvas";

export default function GamePage() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#999'
    }}>
      <BartenderGame />
    </div>
  );
}