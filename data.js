// Dog list (in memory — resets when the server restarts)
module.exports = {
  nextId: 4,
  dogs: [
    { id: 1, name: "Buddy", breed: "Labrador", age: 3 },
    { id: 2, name: "Bella", breed: "Beagle", age: 5 },
    { id: 3, name: "Max", breed: "German Shepherd", age: 2 },
  ],
};
