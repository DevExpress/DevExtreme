let s = 123456789;
function random() {
    s = (1103515245 * s + 12345) % 2147483647;
    return s % (10 - 1);
}

function generateData(count) {
    let i;
    const surnames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Harris', 'Clark', 'Allen', 'Scott', 'Carter'];
    const names = ['James', 'John', 'Robert', 'Christopher', 'George', 'Mary', 'Nancy', 'Sandra', 'Michelle', 'Betty'];
    const gender = ['Male', 'Female'];
    const items = [];
    const startBirthDate = Date.parse('1/1/1975');
    const endBirthDate = Date.parse('1/1/1992');

    for(i = 0; i < count; i++) {
        const birthDate = new Date(startBirthDate + Math.floor(
            random() *
            (endBirthDate - startBirthDate) / 10));
        birthDate.setHours(12);

        const nameIndex = random();
        const item = {
            id: i + 1,
            firstName: names[nameIndex],
            lastName: surnames[random()],
            gender: gender[Math.floor(nameIndex / 5)],
            birthDate: birthDate
        };
        items.push(item);
    }
    return items;
}
