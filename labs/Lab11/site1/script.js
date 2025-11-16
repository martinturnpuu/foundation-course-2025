const student = {
    name: "Mohammed",
    contact: {
        email: "dummy@dummy.com",
        phone: "1234-123",
        address: {
            street: "home address",
            city: "fake",
            country: "anywhere"
        }
    },
    courses: ["Math","Science","History"]
}

console.log(student.contact.email);
console.log(student.contact.address.city);
console.log(student.emergency?.phone);

let {firstName, name} = student;

console.log(firstName, name);