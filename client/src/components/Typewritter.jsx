import Typewriter from 'typewriter-effect';

export default function TypewriterComponent() {
  return (
    <div className="font-mono pt-70 text-white text-center text-5xl">
      
      <Typewriter
        options={{
          strings: ['Ask Questions Based on Context!', 'Upload any document. Ask anything.', 'No more scrolling — Just Ask.'],
          autoStart: true,
          loop: true,
          delay: 75,
        }}
      />
    </div>
  );
}