import { useState } from 'react';
import {
    Play,
} from 'lucide-react';

import { BigButton } from '../buttons';

import Screen from './screen';

export default function TitleScreen ({
    onStartButtonClick
}) {
    const [isBlackKeysIncluded, setIsBlackKeysIncluded] = useState(false);
    
    const [octaves, setOctaves] = useState([
        { position: 1, checked: false },
        { position: 2, checked: false },
        { position: 3, checked: true },
        { position: 4, checked: false },
        { position: 5, checked: false },
        { position: 6, checked: false },
        { position: 7, checked: false },
    ]);

    const setOctaveByIndex = (checked, index) => {
        setOctaves(prevOctaves => {
            return prevOctaves.map((octave, octaveIndex) => {
                if (octaveIndex === index) {
                    return { ...octave, checked };
                }

                return octave;
            });
        });
    }

    const handleOctaveCheckboxChange = (event, index) => {
        setOctaveByIndex(event.target.checked, index);
    }

    const handleIncludeBlackKeysCheckboxChange = (event) => {
        setIsBlackKeysIncluded(event.target.checked);
    }

    const handleStartButtonClick = (event) => {
        const selectedOctaves = octaves
            .filter(octave => octave.checked)
            .map(octave => octave.position);

        onStartButtonClick(event, {
            selectedOctaves,
            isBlackKeysIncluded,
        });
    }

    return (
        <Screen className="items-center justify-center gap-6">
            <span className="flex flex-row items-center text-4xl font-bold text-center">
                Piano Guessing
            </span>

            <BigButton
                className="py-3 text-xl font-bold bg-gray-700 hover:bg-gray-900"
                onClick={handleStartButtonClick}
            >
                <Play /> Start Game
            </BigButton>

            <div  className="flex flex-col items-center justify-center gap-4">
                <Octaves
                    octaves={octaves}
                    onOctaveCheckboxChange={handleOctaveCheckboxChange}
                />

                <div className="flex flex-row items-center justify-center gap-2">
                    <input
                        type="checkbox"
                        id="include-black-keys-checkbox"
                        checked={isBlackKeysIncluded}
                        onChange={handleIncludeBlackKeysCheckboxChange}
                    />

                    <label htmlFor="include-black-keys-checkbox" className="cursor-pointer">
                        Include Black Keys
                    </label>
                </div>
            </div>
        </Screen>
    );
}

function Octaves ({ octaves, onOctaveCheckboxChange }) {
    return (
        <div className="flex flex-col items-center justify-between gap-2">
            {octaves.map((octave, index) => (
                <div
                    key={index}
                    className="flex flex-row items-center justify-center gap-2">
                    <input
                        id={`octave-${octave.position}`}
                        type="checkbox"
                        checked={octave.checked }
                        onChange={event => onOctaveCheckboxChange(event, index)}
                    />
                    <label htmlFor={`octave-${octave.position}`} className="cursor-pointer">
                        {octave.position} Octave
                    </label>
                </div>
            ))}
        </div>
    );
}