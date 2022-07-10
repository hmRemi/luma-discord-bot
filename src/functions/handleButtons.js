const fs = require('fs');

module.exports = async (client) => {
    client.handleButtons = async (buttonFolders, path) => {
        client.buttonsArray = [];
        for (folder of buttonFolders) {
            const buttonFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of buttonFiles) {
                const button = require(`../buttons/${folder}/${file}`);

                client.buttons.set(button.id, button);
                console.log(`Added ${button}`);
            }
        }
    }
}