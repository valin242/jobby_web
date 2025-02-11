import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center text-sm text-gray-600">
                <p>© 2025 Jobby. All rights reserved.</p>
                <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Image
                    aria-hidden
                    src="/file.svg"
                    alt="File icon"
                    width={16}
                    height={16}
                />
                Learn
                </a>
                <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Image
                    aria-hidden
                    src="/window.svg"
                    alt="Window icon"
                    width={16}
                    height={16}
                />
                Examples
                </a>
                <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Image
                    aria-hidden
                    src="/globe.svg"
                    alt="Globe icon"
                    width={16}
                    height={16}
                />
                Go to jobby.ai →
                </a>
            </div>
        </footer>
    )
};