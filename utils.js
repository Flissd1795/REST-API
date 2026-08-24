function findData(id, list) {
  return list.find((d) => d.id === id);
}

function getId(endpoint) {
  return Number(endpoint.split("/")[2]);
}

module.exports = { findData, getId };
