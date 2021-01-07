/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */

let roleHarvester = {
    run: function(creep, rs) {
        if (creep.store.getFreeCapacity() > 0) {
            
            /*
            harvest source energy code
            uses the roomSource class to keep track of which creeps are at which source to avoid issues with ineffecient assignment
            */
            
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

         } else {
            rs.removeWorker(creep.name);
            let targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity([RESOURCE_ENERGY]) > 0; }
            });
            if (targets.length > 0) {
                rs.removeWorker(creep.name);
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.moveTo(4,40);
                }
            } else {
                creep.moveTo(5, 40);
            }
        }
    }
}

module.exports = roleHarvester;