import { useEffect, useState } from 'react';

const appVoices = {};

export const useSpeechSynthesis = (props) => {
    const [isSupported, setIsSupported] = useState(false);

    const processVoices = (voiceOptions) => {
        appVoices.englishVoice = voiceOptions.find(voice => voice.name === "Daniel (English (United Kingdom))");
        appVoices.polishVoice = voiceOptions.find(voice => voice.name === "Google polski");
    }

    const getVoices = () => {
        let voiceOptions = window.speechSynthesis.getVoices();
        if (voiceOptions.length) {
            processVoices(voiceOptions);
        }

        window.speechSynthesis.onvoiceschanged = (event) => {
            voiceOptions = event.target.getVoices();
            processVoices(voiceOptions);
        };
    }

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            setIsSupported(true);
            getVoices();
        }
    }, []);

    const speak = (args = {}) => {
        const { voice = null, text = "" } = args;
        if (!isSupported) return;
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    };

    return { speak, appVoices }
}
