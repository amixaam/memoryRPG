import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import chroma from "chroma-js";
import { useEffect, useState } from "react";

export default function Game({ auth }) {
    const colors = ["red", "blue", "yellow", "green"];
    function changeTheme() {
        document.documentElement.style.setProperty(
            "--bg",
            colors[Math.floor(Math.random() * colors.length)]
        );
    }

    let level = 1;
    let difficulty = {
        easy: 2,
        medium: 4,
        hard: 6,
    };
    let selectedDifficulty = 0;
    let difficultyScaling = 2;
    let timer = 0;
    let timerInterval;
    let timerRunning = false;
    let gameOver = false;
    let gameWon = false;
    let gameStarted = false;

    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedsCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [testMessage, setTestMessage] = useState("Hello!");

    function generateCards() {
        setCards([]); // Clear existing cards
        // const cardCount = difficulty[selectedDifficulty] * level;
        const cardCount = 10;

        const newCards = [];
        const colorsUsed = {}; // Track used colors

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
        setCards(newCards);
    }

    function flipCard(card) {
        if (
            gameOver ||
            selectedCards.includes(card) ||
            matchedCards.includes(card)
        ) {
            return;
        }

        setSelectedsCards([...selectedCards, card]);
    }

    useEffect(() => {
        if (selectedCards.length === 2) {
            checkForMatch();
        }
    }, [selectedCards]);

    function checkForMatch() {
        if (
            selectedCards[0].color === selectedCards[1].color &&
            selectedCards[0].id !== selectedCards[1].id
        ) {
            setMatchedCards([...matchedCards, ...selectedCards]);
            setTestMessage("Match found!");
            setSelectedsCards([]);
            setMoves(moves + 1);
        } else {
            setTestMessage("No match found!");
            setSelectedsCards([]);
        }
    }

    function startGame() {
        setSelectedsCards([]);
        setMatchedCards([]);
        setMoves(0);
        setTestMessage("Game started!");
        generateCards();
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="MemoryRPG" />
            <div className="gap-4 flex-row flex flex-wrap w-full">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="w-fit bg-slate-500 p-2 radius rounded-md aspect-square min-w-36 cursor-pointer"
                        onClick={() => flipCard(card)}
                    >
                        <p
                            style={{
                                backgroundColor: card.color,
                                color: chroma(card.color)
                                    .darken(2)
                                    .desaturate()
                                    .hex(),
                            }}
                            className="h-full rounded-md flex items-center justify-center shadow-md text-md font-bold"
                        >
                            {card.color}
                        </p>
                    </div>
                ))}
            </div>
            <PrimaryButton onClick={startGame}>Generate Cards</PrimaryButton>
            <p className="text-primary-200 py-4">{testMessage}</p>
            <div className="flex flex-col gap-4">
                <span className=" text-white">{JSON.stringify(cards)}</span>

                <span className=" text-white">
                    selected cards:
                    {JSON.stringify(selectedCards)}
                </span>

                <span className=" text-white">
                    matched cards:
                    {JSON.stringify(matchedCards)}
                </span>
            </div>
        </AuthenticatedLayout>
    );
}
