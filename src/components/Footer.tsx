'use client'

export default function Footer() {
    return (
        <div className="sm:px-8 px-4 py-4">
            <div className="text-left w-full">
                {/* <div className="mt-6 sm:mt-8 pt-4 sm:pt-6"> */}
                    <div className="flex justify-center items-center text-center">
                        <div className="text-sm dark:text-white/40 text-black/40 font-[family-name:var(--font-instrument-serif)]">
                            © {new Date().getFullYear()} Krish Bakshi. All rights reserved.
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    )
}
