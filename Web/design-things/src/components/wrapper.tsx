import React from "react"

const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative flex flex-col w-full min-h-screen overflow-auto bg-gray-100">
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 opacity-20"></div>
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-b from-purple-400 via-transparent to-blue-400 opacity-20"></div>
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    )
}

export default Wrapper

