import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { MaterialSymbol } from "react-material-symbols";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default function Statistics({ auth, statistics, leaderboard }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Statistics" />
            <div className="grid grid-rows-2 md:grid-cols-[auto_1fr] gap-8 w-full h-full pt-4 px-4">
                <div className="flex flex-col w-full h-full gap-4">
                    <h1 className="text-4xl text-primary900">Statistics</h1>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 place-items-center">
                        {statistics
                            .slice()
                            .reverse()
                            .map((statistic, index) => (
                                <div
                                    key={index}
                                    className="text-2xl text-primary900 w-full md:w-fit min-w-[13rem] h-fit py-2 bg-primary200 items-center flex flex-col border-4 border-primary700 rounded-lg shadow-md"
                                >
                                    <p className="text-sm opacity-50">
                                        {Intl.DateTimeFormat("en-US").format(
                                            new Date(statistic.created_at)
                                        )}
                                        {" - "}
                                        {dayjs
                                            .duration(statistic.timer * 1000)
                                            .format("mm:ss")}
                                    </p>
                                    <MaterialSymbol
                                        icon={
                                            statistic.result
                                                ? "trophy"
                                                : "sentiment_dissatisfied"
                                        }
                                        size={64}
                                        fill
                                        grade={-25}
                                        className="text-primary800"
                                    />
                                    <p>{statistic.result ? "WIN" : "LOSE"}</p>
                                    <p>{statistic.points} points</p>
                                    <div className="flex flex-row gap-2 mt-4">
                                        <div className=" bg-red-500 px-2 flex justify-center rounded-lg pb-[1px]">
                                            {statistic.mistakes}
                                        </div>
                                        <div className=" bg-green-500 px-2 flex justify-center rounded-lg pb-[1px]">
                                            {statistic.moves}
                                        </div>
                                        <div className=" bg-yellow-500 px-2 flex justify-center items-center rounded-lg pb-[1px]">
                                            <MaterialSymbol
                                                icon={"trophy"}
                                                size={24}
                                                fill
                                                grade={-25}
                                                className="text-primary800"
                                            />
                                            {String(
                                                statistic.level_reached
                                            ).padStart(2, "0")}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex flex-col w-full h-full gap-4">
                    <h1 className="text-4xl text-primary900">Leaderboard</h1>
                    <div className="border-4 rounded-lg border-primary700 flex flex-col gap-1 bg-primary100">
                        {Object.entries(leaderboard)
                            .sort((a, b) => b[1].points - a[1].points)
                            .map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex flex-col py-4 px-4 rounded-lg bg-primary200"
                                >
                                    <div className="flex flex-row justify-between">
                                        <h1 className="text-2xl text-primary900">
                                            {value.name}
                                        </h1>
                                        <p className="text-xl text-primary900 opacity-50">
                                            {Intl.DateTimeFormat(
                                                "en-US"
                                            ).format(
                                                new Date(value.created_at)
                                            )}
                                        </p>
                                    </div>
                                    <p className="text-xl text-primary700">
                                        {value.points} points
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
