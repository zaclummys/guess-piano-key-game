import { twMerge } from 'tailwind-merge';

export function Button ({
    className,
    children,
    ...props
}) {
    const buttonClassName = twMerge(
        'flex flex-row items-center gap-2 px-4 py-2 text-sm font-semibold text-white',
        className
    );

    return (
        <button className={buttonClassName}  {...props}>
            {children}
        </button>
    );
}

export function BigButton ({
    className,
    children,
    ...props
}) {
    const buttonClassName = twMerge(
        'flex flex-row items-center gap-2 px-6 py-3 text-xl font-bold text-white',
        className
    );

    return (
        <button className={buttonClassName} {...props}>
            {children}
        </button>
    );
}
