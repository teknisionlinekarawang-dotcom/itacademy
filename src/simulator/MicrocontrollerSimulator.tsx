import { useState, useEffect, useRef } from 'react';

const challenges = {
    led: {
        title: 'Blink LED',
        description: 'Buatlah LED pada pin 13 berkedip dengan jeda 1 detik (1000 ms).',
        template: `// Pin 13 memiliki LED bawaan
int ledPin = 13;

void setup() {
  // Atur pin LED sebagai OUTPUT
  
}

void loop() {
  // Nyalakan LED
  
  // Tunggu 1 detik
  
  // Matikan LED
  
  // Tunggu 1 detik
  
}`,
        validate: (code: string) => {
            const setupCorrect = /pinMode\(\s*ledPin\s*,\s*OUTPUT\s*\)/.test(code);
            const loopCorrect = /digitalWrite\(\s*ledPin\s*,\s*HIGH\s*\)[\s\S]*delay\(\s*1000\s*\)[\s\S]*digitalWrite\(\s*ledPin\s*,\s*LOW\s*\)[\s\S]*delay\(\s*1000\s*\)/.test(code);
            return setupCorrect && loopCorrect;
        }
    },
    servo: {
        title: 'Gerakkan Servo',
        description: 'Sertakan library Servo, atur servo pada pin 9, dan gerakkan ke sudut 90 derajat.',
        template: `#include <Servo.h>

Servo myServo;
int servoPin = 9;

void setup() {
  // Hubungkan objek servo ke pin
  
}

void loop() {
  // Gerakkan servo ke 90 derajat
  
}`,
        validate: (code: string) => {
            const includeCorrect = /#include\s*<Servo\.h>/.test(code);
            const setupCorrect = /myServo\.attach\(\s*servoPin\s*\)/.test(code);
            const loopCorrect = /myServo\.write\(\s*90\s*\)/.test(code);
            return includeCorrect && setupCorrect && loopCorrect;
        }
    },
    lcd: {
        title: 'Tampilkan Teks di LCD',
        description: 'Sertakan library LiquidCrystal, inisialisasi LCD, dan tampilkan teks "Hello, World!" pada baris pertama.',
        template: `#include <LiquidCrystal.h>

// Inisialisasi pin LCD: (rs, en, d4, d5, d6, d7)
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void setup() {
  // Atur ukuran LCD (16 kolom, 2 baris)
  
  // Tampilkan teks
  
}

void loop() {
  // Tidak perlu melakukan apa-apa di sini
}`,
        validate: (code: string) => {
            const includeCorrect = /#include\s*<LiquidCrystal\.h>/.test(code);
            const setupCorrect = /lcd\.begin\(\s*16\s*,\s*2\s*\)/.test(code);
            const printCorrect = /lcd\.print\(\s*"Hello, World!"\s*\)/.test(code);
            return includeCorrect && setupCorrect && printCorrect;
        }
    }
};

type ChallengeId = keyof typeof challenges;

const LED = ({ on }: { on: boolean }) => (
    <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full border-2 border-gray-600 transition-all duration-100 ${on ? 'bg-red-500 shadow-[0_0_15px_theme(colors.red.500)]' : 'bg-red-900'}`} />
        <span className="font-mono text-xs text-gray-400 mt-2">LED</span>
    </div>
);

const Servo = ({ angle }: { angle: number }) => (
    <div className="flex flex-col items-center">
        <div className="w-16 h-16 relative">
            <div className="absolute inset-2 bg-gray-700 rounded-full border-2 border-gray-500" />
            <div
                className="absolute top-1/2 left-0 w-1/2 h-1.5 bg-cyan-400 rounded-r-full origin-right transition-transform duration-500"
                style={{ transform: `rotate(${angle - 90}deg)` }}
            />
        </div>
        <span className="font-mono text-xs text-gray-400 mt-2">Servo ({angle}°)</span>
    </div>
);

const LCD = ({ text }: { text: string }) => (
    <div className="flex flex-col items-center">
        <div className="w-48 h-16 bg-blue-900/50 border-2 border-blue-400/30 rounded-md p-2 font-mono text-cyan-300 text-lg tracking-wider grid grid-rows-2 grid-cols-16">
            <div className="col-span-16 truncate">{text.split('\n')[0] || ''}</div>
            <div className="col-span-16 truncate">{text.split('\n')[1] || ''}</div>
        </div>
        <span className="font-mono text-xs text-gray-400 mt-2">LCD 16x2</span>
    </div>
);

export default function MicrocontrollerSimulator() {
    const [activeChallenge, setActiveChallenge] = useState<ChallengeId>('led');
    const [code, setCode] = useState(challenges.led.template);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: 'Klik "Upload" untuk menjalankan kode.' });

    // Simulation state
    const [ledOn, setLedOn] = useState(false);
    const [servoAngle, setServoAngle] = useState(0);
    const [lcdText, setLcdText] = useState('');
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // Reset state when challenge changes
        setCode(challenges[activeChallenge].template);
        resetSimulation();
    }, [activeChallenge]);

    const resetSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setLedOn(false);
        setServoAngle(0);
        setLcdText('');
        setFeedback({ type: 'idle', message: 'Klik "Upload" untuk menjalankan kode.' });
    };

    const handleUpload = () => {
        resetSimulation();
        const challenge = challenges[activeChallenge];
        const isValid = challenge.validate(code);

        if (isValid) {
            setFeedback({ type: 'success', message: 'Kode Benar! Simulasi berjalan...' });
            // Run simulation based on challenge
            if (activeChallenge === 'led') {
                intervalRef.current = window.setInterval(() => {
                    setLedOn(prev => !prev);
                }, 1000);
            } else if (activeChallenge === 'servo') {
                setServoAngle(90);
            } else if (activeChallenge === 'lcd') {
                setLcdText('Hello, World!');
            }
        } else {
            setFeedback({ type: 'error', message: 'Kode belum benar. Coba periksa kembali!' });
        }
    };

    const renderHardware = () => {
        switch (activeChallenge) {
            case 'led': return <LED on={ledOn} />;
            case 'servo': return <Servo angle={servoAngle} />;
            case 'lcd': return <LCD text={lcdText} />;
            default: return null;
        }
    };

    return (
        <div className="bg-[#0d1525]/50 border border-[rgba(0,212,255,0.1)] rounded-xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side: Editor & Controls */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg font-bold text-white">Simulator Kode Mikrokontroler</h3>
                        <div className="flex gap-1 p-1 rounded-lg bg-[#07090f] border border-[rgba(255,255,255,0.04)]">
                            {(Object.keys(challenges) as ChallengeId[]).map(id => (
                                <button
                                    key={id}
                                    onClick={() => setActiveChallenge(id)}
                                    className={`font-mono text-xs px-3 py-1 rounded-md transition-colors ${activeChallenge === id ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-gray-700'}`}
                                >
                                    {challenges[id].title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mb-4">{challenges[activeChallenge].description}</p>

                    <div className="relative">
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                            className="w-full h-80 bg-[#07090f] border border-[rgba(0,212,255,0.2)] rounded-lg p-4 font-mono text-xs text-white placeholder-[#4a5568] focus:outline-none focus:border-cyan-400 transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={handleUpload}
                            className="flex-1 font-display font-bold text-sm px-6 py-3 rounded-lg transition-all duration-200 bg-[#00d4ff] text-[#07090f] hover:bg-white glow-cyan"
                        >
                            ⚡ Upload & Jalankan
                        </button>
                        <button
                            onClick={resetSimulation}
                            className="font-mono text-xs px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Right Side: Hardware Visualizer */}
                <div className="lg:w-1/3 flex flex-col items-center justify-center bg-[#07090f] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 min-h-[20rem]">
                    <div className="flex-grow flex items-center justify-center">
                        {renderHardware()}
                    </div>
                    <div
                        className={`w-full text-center font-mono text-xs p-2 rounded-md mt-4 transition-colors ${
                            feedback.type === 'success' ? 'bg-green-500/10 text-green-400' :
                            feedback.type === 'error' ? 'bg-red-500/10 text-red-400' :
                            'bg-gray-700/20 text-gray-500'
                        }`}
                    >
                        {feedback.message}
                    </div>
                </div>
            </div>
        </div>
    );
}