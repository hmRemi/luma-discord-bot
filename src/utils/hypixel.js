const HypixelAPIReborn = require('hypixel-api-reborn');
const hypixel = new HypixelAPIReborn.Client("a6e6b175-43f1-4347-9b87-3d4fdc9d49a4", { cache: true });
const errors = HypixelAPIReborn.Errors

module.exports.hypixel = hypixel;
module.exports.errors = errors;