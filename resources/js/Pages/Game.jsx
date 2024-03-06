import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import chroma from "chroma-js";
import { useState } from "react";

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
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let timer = 0;
    let timerInterval;
    let timerRunning = false;
    let gameOver = false;
    let gameWon = false;
    let gameStarted = false;

    const [cards, setCards] = useState([]);

    function generateCards() {
        setCards([]); // Clear existing cards
        // const cardCount = difficulty[selectedDifficulty] * level;
        const cardCount = 10;

        const newCards = [];
        const colorsUsed = {}; // Track used colors

        for (let i = 0; i < cardCount / 2; i++) {
            let randomColor;

            // Ensure unique colors for each pair
            do {
                randomColor = chroma.random();
            } while (colorsUsed[randomColor]);

            colorsUsed[randomColor] = true; // Mark color as used

            // Combine pushing both cards into a single statement
            newCards.push(
                ...[
                    {
                        id: i,
                        color: randomColor,
                        flipped: false,
                        matched: false,
                    },
                    {
                        id: i,
                        color: randomColor,
                        flipped: false,
                        matched: false,
                    },
                ]
            );
        }
        setCards(newCards);
    }

    function startGame() {}
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="MemoryRPG" />
            <div className="gap-4 flex-row flex flex-wrap w-full">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="w-fit bg-slate-500 p-2 radius rounded-md aspect-square min-w-36"
                    >
                        <p
                            style={{
                                backgroundColor: card.color,
                            }}
                            className="h-full rounded-md flex items-center justify-center"
                        >
                            {card.color}
                        </p>
                    </div>
                ))}
            </div>
            <PrimaryButton onClick={generateCards}>
                Generate Cards
            </PrimaryButton>
            <p className="text-primary-200 py-4">hi</p>
            <span className=" text-white">{JSON.stringify(cards)}</span>
        </AuthenticatedLayout>
    );
}
