import React from "react"

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div
            className="flex justify-center items-center bg-gray-100 p-4 rounded-lg shadow-lg"
            style={{
                backgroundImage: `url('/nature.webp')`,
                width: '1400px',
                height: '600px'
            }}
        >
            {children}
        </div>
    )
}

export default Wrapper

