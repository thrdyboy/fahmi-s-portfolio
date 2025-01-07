'use client'

import Wrapper from "<prefix>/components/wrapper"

export default function About() {
    return (
        <Wrapper>
            <div className="max-w-4xl w-full bg-white p-8 rounded-xl shadow-xl">
                <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Story Blog for All</h1>
                <p className="text-lg text-center text-gray-600 mb-8">Your ultimate destination for immersive storytelling!</p>

                <div className="text-lg text-gray-700 space-y-6">
                    <p>
                        Welcome to <span className="font-semibold text-blue-500">Story Blog for All</span>—your ultimate destination for immersive storytelling! Dive into a world where every genre you can imagine comes to life. Whether you're a fan of romance, mystery, fantasy, sci-fi, or horror, we've got it all covered.
                    </p>
                    <p>
                        Many genres that you want, also seems like you're on the story. Our platform is designed to transport you directly into the heart of the narrative. With vivid descriptions and engaging plots, you'll feel like you're living every moment alongside the characters. From heart-pounding adventures to tear-jerking dramas, there's always a new story waiting to captivate your imagination.
                    </p>
                    <p>
                        Join our community of passionate readers and writers, and discover a universe where stories know no bounds. At <span className="font-semibold text-blue-500">Story Blog for All</span>, every tale is an adventure waiting to be experienced.
                    </p>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">Discover your next favorite story now!</p>
                </div>
            </div>
        </Wrapper>
    )
}
