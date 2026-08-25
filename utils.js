// Get the id from a path like /dogs/68a1b2c3d4e5f6789012345
function getId(endpoint) {
  return endpoint.split("/")[2];
}

module.exports = { getId };
