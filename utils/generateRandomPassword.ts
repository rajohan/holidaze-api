const generateRandomPassword = (): string => {
    return Math.random().toString(36).substr(2, 8);
};

export { generateRandomPassword };
