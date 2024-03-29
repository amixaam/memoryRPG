import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { useLocalStorage, usePrevious } from "@uidotdev/usehooks";
import { MaterialSymbol } from "react-material-symbols";
import { Head, Link } from "@inertiajs/react";
import { router as inertiaRouter } from "@inertiajs/react";

import shrek from "../../../public/images/shrek.webp";
import shrekHit from "../../../public/images/shrekHit.png";
import shrekKill from "../../../public/images/shrekKill.png";

import otis from "../../../public/images/otis.png";
import otisHit from "../../../public/images/otisHit.webp";
import otisKill from "../../../public/images/otisKill.webp";

import walter from "../../../public/images/walter.png";
import walterHit from "../../../public/images/walterHit.webp";
import walterKill from "../../../public/images/walterKill.webp";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
dayjs.extend(duration);

export default function Game({
    auth,
    unlocks,
    backgrounds,
    dbPoints,
    powerups,
}) {
    const [theme, setTheme] = useLocalStorage(`theme${auth.user.id}`, {
        background: "#F6B8FF",
        text: "#1F0923",
    });
    const [currentTheme, setCurrentTheme] = useState(theme, {
        background: "#F6B8FF",
        text: "#1F0923",
    });
    const bossTheme = {
        background: "#080303",
        text: "#FF3232",
    };

    const [level, setLevel] = useState(1);

    const [difficulty, setDifficulty] = useState({
        easy: 4,
        hard: 6,
    });

    const bosses = [
        {
            name: "ShreD",
            idle: shrek,
            hit: shrekHit,
            kill: shrekKill,
        },
        {
            name: "Mr. Barnyard",
            idle: otis,
            hit: otisHit,
            kill: otisKill,
        },
        {
            name: "Waltuh",
            idle: walter,
            hit: walterHit,
            kill: walterKill,
        },
    ];
    const [currentBoss, setCurrentBoss] = useState(0);

    const [shopItems, setShopItems] = useState([
        {
            price: 15000,
            name: "Theme lootbox",
            icon: "package_2",
        },
        {
            price: 5000,
            name: "See all",
            icon: "visibility",
        },
    ]);

    const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
    const [timer, setTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);

    const [gameOver, setGameOver] = useState(null);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [isInteractable, setIsInteractable] = useState(false);
    const [matched, setMatched] = useState(false);
    const [killed, setKilled] = useState(false);
    const [points, setPoints] = useState(0);

    const [cards, setCards] = useState([]);
    const [showBack, setShowBack] = useState(true);
    const [selectedCards, setSelectedsCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [errors, setErrors] = useState(0);

    const [bossLevel, setBossLevel] = useState(false);

    const [shopOpen, setShopOpen] = useState(false);
    const [themesOpen, setThemesOpen] = useState(false);
    const [lootboxOpen, setLootboxOpen] = useState(false);

    const [isOpeningLootbox, setIsOpeningLootbox] = useState(false);
    const [lootboxReward, setLootboxReward] = useState([]);
    const { width, height } = useWindowSize();
    function endGame() {
        setGameStarted(false);
        setTimerRunning(false);
        setGameOver(true);
        setGameWon(level >= 20 ? true : false);

        if (level === 1) return;

        inertiaRouter.post("/stats/store", {
            user_id: auth.user.id,
            mistakes: errors,
            moves: moves,
            level_reached: level - 1,
            timer: timer,
            points: points,
            result: level >= 20 ? true : false,
        });
    }

    function generateCards() {
        setCards([]); // Clear existing cards
        const floorLevel =
            Math.floor(level / 2) === 0 ? 1 : Math.floor(level / 2);
        let cardCount = difficulty[selectedDifficulty] * floorLevel;

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
        setCards(newCards);
        newCards.sort(() => Math.random() - 0.5);
    }

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
        // check for match
        const allMatched = matchedCards.length === cards.length;
        if (selectedCards.length === 2 && !allMatched) {
            checkForMatch();
        }
        if (allMatched && moves > 1) {
            if (level % 5 === 0) setKilled(true);
            if (level <= 20) setLevel(level + 1);
        }
    }, [selectedCards]);

    useEffect(() => {
        // for next level
        if (level === 1) return;

        setCurrentTheme(level % 5 ? theme : bossTheme);
        if (level > 20) {
            endGame();
            return;
        }
        if (level % 5 === 0) {
            setCurrentBoss(bosses[Math.floor(Math.random() * bosses.length)]);
        }
        if (level % 5 === 1) {
            setKilled(true);

            setTimeout(() => {
                setTimeout(() => {
                    setBossLevel(level % 5 === 0);
                    setSelectedsCards([]);
                    setMatchedCards([]);

                    setPoints(
                        (prevPoints) =>
                            prevPoints +
                            Math.floor(
                                cards.length * 100 +
                                    difficulty[selectedDifficulty] * 20
                            )
                    );

                    setKilled(false);
                    generateCards();
                    revealAllCards(1000 + cards.length * 100);
                }, 500);
            }, 800);
        } else {
            setTimeout(() => {
                setBossLevel(level % 5 === 0);
                setSelectedsCards([]);
                setMatchedCards([]);

                setPoints(
                    (prevPoints) =>
                        prevPoints +
                        Math.floor(
                            cards.length * 100 +
                                difficulty[selectedDifficulty] * 20
                        )
                );

                generateCards();
                revealAllCards(1000 + cards.length * 100);
            }, 750);
        }
    }, [level]);

    useEffect(() => {
        // for new game
        if (!gameStarted) return;

        setTimer(0);
        setMoves(0);
        setSelectedsCards([]);
        setMatchedCards([]);
        setPoints(0);
        setErrors(0);
        setTimerRunning(true);
        setGameOver(false);
        setGameWon(false);
        setBossLevel(false);

        generateCards();
        revealAllCards();
    }, [gameStarted]);

    useEffect(() => {
        // for theme changing
        if (currentTheme) {
            //create color palette
            const palette = chroma
                .scale([currentTheme.background, currentTheme.text])
                .colors(10);
            // change :root
            for (let i = 0; i < palette.length; i++) {
                document.documentElement.style.setProperty(
                    `--color-${i * 100}`,
                    palette[i]
                );
            }
        }
    }, [theme, currentTheme]);

    function startNewGame() {
        setLevel(1);
        setGameStarted(true);
    }
    function ChangeThemeButton(id = 1) {
        const { background, text } = JSON.parse(backgrounds[id].colors);
        setTheme({ background, text });
        setCurrentTheme({ background, text });
    }

    useEffect(() => {
        // for timer
        if (!timerRunning) return;

        const timerId = setInterval(() => setTimer((t) => t + 1), 1000);
        return () => clearInterval(timerId);
    }, [timerRunning]);
    function checkForMatch() {
        const [first, second] = selectedCards;
        setMoves(moves + 1);

        // if matched
        if (first.color === second.color && first.id !== second.id) {
            setMatchedCards([...matchedCards, first, second]);
            setSelectedsCards([]);
            [first, second].forEach((card) => (card.matched = true));

            setMatched(true);
            setTimeout(() => {
                setMatched(false);
            }, 500);
            return;
        }

        setErrors(errors + 1);
        setIsInteractable(false);

        setTimeout(() => {
            selectedCards.forEach((card) => (card.flipped = false));
            setSelectedsCards([]);
            setIsInteractable(true);
        }, 500);
    }
    function revealAllCards(delay = 1000) {
        setShowBack(true);
        setIsInteractable(false);
        setTimeout(() => {
            setShowBack(false);
            setIsInteractable(true);
        }, delay);
    }
    function generateGridCols() {
        const divisors = [];

        if (cards.length == 8) {
            return 4;
        } else if (cards.length == 20) {
            return 10;
        }
        for (let i = 15; i >= 4; i--) {
            if (cards.length % i === 0) {
                divisors.push(i);
            }
        }

        return divisors[((divisors.length - 1) / 2) | 0];
    }

    function unlockRandomTheme() {
        if (unlocks.length === backgrounds.length) {
            return 0;
        }
        let newTheme;
        let checked = 0;

        do {
            newTheme =
                backgrounds[Math.floor(Math.random() * backgrounds.length)];
            checked++;
        } while (checked <= 100 && !unlocks.some((u) => u.id === newTheme.id));

        // unlocks.push(newTheme.id);
        inertiaRouter.patch("/user/unlocks", { id: newTheme.id });
        const { background, text } = JSON.parse(newTheme.colors);
        return newTheme.id;
    }

    function buyItem(item) {
        if (points + dbPoints < item.price)
            return console.log("Not enough points");

        inertiaRouter.patch("/user/purchase", {
            name: item.name,
            price: item.price,
        });

        if (item.name === "Theme lootbox") {
            setLootboxOpen(true);
        }
        if (item.name === "See all") {
        }
    }

    function useLootbox() {
        setIsOpeningLootbox(true);
        const themeID = unlockRandomTheme();
        setLootboxReward(themeID);
        setTimeout(() => {
            ChangeThemeButton(themeID - 1);
            setIsOpeningLootbox(false);
            setTimeout(() => {
                setLootboxOpen(false);
                setLootboxReward([]);
            }, 2500);
        }, 1000 * 3);
    }
    if (gameOver) {
        return (
            <AuthenticatedLayout user={auth.user}>
                {gameWon && (
                    <Confetti width={width} height={height} recycle={false} />
                )}
                <Head title="MemoryRPG" />
                <div
                    className={`w-full h-full items-center justify-center flex flex-col gap-4 ${
                        gameWon ? "matched" : ""
                    }`}
                >
                    <h1 className="text-7xl font-extrabold">
                        {gameWon ? "Match won!" : "Match lost!"}
                    </h1>
                    <div className="text-center">
                        <p>You earned {points} points</p>
                        <p>
                            and made {moves} moves and {errors} mistakes
                        </p>
                        <p>
                            time spent:{" "}
                            {dayjs.duration(timer * 1000).format("mm:ss")}{" "}
                        </p>
                    </div>
                    <div className="flex flex-row gap-4">
                        <PrimaryButton onClick={startNewGame}>
                            Try again
                        </PrimaryButton>
                        <PrimaryButton>
                            <Link href={route("stats")}>View Stats</Link>
                        </PrimaryButton>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    } else if (!gameStarted) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title="MemoryRPG" />
                <div className="w-full h-full items-center justify-center flex flex-col gap-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold">
                        MemoryRPG
                    </h1>
                    <div className="text-center">
                        <p>You will be timed.</p>
                        <p>Match the cards and earn points for shop rewards!</p>
                        <p>Click the button below to start</p>
                    </div>
                    <PrimaryButton onClick={startNewGame}>
                        Start game
                    </PrimaryButton>
                </div>
            </AuthenticatedLayout>
        );
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="MemoryRPG" />

            {!isOpeningLootbox && lootboxReward.length != 0 && (
                <Confetti width={width} height={height} recycle={false} />
            )}

            <Modal show={shopOpen} onClose={() => setShopOpen(false)}>
                <h1 className="text-3xl font-extrabold">SHOP</h1>
                <p className="">
                    Saved points:{" "}
                    {((points + dbPoints) / 1000).toFixed(2) + "K"}
                </p>
                <div className="flex gap-2 mt-4 w-full flex-col md:flex-row">
                    {shopItems.map((item) => (
                        <div
                            key={item.name}
                            className="flex flex-col w-full md:w-fit justify-center items-center gap-2 rounded-md p-4 border-2 border-primary400 bg-primary200 hover:shadow-lg duration-100"
                        >
                            <MaterialSymbol
                                icon={item.icon}
                                size={64}
                                fill
                                grade={-25}
                                className="text-primary800"
                            />
                            <h2 className="text-lg font-extrabold uppercase">
                                {item.name}
                            </h2>
                            <div className="flex items-center justify-between w-full gap-2">
                                <p>
                                    {Math.round(item.price / 1000) + "K"} points
                                </p>
                                <PrimaryButton
                                    disabled={points + dbPoints < item.price}
                                    className={
                                        points + dbPoints < item.price
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }
                                    onClick={() => buyItem(item)}
                                >
                                    buy
                                </PrimaryButton>
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    show={shopOpen && lootboxOpen}
                    closeable={false}
                    onClose={() => setLootboxOpen(false)}
                >
                    <div
                        className={`flex flex-col items-center justify-center gap-4 ${
                            lootboxReward.length != 0 && !isOpeningLootbox
                                ? "matched"
                                : ""
                        }`}
                    >
                        <h1 className="text-4xl font-extrabold">
                            THEME LOOTBOX
                        </h1>
                        <Lootbox
                            isOpeningLootbox={isOpeningLootbox}
                            lootboxReward={lootboxReward}
                            backgrounds={backgrounds}
                        />
                        <PrimaryButton
                            style={{
                                display:
                                    isOpeningLootbox ||
                                    lootboxReward.length != 0
                                        ? "none"
                                        : "",
                            }}
                            onClick={() => useLootbox()}
                        >
                            Roll
                        </PrimaryButton>
                    </div>
                </Modal>
            </Modal>

            <Modal show={themesOpen} onClose={() => setThemesOpen(false)}>
                <h1 className="text-3xl font-extrabold">Themes</h1>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {backgrounds.map((bg) => (
                        <div className="flex flex-col items-center justify-center group hover:scale-105 transition duration-150 active:brightness-[60%]">
                            <div
                                key={bg.id}
                                className={`flex items-center justify-center bg-no-repeat bg-cover bg-center w-[5rem] aspect-square rounded-md ${
                                    !unlocks.some((u) => u === bg.id)
                                        ? "pointer-events-none opacity-50"
                                        : "cursor-pointer"
                                }`}
                                onClick={() =>
                                    unlocks.some((u) => u === bg.id) &&
                                    ChangeThemeButton(bg.id - 1)
                                }
                                style={{
                                    backgroundImage: `linear-gradient(to bottom, ${JSON.parse(bg.colors).text}, ${JSON.parse(bg.colors).background})`,
                                }}
                            >
                                {!unlocks.some((u) => u === bg.id) && (
                                    <MaterialSymbol
                                        icon="lock"
                                        size={32}
                                        fill
                                        grade={-25}
                                        className="text-white"
                                    />
                                )}
                            </div>
                            <p>{bg.name}</p>
                        </div>
                    ))}
                </div>
            </Modal>

            <ProgressBar
                max={cards.length}
                current={matchedCards.length}
                show={bossLevel}
                bossName={currentBoss.name}
                isHit={matched}
            />

            <div className="flex justify-center relative flex-col pb-4 w-full px-4 lg:px-0 backdrop-blur-xl pt-2 border-t-2 border-primary200">
                <div className="w-full flex-col flex items-center ">
                    <Statistics>
                        <p className="bg-primary0 px-3 py-1 rounded-md font-bold text-sm md:text-lg">
                            Level: {level}
                        </p>
                        <p className="bg-primary0 px-3 py-1 rounded-md font-bold text-sm md:text-lg">
                            Points: {points}
                        </p>
                        <p className="bg-primary0 px-3 py-1 rounded-md font-bold text-sm md:text-lg">
                            Timer:{" "}
                            {dayjs.duration(timer * 1000).format("mm:ss")}
                        </p>
                    </Statistics>
                    <div
                        className={`grid gap-1 sm:gap-2 md:gap-[0.6rem] w-full md:w-fit`}
                        style={{
                            gridTemplateColumns: `repeat(${generateGridCols()}, auto)`,
                        }}
                    >
                        {cards.map((card) => (
                            <Card
                                key={card.id}
                                card={card}
                                flipCard={flipCard}
                                showBack={showBack}
                                cards={cards.length}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 justify-center pt-4 flex-row">
                    {/* <PrimaryButton onClick={() => setLevel(level + 1)}>
                        next
                    </PrimaryButton> */}

                    <PrimaryButton onClick={() => endGame()}>end</PrimaryButton>
                    <PrimaryButton
                        onClick={() => {
                            inertiaRouter.patch("/user/use-powerup");
                            revealAllCards();
                        }}
                        disabled={powerups <= 0}
                        className={`${
                            powerups <= 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        See all ({powerups})
                    </PrimaryButton>
                    <PrimaryButton onClick={() => setShopOpen(true)}>
                        Shop
                    </PrimaryButton>
                    <PrimaryButton onClick={() => setThemesOpen(true)}>
                        themes
                    </PrimaryButton>
                </div>
            </div>

            <BossImage
                currentBoss={currentBoss}
                bossLevel={bossLevel}
                isMatched={matched}
                isKilled={killed}
            />
        </AuthenticatedLayout>
    );
}

function BossImage({ currentBoss, bossLevel, isMatched, isKilled }) {
    if (!bossLevel) return;

    return (
        <div className="fixed flex justify-center items-center -z-[1] bottom-40 md:bottom-[-5%]">
            <img
                src={
                    isKilled
                        ? currentBoss.kill
                        : isMatched
                          ? currentBoss.hit
                          : currentBoss.idle
                }
                alt="boss fight"
                className={`brightness-[0.05] pointer-events-none ${isMatched ? "hit" : ""} ${isKilled ? "killed" : ""}`}
            />
        </div>
    );
}

function Statistics({ children }) {
    return (
        <div className="text-primary900 flex flex-row gap-2 pointer-events-none mb-2">
            {children}
        </div>
    );
}

function ProgressBar({ max, current, show, bossName = "SHREK", isHit }) {
    const [showProgress, setShowProgress] = useState(0);

    useEffect(() => {
        setShowProgress(
            `${Math.round(Math.abs((current / max) * 100 - 100))}%`
        );
    }, [current, max]);

    if (!show) return;
    return (
        <div
            className={`pointer-events-none z-10 absolute top-0 flex flex-col items-center w-full p-4 gap-1 ${isHit ? "hit" : ""}`}
        >
            <h1 className="text-lg font-extrabold text-primary900 bg-primary0 px-3 flex justify-center items-center rounded-full">
                {bossName}
            </h1>
            <div className="text-primary0 w-full bg-primary0 rounded-full p-1">
                <div
                    style={{ width: showProgress }}
                    className="bg-primary800 rounded-full"
                >
                    <p className="ml-1 text-sm">{showProgress}</p>
                </div>
            </div>
        </div>
    );
}

function Card({ card, flipCard, showBack = false, cards }) {
    return (
        <div
            className={`min-w-[1.5rem] md:min-w-[5rem] md:max-w-[10rem] w-full aspect-square cursor-pointer group [perspective:30rem] ${card.matched ? "matched" : ""} ${showBack ? "all-matched" : ""}`}
        >
            <div
                className={
                    "relative w-full h-full duration-500 [transform-style:preserve-3d] [transform:rotateY(180deg)]" +
                    (showBack || card.flipped || card.matched
                        ? "[transform:rotateY(180deg)]"
                        : "")
                }
                onClick={() => flipCard(card)}
            >
                <div className="w-full h-full absolute">
                    <div
                        className="absolute w-full h-full flex justify-center items-center rounded-md overflow-hidden [backface-visibility:hidden]"
                        style={{
                            backgroundColor: card.color,
                            color: chroma(card.color)
                                .darken(2)
                                .desaturate(2)
                                .hex(),
                        }}
                    >
                        <span className="select-none font-extrabold text-xs md:text-md lg:text-lg opacity-0 md:opacity-100">
                            {card.color}
                        </span>
                    </div>
                </div>
                <div className="absolute [transform:rotateY(180deg)] flex justify-center items-center w-full h-full rounded-md overflow-hidden bg-primary900 text-primary0 [backface-visibility:hidden]">
                    <span className="w-full h-full select-none font-extrabold md:text-3xl text-xl flex justify-center items-center">
                        ?
                    </span>
                </div>
            </div>
        </div>
    );
}

function Lootbox({ isOpeningLootbox, lootboxReward, backgrounds }) {
    const [bgColor, setBgColor] = useState(backgrounds[0]);
    var currentI = 0;
    function swapColors() {
        const interval = setInterval(() => {
            if (!isOpeningLootbox) {
                clearInterval(interval);
            } else {
                currentI++;
                setBgColor(backgrounds[currentI % backgrounds.length]);
            }
        }, 100);
    }

    useEffect(() => {
        if (isOpeningLootbox) {
            swapColors();
        }
    }, [isOpeningLootbox]);

    if (isOpeningLootbox) {
        return (
            <div
                className="flex flex-row justify-center items-center h-32 aspect-square rounded-md"
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${
                        JSON.parse(bgColor.colors).text
                    }, ${JSON.parse(bgColor.colors).background})`,
                }}
            ></div>
        );
    }
    if (!isOpeningLootbox && lootboxReward.length != 0) {
        return (
            <div
                className="flex flex-row justify-center items-center h-32 aspect-square rounded-md"
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${
                        JSON.parse(backgrounds[lootboxReward - 1].colors).text
                    }, ${JSON.parse(backgrounds[lootboxReward - 1].colors).background})`,
                }}
            ></div>
        );
    }
    return (
        <div className="">
            <MaterialSymbol
                icon="package_2"
                size={64}
                fill
                grade={-25}
                className="text-primary800"
            />
        </div>
    );
}
