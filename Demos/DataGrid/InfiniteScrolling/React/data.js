let s = 123456789;
function random() {
  s = (1103515245 * s + 12345) % 2147483647;
  return s % (10 - 1);
}

export function generateData(count) {
  var i;
  var surnames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Anderson', 'Harris', 'Clark', 'Allen', 'Scott', 'Carter'];
  var names = ['James', 'John', 'Robert', 'Christopher', 'George', 'Mary', 'Nancy', 'Sandra', 'Michelle', 'Betty'];
  var gender = ['Male', 'Female'];
  var items = [],
    startBirthDate = Date.parse('1/1/1975'),
    endBirthDate = Date.parse('1/1/1992');

  for (i = 0; i < count; i++) {
    var birthDate = new Date(startBirthDate + Math.floor(
      random() *
                (endBirthDate - startBirthDate) / 10));
    birthDate.setHours(12);

    var nameIndex = random();
    var item = {
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
