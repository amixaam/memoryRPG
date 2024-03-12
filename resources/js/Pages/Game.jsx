import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import chroma from "chroma-js";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import shrek from "../../../public/images/shrek.webp";
dayjs.extend(duration);

function Card({ card, flipCard, showBack = false }) {
    return (
        <div
            className="w-fit min-w-32 border-primary500 bg-text backdrop-blur-xl p-2 radius rounded-md aspect-square flex-1 cursor-pointer"
            onClick={() => flipCard(card)}
        >
            {showBack || card.flipped || card.matched ? (
                <p
                    style={{
                        backgroundColor: card.color,
                        color: chroma(card.color).darken(2).desaturate(2).hex(),
                    }}
                    className="h-full rounded-md flex items-center justify-center text-md font-bold p-4"
                >
                    {card.color}
                </p>
            ) : (
                <p className=""></p>
            )}
        </div>
    );
}

function ProgressBar({ max, current, show }) {
    if (!show) return;
    return (
        <div className="w-full flex justify-center">
            <div className="fixed bottom-2 w-10/12 bg-primary100 rounded-lg p-2 shadow-md">
                <div
                    className="h-4 bg-primary900 rounded-md flex items-center"
                    style={{
                        width: `${Math.abs((current / max) * 100 - 100)}%`,
                    }}
                >
                    <p className="ml-1 text-primary100">
                        {Math.round(Math.abs((current / max) * 100 - 100))}%
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Game({ auth, backgrounds }) {
    const bgColors = ["#F6B8FF", "#FFFFDD", "#123632"];
    const text = ["#1F0923", "#242414", "#D2FDF8"];

    console.log(backgrounds);
    function changeTheme() {
        const random = Math.floor(Math.random() * bgColors.length);
        const bgColor = chroma(bgColors[random]);
        const palette = chroma
            .scale([bgColors[random], text[random]])
            .colors(10);
        console.log(palette);

        document.documentElement.style.setProperty(
            "--bg-gradient",
            `linear-gradient(${palette[0]} 20%, ${palette[3]})`
        );
        for (let i = 0; i < palette.length; i++) {
            document.documentElement.style.setProperty(
                `--color-${i * 100}`,
                palette[i]
            );
        }
    }

    const [level, setLevel] = useState(1);
    const [difficulty, setDifficulty] = useState({
        easy: 2,
        medium: 4,
        hard: 6,
    });
    const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
    const [difficultyScaling, setDifficultyScaling] = useState(2);
    const [timer, setTimer] = useState(0);
    const [levelTimer, setLevelTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState();
    const [timerRunning, setTimerRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [isInteractable, setIsInteractable] = useState(false);
    const [points, setPoints] = useState(0);

    const [cards, setCards] = useState([]);
    const [showBack, setShowBack] = useState(true);
    const [selectedCards, setSelectedsCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [errors, setErrors] = useState(0);

    const [bossLevel, setBossLevel] = useState(false);

    const [shopOpen, setShopOpen] = useState(false);

    function generateCards() {
        setCards([]); // Clear existing cards
        let cardCount =
            difficulty[selectedDifficulty] + level * difficultyScaling;
        if (cardCount < 4) cardCount = 4;
        if (cardCount % 2 !== 0) cardCount = cardCount + 1;
        if (bossLevel) cardCount += 4;

        const newCards = [];
        const colorsUsed = {};

        for (let i = 0; i < cardCount / 2; i++) {
            let randomColor;

            randomColor = chroma.random().hex();

            colorsUsed[randomColor] = true; // Mark color as used

            // Combine pushing both cards into a single statement
            newCards.push(
                ...[
                    {
                        id: i * 2,
                        color: randomColor,
                        flipped: false,
                        matched: false,
                    },
                    {
                        id: i * 2 + 1,
                        color: randomColor,
                        flipped: false,
                        matched: false,
                    },
                ]
            );
        }
        console.log(cardCount);
        setCards(newCards);
        newCards.sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        // TIMER
        const interval = setInterval(() => {
            if (timerRunning) {
                setTimer(timer + 1);
                setLevelTimer(levelTimer + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timerRunning, timer]);

    function flipCard(card) {
        if (
            gameOver ||
            selectedCards.includes(card) ||
            card.matched ||
            showBack ||
            !isInteractable
        ) {
            return;
        }

        setSelectedsCards([...selectedCards, card]);
        card.flipped = true;
    }

    useEffect(() => {
        if (selectedCards.length === 2) {
            checkForMatch();
        }
        // check if all cards have been matched
        if (matchedCards.length === cards.length && moves > 1) {
            setLevel(level + 1);
        }
    }, [selectedCards]);

    useEffect(() => {
        // NEXT LEVEL
        if (level === 1) return;
        console.log("next level");
        setSelectedsCards([]);
        setMatchedCards([]);
        setPoints(
            points +
                Math.floor(
                    (cards.length * 100 + difficulty[selectedDifficulty] * 20) /
                        (levelTimer + 1)
                )
        );

        if (level % 5 === 0) {
            if (selectedDifficulty !== "easy") {
                setDifficultyScaling(difficultyScaling + 2);
            }
            setBossLevel(true);
        } else setBossLevel(false);

        setLevelTimer(0);
        generateCards();
        showAllCards(1000 + cards.length * 100);
    }, [level]);

    useEffect(() => {
        // NEW GAME
        if (gameStarted === false) return;
        console.log("new game");
        setLevel(1);
        setMoves(0);
        setSelectedsCards([]);
        setMatchedCards([]);
        setPoints(0);
        setErrors(0);
        setTimer(0);
        setDifficultyScaling(2);
        setLevelTimer(0);
        setTimerRunning(true);
        setGameOver(false);
        setGameWon(false);

        generateCards();
        showAllCards();
    }, [gameStarted]);

    function showAllCards(time = 1000) {
        setShowBack(true);
        setIsInteractable(false);
        setTimeout(() => {
            setShowBack(false);
            setIsInteractable(true);
        }, time);
    }
    function checkForMatch() {
        if (
            selectedCards[0].color === selectedCards[1].color &&
            selectedCards[0].id !== selectedCards[1].id
        ) {
            setMatchedCards([...matchedCards, ...selectedCards]);
            setSelectedsCards([]);
            setMoves(moves + 1);

            selectedCards.forEach((card) => {
                card.matched = true;
            });
        } else {
            setErrors(errors + 1);
            setSelectedsCards([]);

            setIsInteractable(false);
            setTimeout(() => {
                selectedCards.forEach((card) => {
                    card.flipped = false;
                });
                setIsInteractable(true);
                setSelectedsCards([]);
            }, 500);
        }
    }

    function startGame() {
        setGameStarted(!gameStarted);
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <style>
                {`
                    img[alt="boss fight"] {
                        -webkit-filter: invert(100%) sepia(0%) saturate(0%)
                            hue-rotate(180deg) brightness(100%) contrast(100%);
                        filter:invert(100%) sepia(0%) saturate(0%)
                            hue-rotate(180deg) brightness(100%) contrast(100%);
                    }
                `}
            </style>
            <img src={shrek} alt="boss fight" className="fixed -z-10" />

            <Modal show={shopOpen} onClose={() => setShopOpen(false)}>
                <div className="text-white">
                    <h1>SHOP</h1>
                    <p className="text-primary-200">Points: {points}</p>
                </div>
            </Modal>
            <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center h-16">
                <div className="w-full">
                    <ProgressBar
                        max={cards.length}
                        current={matchedCards.length}
                        show={bossLevel}
                    />
                </div>
            </div>

            <Head title="MemoryRPG" />
            <div className="flex gap-4 pt-4">
                <p className="text-primary900">Level {level}</p>
                <p className="text-primary900">Points: {points}</p>
                <p className="text-primary900">
                    game started: {gameStarted ? "true" : "false"}
                </p>
                <p className="text-primary900">
                    Timer: {dayjs.duration(timer * 1000).format("mm:ss")}
                </p>
                <p className="text-primary900">Scaling: {difficultyScaling}</p>
            </div>

            {/* Cards */}
            <div className="flex justify-center items-center h-4/5">
                <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            flipCard={flipCard}
                            showBack={showBack}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-4 justify-center pt-4">
                <PrimaryButton onClick={startGame}>restart</PrimaryButton>
                <PrimaryButton onClick={() => showAllCards()}>
                    Powerups
                </PrimaryButton>
                <PrimaryButton onClick={() => setShopOpen(true)}>
                    Shop
                </PrimaryButton>
                <PrimaryButton onClick={() => changeTheme()}>
                    theme
                </PrimaryButton>
            </div>
        </AuthenticatedLayout>
    );
}
