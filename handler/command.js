const { readdirSync } = require("fs");

module.exports = client => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}/`).filter(d =>
      d.endsWith(".js")
    );
    for (let file of commands) {
      let command = require(`../commands/${dirs}/${file}`);
      client.commands.set(command.name, command);
      if (command.alias)
        command.alias.forEach(alias => client.aliases.set(alias, command));
      console.log(`(:heart:) Loaded commands: ${command.name}`);
     }
  };
  ["info"].forEach(x =>
    load(x)
  );
};
