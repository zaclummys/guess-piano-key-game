import { twMerge } from 'tailwind-merge';

export default function Screen ({ className, children }) {
    const screenClassName = twMerge(
        'flex flex-col h-screen',
        className
    );

    return (
        <div className={screenClassName}>
            {children}
        </div>
    );
}