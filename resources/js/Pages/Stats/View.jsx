import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Statistics({ auth, backgrounds, statistics }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <p>{JSON.stringify(statistics)}</p>
        </AuthenticatedLayout>
    );
}
