/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
 
let roleUpgrader = {
    run: function(creep, rs) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('--Harvesting--');
        }
        
        
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.memory.harvestNode = -1;
            rs.removeWorker(creep.name);
            creep.say('--Upgrading--');
        }
        
        
        
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            //Call addWorker with the current creep.name and return -1 or the source.id
            let hNode = rs.addWorker(creep.name);
            if (hNode > -1) {
                creep.memory.harvestNode = hNode;
            }
            
            //If the memory is undefined or -1 at this point, it needs a source to harvest:
            //Call removeWorker to fully remove them from the rs object, add worker back in and assign returned source.id to memory
            if (creep.memory.harvestNode == undefined || creep.memory.harvestNode == -1) {
                rs.removeWorker(creep.name);
                creep.memory.harvestNode = rs.addWorker(creep.name);
            }

            //Move to selected source mode
            if (creep.harvest(Game.getObjectById(creep.memory.harvestNode)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.harvestNode), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleUpgrader;