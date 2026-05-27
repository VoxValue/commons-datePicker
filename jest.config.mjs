/** @type {import('jest').Config} */
export default {
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: {
                    jsx: "react-jsx",
                    module: "esnext",
                    moduleResolution: "bundler"
                }
            }
        ]
    },
    testEnvironment: "node",
    setupFiles: ["<rootDir>/jest.setup.ts"],
    testMatch: ["<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
};
