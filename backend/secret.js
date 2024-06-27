const secrets = {
  dbUri:
    "mongodb+srv://user1:1WkMqeI2x7gcimPu@module1project.dyv5oyv.mongodb.net/?retryWrites=true&w=majority&appName=Module1Project",
};

const getSecret = (key) => secrets[key];

module.exports = getSecret;
