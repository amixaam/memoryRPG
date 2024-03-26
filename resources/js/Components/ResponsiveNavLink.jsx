import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? "border-primary200  text-primary0  bg-primary700 focus:text-primary900  focus:bg-primary0  focus:border-primary900"
                    : "border-transparent text-primary100  hover:text-primary900 hover:bg-primary100 hover:border-primary900  focus:text-primary900  focus:bg-primary0 focus:border-primary900"
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
