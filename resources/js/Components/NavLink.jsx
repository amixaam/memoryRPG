import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "border-primary900 text-primary0  focus:border-primary700"
                    : "border-transparent text-primary200 hover:text-primary0 hover:border-primary900 focus:border-primary0 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
