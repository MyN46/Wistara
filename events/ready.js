
module.exports = client => {
  console.log(
    `(👌) Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`
  );
  
  client.user.setActivity(`..help Aweh | ${client.users.cache.size} users`, { type: "PLAYING" },5000)
 }
