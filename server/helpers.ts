export function getNextNumber(code: string): string | null {
    const lettersMatch = code.match(/[a-zA-Z]+/);
    const numbersMatch = code.match(/\d+/);

    if (lettersMatch && numbersMatch) {
        const letters = lettersMatch[0];
        const numbers = numbersMatch[0];
        return `${letters}${parseInt(numbers) + 1}`
    } else {
        return null;
    }
}

export function generateTrashNames(transactionDetail: any) {
    const trashNames = transactionDetail.map((detail: any) => detail.trash.name);

    return trashNames.join(', ');
}