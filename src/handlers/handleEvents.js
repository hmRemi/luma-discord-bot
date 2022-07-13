const fs = require('fs');

module.exports = async (client) => {
    client.handleEvents = async (eventFolders, path) => {
        console.log("-----------------------------")
        console.log("Handling Events:");
        for (folder of eventFolders) {
            const eventFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of eventFiles) {
                const event = require(`../events/${folder}/${file}`);

                if(event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log(`Added ${file} (${event.name})`);
            }
            console.log("-----------------------------")
        }
    }
}

/*module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        for(const file of eventFiles) {
            //const event = require(`../events/${file}`);
            const event = require(`../commands/${path}/${file}`)

            if(event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    };
}*/