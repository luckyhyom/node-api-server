export function stubGetSocketIO() {
    return {
        emit: (a,b) => true
    }
}